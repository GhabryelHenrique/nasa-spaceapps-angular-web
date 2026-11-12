import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { GoogleSheetsService } from '../../services/google-sheets.service';
import { RegistrationExportService } from '../../services/registration-export.service';

/**
 * Comparativo entre edições da Sala de Guerra (2025 × 2026).
 *
 * Cada edição tem fonte própria para a curva de inscrições — 2025 veio do
 * formulário da organização (Google Sheets), 2026 do export da NASA —, mas as
 * duas trazem a data de cada inscrição. Alinhando pelo dia do hackathon (D-0)
 * dá para comparar "onde estávamos a X dias do evento" nas duas edições.
 *
 * Os números de plataforma (sedes, ranking, times) vêm dos JSONs versionados
 * por ano em `/assets/data/<ano>/`, lidos aqui direto — sem passar pelo
 * NasaTeamsService, que só guarda uma edição por vez.
 */

/** Primeiro dia do hackathon em cada edição (D-0 da curva). */
export const HACKATHON_START: Record<number, string> = {
  2025: '2025-10-04',
  2026: '2026-11-14',
};

/** Um ponto da curva de inscrições, já em "dias até o hackathon". */
export interface TrendPoint {
  /** Dias até o D-0 (positivo = antes do evento). */
  daysBefore: number;
  count: number;
  cumulative: number;
}

export interface EditionTrend {
  year: number;
  source: string;
  points: TrendPoint[];
  total: number;
}

/** Fotografia da edição na plataforma da NASA. */
export interface EditionSnapshot {
  year: number;
  uberlandiaRegistrations: number | null;
  worldRank: number | null;
  brazilRank: number | null;
  worldEvents: number;
  worldParticipants: number;
  brazilEvents: number;
  brazilParticipants: number;
  uberlandiaTeams: number | null;
  submittedProjects: number | null;
  distinctChallenges: number | null;
  /** Inscritos por sede brasileira (nome normalizado → inscritos), para o comparativo por cidade. */
  brazilCities: Array<{ key: string; name: string; registrations: number }>;
}

export interface EditionsComparison {
  trends: EditionTrend[];
  snapshots: EditionSnapshot[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function normalizeName(value: string): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/** Conectivos que não recebem maiúscula ao recompor um nome em caixa uniforme. */
const MINOR_WORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);

/**
 * A plataforma aceita o nome da sede como o organizador digitou, então a lista
 * mistura `ARACAJU` e `balneário camboriú`. Só reescreve o que veio em caixa
 * uniforme; nomes já capitalizados ficam como estão.
 */
export function prettifyCityName(name: string): string {
  const trimmed = name.trim();
  const isUniformCase = trimmed === trimmed.toUpperCase() || trimmed === trimmed.toLowerCase();
  if (!isUniformCase) return trimmed;

  return trimmed
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) =>
      index > 0 && MINOR_WORDS.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ');
}

@Injectable({ providedIn: 'root' })
export class EditionsComparisonService {
  private readonly http = inject(HttpClient);
  private readonly sheets = inject(GoogleSheetsService);
  private readonly registrationExport = inject(RegistrationExportService);

  /** Os arquivos não mudam durante a sessão; a troca de edição não precisa rebaixar tudo. */
  private cache$: Observable<EditionsComparison> | null = null;

  load(): Observable<EditionsComparison> {
    if (!this.cache$) {
      this.cache$ = forkJoin({
        trend2025: this.trend2025(),
        trend2026: this.trend2026(),
        snap2025: this.snapshot(2025),
        snap2026: this.snapshot(2026),
      }).pipe(
        map(({ trend2025, trend2026, snap2025, snap2026 }) => ({
          trends: [trend2026, trend2025].filter((t): t is EditionTrend => !!t),
          snapshots: [snap2026, snap2025].filter((s): s is EditionSnapshot => !!s),
        })),
        shareReplay(1)
      );
    }
    return this.cache$;
  }

  // ── Curvas de inscrição ──────────────────────────────────

  private trend2025(): Observable<EditionTrend | null> {
    return this.sheets.getInscritos().pipe(
      map(rows => this.buildTrend(
        2025,
        'formulário da organização',
        rows.map(r => r.timestamp).filter((d): d is Date => !!d)
      )),
      catchError(err => {
        console.error('[EditionsComparison] inscrições 2025 — ERRO:', err);
        return of(null);
      })
    );
  }

  private trend2026(): Observable<EditionTrend | null> {
    return this.registrationExport.getStats(2026).pipe(
      map(stats => {
        // O export já vem agregado por dia; reexpande para reaproveitar o mesmo cálculo.
        const dates: Date[] = [];
        for (const day of stats.daily) {
          const [y, m, d] = day.date.split('-').map(Number);
          for (let i = 0; i < day.count; i++) dates.push(new Date(y, m - 1, d));
        }
        return this.buildTrend(2026, 'export da plataforma da NASA', dates);
      }),
      catchError(err => {
        console.error('[EditionsComparison] inscrições 2026 — ERRO:', err);
        return of(null);
      })
    );
  }

  /**
   * Agrupa as inscrições por "dias até o hackathon". Inscrições depois do D-0
   * (testes, respostas tardias na planilha) ficam de fora — a curva é de preparação.
   */
  private buildTrend(year: number, source: string, dates: Date[]): EditionTrend {
    const start = this.localDate(HACKATHON_START[year]);
    const perDay = new Map<number, number>();

    for (const date of dates) {
      const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const daysBefore = Math.round((start.getTime() - day.getTime()) / DAY_MS);
      if (daysBefore < 0) continue;
      perDay.set(daysBefore, (perDay.get(daysBefore) ?? 0) + 1);
    }

    if (!perDay.size) return { year, source, points: [], total: 0 };

    // Série contínua (inclui os dias sem inscrição) da primeira inscrição até o último dia com dado.
    const first = Math.max(...perDay.keys());
    const last = Math.min(...perDay.keys());
    const points: TrendPoint[] = [];
    let cumulative = 0;
    for (let d = first; d >= last; d--) {
      const count = perDay.get(d) ?? 0;
      cumulative += count;
      points.push({ daysBefore: d, count, cumulative });
    }

    return { year, source, points, total: cumulative };
  }

  // ── Fotografia da plataforma ─────────────────────────────

  private snapshot(year: number): Observable<EditionSnapshot | null> {
    return forkJoin({
      events: this.http.get<any>(`/assets/data/${year}/localEvents.json`),
      teams: this.http.get<any>(`/assets/data/${year}/teams.json`).pipe(catchError(() => of(null))),
    }).pipe(
      map(({ events, teams }) => this.buildSnapshot(year, events, teams)),
      catchError(err => {
        console.error(`[EditionsComparison] sedes ${year} — ERRO:`, err);
        return of(null);
      })
    );
  }

  private buildSnapshot(year: number, eventsJson: any, teamsJson: any): EditionSnapshot {
    const events: Array<{ name: string; country: string; registrations: number }> =
      (eventsJson?.data ?? [])
        .map((edge: any) => edge?.node?.properties)
        .filter(Boolean)
        .map((p: any) => ({
          name: String(p.displayName ?? ''),
          country: String(p.country ?? ''),
          registrations: Number(p.cachedRegistrations) || 0,
        }))
        .sort((a: any, b: any) => b.registrations - a.registrations);

    const isUberlandia = (name: string) => normalizeName(name).includes('uberlandia');
    const brazil = events.filter(e => ['brazil', 'brasil'].includes(normalizeName(e.country)));

    const worldIndex = events.findIndex(e => isUberlandia(e.name));
    const brazilIndex = brazil.findIndex(e => isUberlandia(e.name));

    const edges: any[] = teamsJson?.data?.[0]?.teams?.edges ?? [];
    const hasTeams = !!teamsJson?.data?.[0]?.teams;

    return {
      year,
      uberlandiaRegistrations: worldIndex >= 0 ? events[worldIndex].registrations : null,
      worldRank: worldIndex >= 0 ? worldIndex + 1 : null,
      brazilRank: brazilIndex >= 0 ? brazilIndex + 1 : null,
      worldEvents: events.length,
      worldParticipants: events.reduce((sum, e) => sum + e.registrations, 0),
      brazilEvents: brazil.length,
      brazilParticipants: brazil.reduce((sum, e) => sum + e.registrations, 0),
      uberlandiaTeams: hasTeams ? edges.length : null,
      submittedProjects: hasTeams ? edges.filter(e => e?.node?.projectSubmitted).length : null,
      distinctChallenges: hasTeams
        ? new Set(edges.map(e => e?.node?.challengeDetails?.title).filter(Boolean)).size
        : null,
      brazilCities: brazil.map(e => ({
        key: normalizeName(e.name),
        name: e.name,
        registrations: e.registrations,
      })),
    };
  }

  private localDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
}
