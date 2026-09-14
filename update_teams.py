#!/usr/bin/env python3
"""
Atualiza os dados de times e eventos locais do NASA Space Apps Challenge.

Consulta a API GraphQL oficial e grava os JSONs que a aplicação Angular lê.
Os arquivos são versionados por edição, em `src/assets/data/<ano>/`:

    teams.json            times de Uberlândia (telas /times e Sala de Guerra)
    otherCitiesTeams.json times das demais sedes (comparativos da Sala de Guerra)
    localEvents.json      todas as sedes do mundo (ranking global)

Uso:
    python update_teams.py              # edição corrente (2026)
    python update_teams.py --year 2025  # reprocessa uma edição anterior
    python update_teams.py --only uberlandia

Observação: em 2026 a formação de equipes só abre em 17/09, então rodar o
script antes disso grava `teams.json` legitimamente vazio.
"""

import argparse
import json
import os
import sys
import time
from typing import Any, Dict, List

import requests

API_URL = "https://api.spaceappschallenge.org/graphql"

# Edição corrente. Precisa bater com CURRENT_CHALLENGE_YEAR no front
# (src/app/shared/data/challenges.data.ts).
CURRENT_YEAR = 2026

PAGE_SIZE = 100
# Respiro entre páginas para não martelar a API.
PAGE_DELAY_SECONDS = 0.5


def build_headers(year: int, tab: str = "") -> Dict[str, str]:
    referer = f"https://www.spaceappschallenge.org/{year}/local-events"
    if tab:
        referer += f"/?tab={tab}"
    return {
        "Content-Type": "application/json",
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        ),
        "Accept": "application/json",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
        "Origin": "https://www.spaceappschallenge.org",
        "Referer": referer,
    }


# ─────────────────────────────────────────────────────────────
# Queries GraphQL
# ─────────────────────────────────────────────────────────────

TEAMS_QUERY = """query Teams($first: Int!, $after: String, $filtering: [Filter!], $q: String) {
  teams(first: $first, after: $after, filtering: $filtering, q: $q) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
      __typename
    }
    totalCount
    edges {
      __typename
      cursor
      node {
        __typename
        id
        ...CoreTeamFields
      }
    }
    __typename
  }
}

fragment CoreTeamFields on TeamPage {
  id
  title
  meta {
    ...ExpandedPageMetaFields
    __typename
  }
  owner
  ownerDetails {
    id
    username
    __typename
  }
  excerpt
  project
  projectDetails {
    ...CoreProjectFields
    __typename
  }
  projectSubmitted
  featuredImage {
    ...CustomImageFields
    __typename
  }
  description
  desiredSkills
  languages
  challenge
  challengeDetails {
    id
    title
    meta {
      ...ExpandedPageMetaFields
      __typename
    }
    excerpt
    __typename
  }
  location
  locationDetails {
    id
    title
    displayName
    meta {
      ...ExpandedPageMetaFields
      __typename
    }
    country
    __typename
  }
  event
  joinEnabled
  memberships {
    user
    userDetails {
      id
      fullName
      username
      country
      avatar {
        ...CustomImageFields
        __typename
      }
      __typename
    }
    __typename
  }
  nominationBadges
  awardBadges
  __typename
}

fragment ExpandedPageMetaFields on ExpandedPageMeta {
  type
  slug
  firstPublishedAt
  lastPublishedAt
  relativeUrl
  live
  parent {
    id
    __typename
  }
  __typename
}

fragment CoreProjectFields on Project {
  id
  name
  summary
  demoLink
  projectLink
  details
  solution
  aiReferences
  dataReferences
  projectReferences
  isSubmitted
  savedAt
  submittedAt
  __typename
}

fragment CustomImageFields on DefaultImage {
  id
  meta {
    type
    downloadUrl
    __typename
  }
  title
  alt
  caption
  displaySize
  rendition {
    ...BaseImageFields
    __typename
  }
  __typename
}

fragment BaseImageFields on BaseImage {
  url
  fullUrl
  height
  width
  __typename
}"""

LOCATIONS_QUERY = """query OpenLocations($first: Int!, $after: String, $filtering: [Filter!], $q: String) {
  openLocations(first: $first, after: $after, filtering: $filtering, q: $q) {
    totalCount
    edges {
      cursor
      node {
        ...OpenLocationFields
        __typename
      }
      __typename
    }
    pageInfo {
      endCursor
      hasNextPage
      __typename
    }
    __typename
  }
}

fragment OpenLocationFields on LocationFeature {
  type
  geometry {
    type
    coordinates
    __typename
  }
  properties {
    id
    title
    meta {
      type
      htmlUrl
      __typename
    }
    country
    displayName
    cachedRegistrations
    eventType
    registrationEnabled
    isHostEvent
    __typename
  }
  __typename
}"""


def post_graphql(operation: str, query: str, variables: Dict[str, Any],
                 headers: Dict[str, str]) -> Dict[str, Any]:
    """
    Dispara uma operação GraphQL e devolve o bloco `data`.

    A API aceita batch (lista de operações); mandamos uma só e lemos o índice 0.
    Erros de GraphQL chegam com HTTP 200, por isso a checagem explícita.
    """
    payload = [{"operationName": operation, "variables": variables, "query": query}]
    response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
    response.raise_for_status()

    body = response.json()
    if not body:
        raise ValueError(f"Resposta vazia da API para a operação {operation}")

    result = body[0]
    if "errors" in result:
        raise ValueError(f"API retornou erro em {operation}: {json.dumps(result['errors'], ensure_ascii=False)}")
    if "data" not in result:
        raise ValueError(f"Resposta de {operation} sem o bloco 'data'")

    return result["data"]


def paginate(operation: str, query: str, root_field: str,
             base_variables: Dict[str, Any], headers: Dict[str, str],
             label: str) -> Dict[str, Any]:
    """Percorre todas as páginas de uma conexão e devolve todas as arestas."""
    all_edges: List[Dict[str, Any]] = []
    after_cursor = ""
    page_num = 1
    total_count = 0

    while True:
        variables = {**base_variables, "first": PAGE_SIZE, "after": after_cursor}
        data = post_graphql(operation, query, variables, headers)
        connection = data[root_field]

        edges = connection.get("edges", [])
        page_info = connection.get("pageInfo", {})
        total_count = connection.get("totalCount", 0)
        all_edges.extend(edges)

        print(f"    página {page_num}: {len(edges)} de {total_count} ({label})")

        if not page_info.get("hasNextPage", False):
            break

        after_cursor = page_info.get("endCursor", "")
        page_num += 1
        time.sleep(PAGE_DELAY_SECONDS)

    return {"totalCount": total_count, "edges": all_edges}


# ─────────────────────────────────────────────────────────────
# Eventos locais
# ─────────────────────────────────────────────────────────────

def fetch_local_events(year: int) -> Dict[str, Any]:
    """Busca todas as sedes oficiais da edição."""
    print(f"\n=== EVENTOS LOCAIS {year} ===")
    result = paginate(
        operation="OpenLocations",
        query=LOCATIONS_QUERY,
        root_field="openLocations",
        base_variables={
            "q": "",
            "filtering": [{
                "field": "event",
                "value": f"{year} NASA Space Apps Challenge",
                "compare": "eq",
            }],
        },
        headers=build_headers(year),
        label="sedes",
    )

    edges = result["edges"]
    return {
        "pageInfo": {
            "hasPreviousPage": False,
            "hasNextPage": False,
            "startCursor": edges[0]["cursor"] if edges else "",
            "endCursor": edges[-1]["cursor"] if edges else "",
            "__typename": "PageInfo",
        },
        "totalCount": result["totalCount"],
        "edges": edges,
        "__typename": "LocationConnection",
    }


def index_locations_by_name(events: Dict[str, Any]) -> List[Dict[str, str]]:
    """Achata as sedes em (id, title, displayName) para casar com nomes de cidade."""
    locations = []
    for edge in events.get("edges", []):
        props = edge.get("node", {}).get("properties", {})
        locations.append({
            "id": props.get("id", ""),
            "title": props.get("title", "") or "",
            "displayName": props.get("displayName", "") or "",
            "country": props.get("country", "") or "",
        })
    return locations


def match_cities(locations: List[Dict[str, str]], city_names: List[str]) -> Dict[str, Dict[str, str]]:
    """
    Casa os nomes de cidade procurados com as sedes da edição.

    Nome exato primeiro, substring só como plano B: por substring "Salvador"
    casava com "San Salvador" (El Salvador) e contaminava o comparativo
    brasileiro com uma sede de outro país.
    """
    matched: Dict[str, Dict[str, str]] = {}

    for city_name in city_names:
        needle = city_name.lower().strip()

        exact = next(
            (loc for loc in locations
             if needle in (loc["title"].lower(), loc["displayName"].lower())),
            None,
        )
        partial = next(
            (loc for loc in locations
             if needle in loc["title"].lower() or needle in loc["displayName"].lower()),
            None,
        )

        loc = exact or partial
        if not loc:
            continue

        matched[city_name] = loc
        note = "" if exact else f"  (aproximado: '{city_name}' ~ '{loc['title']}')"
        print(f"  [OK] {city_name} -> {loc['title']}, {loc['country']} ({loc['id']}){note}")

    missing = [c for c in city_names if c not in matched]
    if missing:
        print(f"  [AVISO] sem sede nesta edição: {', '.join(missing)}")

    return matched


# ─────────────────────────────────────────────────────────────
# Times
# ─────────────────────────────────────────────────────────────

def fetch_teams_for_location(location: Dict[str, str], year: int) -> Dict[str, Any]:
    """Busca todos os times de uma sede."""
    print(f"  {location['title']}:")
    result = paginate(
        operation="Teams",
        query=TEAMS_QUERY,
        root_field="teams",
        base_variables={
            "q": "",
            "filtering": [{"field": "location", "value": location["id"], "compare": "id"}],
        },
        headers=build_headers(year, tab="teams"),
        label=location["title"],
    )

    edges = result["edges"]
    return {
        "locationId": location["id"],
        "locationName": location["title"],
        "teams": {
            "pageInfo": {
                "hasPreviousPage": False,
                "hasNextPage": False,
                "startCursor": edges[0]["cursor"] if edges else "",
                "endCursor": edges[-1]["cursor"] if edges else "",
                "__typename": "PageInfo",
            },
            "totalCount": result["totalCount"],
            "edges": edges,
            "__typename": "TeamPageConnection",
        },
    }


def fetch_teams_for_cities(locations: List[Dict[str, str]], city_names: List[str],
                           year: int) -> List[Dict[str, Any]]:
    matched = match_cities(locations, city_names)
    return [fetch_teams_for_location(loc, year) for loc in matched.values()]


# ─────────────────────────────────────────────────────────────
# Escrita
# ─────────────────────────────────────────────────────────────

def data_dir(year: int) -> str:
    path = os.path.join("src", "assets", "data", str(year))
    os.makedirs(path, exist_ok=True)
    return path


def write_json(year: int, filename: str, payload: Any) -> str:
    path = os.path.join(data_dir(year), filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    return path


def write_cities_file(year: int, filename: str, cities_data: List[Dict[str, Any]], title: str) -> None:
    path = write_json(year, filename, {"data": cities_data})
    print(f"\n{path} gravado.")
    print(f"=== {title} ===")

    total = 0
    for city in cities_data:
        count = len(city.get("teams", {}).get("edges", []))
        total += count
        print(f"  - {city.get('locationName', '?')}: {count} times")
    print(f"  Total: {total} times em {len(cities_data)} sedes")


def write_local_events_file(year: int, events: Dict[str, Any]) -> None:
    path = write_json(year, "localEvents.json", {"data": events.get("edges", [])})
    print(f"\n{path} gravado.")
    print(f"  Sedes: {len(events.get('edges', []))} de {events.get('totalCount', 0)}")


# ─────────────────────────────────────────────────────────────
# Cidades acompanhadas
# ─────────────────────────────────────────────────────────────

HOME_CITY = ["Uberlândia"]

BRAZILIAN_CITIES = [
    "Aracaju", "Balneário Camboriú", "Belém", "Bento Gonçalves", "Boa Vista",
    "Botucatu", "Campina Grande", "Campinas", "Campo Mourão",
    "Campos dos Goytacazes", "Caxias do Sul", "Cianorte", "Contagem", "Cuiaba",
    "Florianopolis", "Fortaleza", "Goiânia", "Guarulhos", "Itajubá",
    "Jaguariúna", "João Pessoa", "Juazeiro do Norte", "Juiz de Fora", "Lajeado",
    "Limeira", "Londrina", "Maceió", "Manaus", "Mariana", "Maringá", "Marília",
    "Niterói", "Petrolina", "Pouso Alegre", "Poços de Caldas", "Recife",
    "Ribeirao Preto", "Rio de Janeiro", "Salvador", "Santa Cruz das Palmeiras",
    "Santo André", "Sorocaba", "São Gonçalo", "São José do Rio Preto",
    "São José dos Campos", "São João da Boa Vista", "São Luis", "São Paulo",
    "Tefé", "Vilhena", "Vitória da Conquista",
]

INTERNATIONAL_CITIES = [
    "Harohalli", "Cairo", "Kanjirappally", "Abu Dhabi", "Coimbatore",
    "Chikkamagaluru", "Kochi", "Thrissur", "Nashik",
]


def main() -> int:
    parser = argparse.ArgumentParser(description="Atualiza os dados de times e sedes do Space Apps.")
    parser.add_argument("--year", type=int, default=CURRENT_YEAR,
                        help=f"edição a buscar (padrão: {CURRENT_YEAR})")
    parser.add_argument("--only", choices=["uberlandia", "other-cities", "events"],
                        help="atualiza apenas uma parte dos dados")
    args = parser.parse_args()
    year = args.year

    try:
        print(f"Atualizando dados da edição {year}...")

        # As sedes vêm primeiro: é delas que saem os IDs usados na busca de times.
        events = fetch_local_events(year)
        locations = index_locations_by_name(events)

        if not locations:
            print(f"\n[ERRO] Nenhuma sede encontrada para {year}. "
                  f"A edição já existe na API?")
            return 1

        if args.only in (None, "events"):
            write_local_events_file(year, events)

        if args.only in (None, "uberlandia"):
            print(f"\n=== TIMES DE UBERLÂNDIA {year} ===")
            write_cities_file(year, "teams.json",
                              fetch_teams_for_cities(locations, HOME_CITY, year),
                              "UBERLÂNDIA")

        if args.only in (None, "other-cities"):
            other_cities = BRAZILIAN_CITIES + INTERNATIONAL_CITIES
            print(f"\n=== TIMES DAS OUTRAS SEDES {year} ===")
            print(f"  {len(BRAZILIAN_CITIES)} brasileiras + "
                  f"{len(INTERNATIONAL_CITIES)} internacionais")
            write_cities_file(year, "otherCitiesTeams.json",
                              fetch_teams_for_cities(locations, other_cities, year),
                              "OUTRAS SEDES")

        print(f"\n=== EDIÇÃO {year} ATUALIZADA ===")
        return 0

    except Exception as exc:
        print(f"\n[ERRO] {exc}")
        return 1


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.exit(main())
