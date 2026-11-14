import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

/** Resumo de times de uma sede latino-americana (uma linha de `latamTeams.json`). */
export interface LatamTeamSummary {
  locationId: string;
  locationName: string;
  country: string;
  totalTeams: number;
  submittedProjects: number;
}

interface LatamTeamsFile {
  generatedAt?: string;
  data?: LatamTeamSummary[];
}

@Injectable({ providedIn: 'root' })
export class LatamTeamsService {
  private readonly http = inject(HttpClient);

  /** Cache por edição, como os demais JSONs versionados da Sala de Guerra. */
  private readonly byYear = new Map<number, Observable<LatamTeamSummary[]>>();

  /**
   * Times por sede de toda a América Latina, gerados por
   * `python update_teams.py --only latam`. Traz só contagens — os times em si
   * de Uberlândia continuam em `teams.json`.
   */
  getSummary(year: number): Observable<LatamTeamSummary[]> {
    let cached = this.byYear.get(year);

    if (!cached) {
      cached = this.http.get<LatamTeamsFile>(`/assets/data/${year}/latamTeams.json`).pipe(
        map(file => file?.data ?? []),
        // Erro preso no shareReplay tornaria a falha permanente.
        tap({ error: () => this.byYear.delete(year) }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
      this.byYear.set(year, cached);
    }

    return cached;
  }
}
