import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map, catchError, tap, switchMap, startWith } from 'rxjs/operators';

export interface TeamData {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  desiredSkills: string;
  languages: string;
  projectSubmitted: boolean;
  challengeDetails?: {
    id: string;
    title: string;
    excerpt: string;
  };
  locationDetails?: {
    id: string;
    title: string;
    displayName: string;
    country: string;
  };
  memberships: Array<{
    user: string;
    userDetails: {
      id: string;
      fullName: string;
      username: string;
      country: string;
    };
  }>;
  projectDetails?: {
    id: string;
    name: string;
    summary: string;
    demoLink?: string;
    projectLink?: string;
    isSubmitted: boolean;
  };
}

export interface LocalEventData {
  type: string;
  properties: {
    id: string;
    title: string;
    displayName: string;
    country: string;
    cachedRegistrations: number;
    eventType: string;
    registrationEnabled: boolean;
    isHostEvent: boolean;
    meta: {
      htmlUrl: string;
    };
  };
}

export interface NasaApiResponse {
  teams: {
    totalCount: number;
    edges: Array<{
      cursor: string;
      node: TeamData;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class NasaTeamsService {
  private readonly apiUrl = '/api/nasa/graphql'; // Proxy endpoint
  private readonly fallbackApiUrl = 'https://api.spaceappschallenge.org/graphql';

  // BehaviorSubjects para dados em tempo real
  private teamsSubject = new BehaviorSubject<TeamData[]>([]);
  private localEventsSubject = new BehaviorSubject<LocalEventData[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Observables públicos
  public teams$ = this.teamsSubject.asObservable();
  public localEvents$ = this.localEventsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {
    this.startAutoRefresh();
  }

  private getRequestHeaders() {
    return {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      'Origin': 'https://www.spaceappschallenge.org',
      'Referer': 'https://www.spaceappschallenge.org/2025/local-events/uberlandia/?tab=teams'
    };
  }

  private getTeamsQuery() {
    return [
      {
        operationName: "Page",
        variables: {
          input: "aWQ6MzEzMzI="
        },
        query: `query Page($input: EncodedID!) {
          page(id: $input) {
            __typename
            id
            title
          }
        }`
      },
      {
        operationName: "Teams",
        variables: {
          first: 100,
          after: "",
          q: "",
          filtering: [
            {
              field: "location",
              value: "aWQ6MzA2NjM=", // Uberlândia ID
              compare: "id"
            }
          ]
        },
        query: `query Teams($first: Int!, $after: String, $filtering: [Filter!], $q: String) {
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
                title
                excerpt
                description
                desiredSkills
                languages
                projectSubmitted
                challengeDetails {
                  id
                  title
                  excerpt
                  __typename
                }
                locationDetails {
                  id
                  title
                  displayName
                  country
                  __typename
                }
                memberships {
                  user
                  userDetails {
                    id
                    fullName
                    username
                    country
                    __typename
                  }
                  __typename
                }
                projectDetails {
                  id
                  name
                  summary
                  demoLink
                  projectLink
                  isSubmitted
                  __typename
                }
                __typename
              }
            }
            __typename
          }
        }`
      }
    ];
  }

  private getLocalEventsQuery() {
    return [
      {
        operationName: "OpenLocations",
        variables: {
          first: 500,
          filtering: [
            {
              field: "event",
              value: "2025 NASA Space Apps Challenge",
              compare: "eq"
            }
          ]
        },
        query: `query OpenLocations($first: Int!, $after: String, $filtering: [Filter!], $q: String) {
          openLocations(first: $first, after: $after, filtering: $filtering, q: $q) {
            totalCount
            edges {
              cursor
              node {
                type
                properties {
                  id
                  title
                  displayName
                  country
                  cachedRegistrations
                  eventType
                  registrationEnabled
                  isHostEvent
                  meta {
                    htmlUrl
                    __typename
                  }
                  __typename
                }
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
        }`
      }
    ];
  }

  fetchTeams(useProxy: boolean = true): Observable<TeamData[]> {
    const url = useProxy ? this.apiUrl : this.fallbackApiUrl;
    const payload = this.getTeamsQuery();

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post<any[]>(url, payload, {
      headers: this.getRequestHeaders()
    }).pipe(
      map(response => {
        if (!response || response.length < 2) {
          throw new Error('Resposta da API inválida');
        }

        const teamsResponse = response[1];
        if (!teamsResponse?.data?.teams?.edges) {
          throw new Error('Dados dos times não encontrados');
        }

        return teamsResponse.data.teams.edges.map((edge: any) => edge.node);
      }),
      tap(teams => {
        this.teamsSubject.next(teams);
        this.loadingSubject.next(false);
        console.log(`✅ Times atualizados: ${teams.length} teams carregados`);
      }),
      catchError(error => {
        console.error('❌ Erro ao buscar times:', error);
        this.errorSubject.next(`Erro ao buscar times: ${error.message}`);
        this.loadingSubject.next(false);

        // Se falhar com proxy, tenta sem proxy
        if (useProxy && error.status === 0) {
          console.log('🔄 Tentando sem proxy...');
          return this.fetchTeams(false);
        }

        // Retorna dados fallback dos arquivos locais
        return this.loadFallbackData();
      })
    );
  }

  fetchLocalEvents(useProxy: boolean = true): Observable<LocalEventData[]> {
    const url = useProxy ? this.apiUrl : this.fallbackApiUrl;
    const payload = this.getLocalEventsQuery();

    return this.http.post<any[]>(url, payload, {
      headers: this.getRequestHeaders()
    }).pipe(
      map(response => {
        if (!response || response.length < 1) {
          throw new Error('Resposta da API inválida');
        }

        const eventsResponse = response[0];
        if (!eventsResponse?.data?.openLocations?.edges) {
          throw new Error('Dados dos eventos não encontrados');
        }

        return eventsResponse.data.openLocations.edges.map((edge: any) => edge.node);
      }),
      tap(events => {
        this.localEventsSubject.next(events);
        console.log(`✅ Eventos locais atualizados: ${events.length} eventos carregados`);
      }),
      catchError(error => {
        console.error('❌ Erro ao buscar eventos locais:', error);

        // Se falhar com proxy, tenta sem proxy
        if (useProxy && error.status === 0) {
          console.log('🔄 Tentando eventos locais sem proxy...');
          return this.fetchLocalEvents(false);
        }

        // Retorna array vazio em caso de erro
        this.localEventsSubject.next([]);
        return this.localEventsSubject.asObservable();
      })
    );
  }

  private loadFallbackData(): Observable<TeamData[]> {
    console.log('📁 Carregando dados fallback dos arquivos locais...');

    // Tenta carregar dados dos arquivos JSON locais
    return this.http.get<any>('/assets/data/teams.json').pipe(
      map(data => {
        if (data?.data?.[0]?.teams?.edges) {
          return data.data[0].teams.edges.map((edge: any) => edge.node);
        }
        return [];
      }),
      tap(teams => {
        this.teamsSubject.next(teams);
        this.loadingSubject.next(false);
        console.log(`📁 Dados fallback carregados: ${teams.length} teams`);
      }),
      catchError(() => {
        // Se não conseguir carregar nem os dados locais
        this.teamsSubject.next([]);
        this.loadingSubject.next(false);
        return this.teamsSubject.asObservable();
      })
    );
  }

  // Atualização automática a cada 5 minutos
  private startAutoRefresh(): void {
    // Carrega dados inicialmente
    this.fetchTeams().subscribe();
    this.fetchLocalEvents().subscribe();

    // Configura refresh automático
    interval(5 * 60 * 1000) // 5 minutos
      .pipe(
        startWith(0),
        switchMap(() => this.fetchTeams())
      )
      .subscribe();

    // Refresh dos eventos locais a cada 10 minutos
    interval(5 * 60 * 1000) // 10 minutos
      .pipe(
        startWith(0),
        switchMap(() => this.fetchLocalEvents())
      )
      .subscribe();
  }

  // Métodos públicos para refresh manual
  refreshTeams(): void {
    this.fetchTeams().subscribe();
  }

  refreshLocalEvents(): void {
    this.fetchLocalEvents().subscribe();
  }

  refreshAll(): void {
    this.refreshTeams();
    this.refreshLocalEvents();
  }

  // Getter para estatísticas
  getTeamsStats(): Observable<{total: number, withProjects: number, uberlandia: number}> {
    return this.teams$.pipe(
      map(teams => ({
        total: teams.length,
        withProjects: teams.filter(team => team.projectSubmitted).length,
        uberlandia: teams.filter(team =>
          team.locationDetails?.displayName?.toLowerCase().includes('uberlândia') ||
          team.locationDetails?.displayName?.toLowerCase().includes('uberlandia')
        ).length
      }))
    );
  }
}
