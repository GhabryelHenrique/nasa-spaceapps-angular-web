import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { TeamsService } from './teams.service';

/** Times de uma sede, já agregados. */
export interface CityTeamStats {
  locationName: string;
  locationId: string;
  totalTeams: number;
  submittedProjects: number;
  submissionRate: number;
}

/** Uma sede dentro de `otherCitiesTeams.json` / `teams.json`. */
interface CityTeamsEntry {
  locationId?: string;
  locationName?: string;
  teams?: {
    totalCount?: number;
    edges?: Array<{ node?: { projectSubmitted?: boolean } }>;
  };
}

interface OtherCitiesFile {
  data?: CityTeamsEntry[];
}

@Injectable({
  providedIn: 'root',
})
export class OtherCitiesTeamsService {
  private readonly http = inject(HttpClient);
  private readonly teams = inject(TeamsService);

  /**
   * Agregado por sede, por edição. Os JSONs são versionados em
   * `/assets/data/<ano>/` (gerados por `update_teams.py`), então o resultado é
   * cacheado: alternar entre 2025 e 2026 na Sala de Guerra não refaz o GET.
   */
  private readonly byYear = new Map<number, Observable<CityTeamStats[]>>();

  /**
   * Times por sede de uma edição, da maior para a menor.
   *
   * `otherCitiesTeams.json` traz as sedes crawleadas *menos* Uberlândia — a sede
   * da casa mora em `teams.json` —, então as duas fontes são unidas aqui. A lista
   * mistura países; filtrar por Brasil é responsabilidade de quem consome.
   */
  getTeamStatsByCity(year: number): Observable<CityTeamStats[]> {
    let cached = this.byYear.get(year);

    if (!cached) {
      cached = forkJoin({
        home: this.teams.getTeams(year),
        others: this.http.get<OtherCitiesFile>(`/assets/data/${year}/otherCitiesTeams.json`),
      }).pipe(
        map(({ home, others }) =>
          [...(home?.data ?? []), ...(others?.data ?? [])]
            .map(entry => this.toStats(entry))
            .filter((stats): stats is CityTeamStats => stats !== null)
            .sort((a, b) => b.totalTeams - a.totalTeams)
        ),
        // Mesmo motivo do TeamsService: erro preso no shareReplay tornaria a
        // falha permanente; descartar deixa o próximo GET limpo.
        tap({ error: () => this.byYear.delete(year) }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
      this.byYear.set(year, cached);
    }

    return cached;
  }

  private toStats(entry: CityTeamsEntry): CityTeamStats | null {
    const edges = entry.teams?.edges;
    if (!entry.locationName || !edges) return null;

    const totalTeams = entry.teams?.totalCount ?? edges.length;
    const submittedProjects = edges.filter(edge => edge.node?.projectSubmitted === true).length;

    return {
      locationName: entry.locationName,
      locationId: entry.locationId ?? '',
      totalTeams,
      submittedProjects,
      submissionRate: totalTeams > 0 ? (submittedProjects / totalTeams) * 100 : 0,
    };
  }
}
