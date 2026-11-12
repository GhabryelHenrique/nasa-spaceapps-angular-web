import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartConfiguration } from 'chart.js';
import {
  EditionSnapshot,
  EditionTrend,
  EditionsComparisonService,
  prettifyCityName,
} from '../../services/editions-comparison.service';
import { InsightChartComponent, CHART_SERIES } from '../insight-chart/insight-chart.component';
import { StatTileComponent } from '../stat-tile/stat-tile.component';

/** Cor de cada edição — fixa em todos os gráficos da seção. */
const YEAR_COLOR: Record<number, string> = {
  2026: CHART_SERIES[0],
  2025: CHART_SERIES[2],
};

/** Quantas semanas antes do hackathon o gráfico semanal mostra. */
const WEEKS_SHOWN = 12;

type Direction = 'up' | 'down' | 'flat' | 'none';

export interface ComparisonRow {
  label: string;
  hint?: string;
  previous: string;
  current: string;
  delta: string;
  direction: Direction;
  /** A variação é boa para a sede? Define a cor; a seta sempre segue o número. */
  good: boolean | null;
}

@Component({
  selector: 'app-editions-comparison',
  standalone: true,
  imports: [InsightChartComponent, StatTileComponent],
  templateUrl: './editions-comparison.component.html',
  styleUrl: './editions-comparison.component.scss',
})
export class EditionsComparisonComponent {
  private readonly service = inject(EditionsComparisonService);

  readonly loading = signal(true);
  readonly error = signal(false);
  private readonly trends = signal<EditionTrend[]>([]);
  private readonly snapshots = signal<EditionSnapshot[]>([]);

  constructor() {
    this.service
      .load()
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe({
        next: data => {
          this.trends.set(data.trends);
          this.snapshots.set(data.snapshots);
          this.error.set(!data.trends.length && !data.snapshots.length);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }

  readonly current = computed(() => this.trends().find(t => t.year === 2026 && t.points.length) ?? null);
  readonly previous = computed(() => this.trends().find(t => t.year === 2025 && t.points.length) ?? null);
  readonly snapCurrent = computed(() => this.snapshots().find(s => s.year === 2026) ?? null);
  readonly snapPrevious = computed(() => this.snapshots().find(s => s.year === 2025) ?? null);

  /** Último dia com dado em 2026, em dias até o hackathon — o "agora" da comparação. */
  readonly refDay = computed(() => {
    const points = this.current()?.points;
    return points?.length ? points[points.length - 1].daysBefore : null;
  });

  // ── Indicadores de tendência ─────────────────────────────

  /** Acumulado de 2025 no mesmo número de dias antes do evento. */
  readonly previousAtSamePoint = computed(() => {
    const ref = this.refDay();
    const prev = this.previous();
    if (ref === null || !prev) return null;
    return this.cumulativeAt(prev, ref);
  });

  readonly samePointDelta = computed(() => {
    const now = this.current()?.total;
    const before = this.previousAtSamePoint();
    if (now === undefined || before === null || before === 0) return null;
    return ((now - before) / before) * 100;
  });

  /** Média diária dos últimos 7 dias e variação contra os 7 anteriores. */
  readonly pace = computed(() => {
    const cur = this.current();
    const ref = this.refDay();
    if (!cur || ref === null) return null;

    const last7 = this.sumWindow(cur, ref, ref + 6);
    const prev7 = this.sumWindow(cur, ref + 7, ref + 13);
    return {
      perDay: last7 / 7,
      last7,
      prev7,
      change: prev7 > 0 ? ((last7 - prev7) / prev7) * 100 : null,
    };
  });

  /** Projeção linear para o D-0 no ritmo dos últimos 7 dias. */
  readonly projection = computed(() => {
    const cur = this.current();
    const ref = this.refDay();
    const pace = this.pace();
    if (!cur || ref === null || !pace || ref === 0) return null;
    return Math.round(cur.total + pace.perDay * ref);
  });

  /** Quanto 2025 ainda cresceu do mesmo ponto até o D-0 — referência para a reta final. */
  readonly previousFinalStretch = computed(() => {
    const prev = this.previous();
    const at = this.previousAtSamePoint();
    if (!prev || at === null) return null;
    return prev.total - at;
  });

  // ── Gráficos ─────────────────────────────────────────────

  readonly cumulativeConfig = computed<ChartConfiguration | null>(() => {
    const cur = this.current();
    const prev = this.previous();
    if (!cur && !prev) return null;

    const firstDay = Math.max(cur?.points[0]?.daysBefore ?? 0, prev?.points[0]?.daysBefore ?? 0);
    const days = Array.from({ length: firstDay + 1 }, (_, i) => firstDay - i);
    const labels = days.map(d => (d === 0 ? 'D-0' : `D-${d}`));

    const datasets: any[] = [];

    if (cur) {
      const ref = this.refDay()!;
      datasets.push({
        label: `${cur.year} (${cur.source})`,
        data: days.map(d => (d < ref || d > cur.points[0].daysBefore ? null : this.cumulativeAt(cur, d))),
        borderColor: YEAR_COLOR[cur.year],
        backgroundColor: 'rgba(46, 150, 245, 0.12)',
        fill: true,
        tension: 0.25,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2.5,
      });

      const projection = this.projection();
      if (projection !== null) {
        datasets.push({
          label: `${cur.year} — projeção no ritmo atual`,
          data: days.map(d => (d > ref ? null : cur.total + (this.pace()!.perDay * (ref - d)))),
          borderColor: YEAR_COLOR[cur.year],
          borderDash: [6, 5],
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          fill: false,
        });
      }
    }

    if (prev) {
      datasets.push({
        label: `${prev.year} (${prev.source})`,
        data: days.map(d => (d > prev.points[0].daysBefore ? null : this.cumulativeAt(prev, d))),
        borderColor: YEAR_COLOR[prev.year],
        backgroundColor: 'transparent',
        tension: 0.25,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
      });
    }

    return {
      type: 'line',
      data: { labels, datasets },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (ctx: any) =>
                ctx.parsed.y === null ? '' : `${ctx.dataset.label}: ${this.fmt(Math.round(ctx.parsed.y))}`,
            },
          },
        },
        scales: {
          x: { ticks: { maxTicksLimit: 12, autoSkip: true, maxRotation: 0 } },
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    } as ChartConfiguration;
  });

  readonly weeklyConfig = computed<ChartConfiguration | null>(() => {
    const series = [this.current(), this.previous()].filter((t): t is EditionTrend => !!t);
    if (!series.length) return null;

    // Semana 1 = os 7 dias que terminam no D-0; a mais antiga fica à esquerda.
    const weeks = Array.from({ length: WEEKS_SHOWN }, (_, i) => WEEKS_SHOWN - i);

    return {
      type: 'bar',
      data: {
        labels: weeks.map(w => (w === 1 ? 'Última' : `${w} sem.`)),
        datasets: series.map(trend => ({
          label: String(trend.year),
          data: weeks.map(w => this.sumWindow(trend, (w - 1) * 7, w * 7 - 1)),
          backgroundColor: YEAR_COLOR[trend.year],
          borderRadius: 3,
          maxBarThickness: 22,
        })),
      },
      options: {
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              title: (items: any[]) => {
                const w = weeks[items[0].dataIndex];
                return w === 1 ? 'Semana do hackathon (D-6 a D-0)' : `${w}ª semana antes (D-${w * 7 - 1} a D-${(w - 1) * 7})`;
              },
            },
          },
        },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    } as ChartConfiguration;
  });

  /** Sedes brasileiras: top 10 de 2026 (mais Uberlândia, se ficar de fora) contra 2025. */
  readonly brazilCitiesConfig = computed<ChartConfiguration | null>(() => {
    const cur = this.snapCurrent();
    const prev = this.snapPrevious();
    if (!cur?.brazilCities.length) return null;

    const prevByKey = new Map(prev?.brazilCities.map(c => [c.key, c.registrations]) ?? []);
    const top = cur.brazilCities.slice(0, 10);
    const ube = cur.brazilCities.find(c => c.key.includes('uberlandia'));
    if (ube && !top.includes(ube)) top.push(ube);

    const label = (c: { key: string; name: string }) =>
      c.key.includes('uberlandia') ? `★ ${prettifyCityName(c.name)}` : prettifyCityName(c.name);

    const datasets: any[] = [{
      label: String(cur.year),
      data: top.map(c => c.registrations),
      backgroundColor: YEAR_COLOR[cur.year],
      borderRadius: 3,
      maxBarThickness: 14,
    }];
    if (prev) {
      datasets.push({
        label: String(prev.year),
        data: top.map(c => prevByKey.get(c.key) ?? null),
        backgroundColor: YEAR_COLOR[prev.year],
        borderRadius: 3,
        maxBarThickness: 14,
      });
    }

    return {
      type: 'bar',
      data: { labels: top.map(label), datasets },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (ctx: any) =>
                ctx.raw === null
                  ? `${ctx.dataset.label}: sede não existia`
                  : `${ctx.dataset.label}: ${this.fmt(ctx.raw)} inscritos`,
            },
          },
        },
        scales: {
          x: { beginAtZero: true, ticks: { precision: 0 } },
          y: { grid: { display: false } },
        },
      },
    } as ChartConfiguration;
  });

  readonly brazilCitiesHeight = computed(() => {
    const count = this.brazilCitiesConfig()?.data.labels?.length ?? 10;
    return Math.max(260, count * 34 + 60);
  });

  // ── Tabela ano a ano ─────────────────────────────────────

  readonly rows = computed<ComparisonRow[]>(() => {
    const cur = this.snapCurrent();
    const prev = this.snapPrevious();
    if (!cur || !prev) return [];

    const share = (s: EditionSnapshot) =>
      s.uberlandiaRegistrations !== null && s.brazilParticipants > 0
        ? (s.uberlandiaRegistrations / s.brazilParticipants) * 100
        : null;
    const perTeam = (s: EditionSnapshot) =>
      s.uberlandiaRegistrations !== null && s.uberlandiaTeams
        ? s.uberlandiaRegistrations / s.uberlandiaTeams
        : null;

    const rows: ComparisonRow[] = [
      this.countRow('Inscritos em Uberlândia', prev.uberlandiaRegistrations, cur.uberlandiaRegistrations, 'contador da plataforma'),
      this.rankRow('Ranking mundial da sede', prev.worldRank, cur.worldRank),
      this.rankRow('Ranking entre sedes do Brasil', prev.brazilRank, cur.brazilRank),
      this.pointsRow('Fatia de Uberlândia no Brasil', share(prev), share(cur)),
      this.countRow('Times em Uberlândia', prev.uberlandiaTeams, cur.uberlandiaTeams),
      this.ratioRow('Inscritos por time', perTeam(prev), perTeam(cur)),
      this.countRow('Desafios diferentes escolhidos', prev.distinctChallenges, cur.distinctChallenges),
    ];

    if ((cur.submittedProjects ?? 0) > 0) {
      rows.push(this.countRow('Projetos enviados', prev.submittedProjects, cur.submittedProjects));
    } else {
      rows.push({
        label: 'Projetos enviados',
        previous: this.fmtOpt(prev.submittedProjects),
        current: 'após o evento',
        delta: '—',
        direction: 'none',
        good: null,
      });
    }

    rows.push(
      this.countRow('Sedes no Brasil', prev.brazilEvents, cur.brazilEvents),
      this.countRow('Inscritos no Brasil', prev.brazilParticipants, cur.brazilParticipants),
      this.countRow('Sedes no mundo', prev.worldEvents, cur.worldEvents),
      this.countRow('Participantes no mundo', prev.worldParticipants, cur.worldParticipants),
    );

    return rows;
  });

  // ── Helpers ──────────────────────────────────────────────

  fmt(n: number, digits = 0): string {
    return n.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  }

  /** Percentual sem sinal — para quando a seta (▲/▼) já indica a direção. */
  fmtAbsPct(n: number): string {
    const abs = Math.abs(n);
    return `${this.fmt(abs, abs < 10 ? 1 : 0)}%`;
  }

  private fmtOpt(n: number | null, digits = 0): string {
    return n === null ? '—' : this.fmt(n, digits);
  }

  /** Acumulado da edição no fim do dia D-`daysBefore` (carrega o último valor nos dias sem inscrição). */
  private cumulativeAt(trend: EditionTrend, daysBefore: number): number {
    let value = 0;
    for (const p of trend.points) {
      if (p.daysBefore < daysBefore) break;
      value = p.cumulative;
    }
    return value;
  }

  /** Soma das inscrições entre D-`to` e D-`from` (inclusive). */
  private sumWindow(trend: EditionTrend, from: number, to: number): number {
    return trend.points
      .filter(p => p.daysBefore >= from && p.daysBefore <= to)
      .reduce((sum, p) => sum + p.count, 0);
  }

  private direction(diff: number): Direction {
    return diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat';
  }

  private countRow(label: string, prev: number | null, cur: number | null, hint?: string): ComparisonRow {
    if (prev === null || cur === null) {
      return { label, hint, previous: this.fmtOpt(prev), current: this.fmtOpt(cur), delta: '—', direction: 'none', good: null };
    }
    const diff = cur - prev;
    return {
      label,
      hint,
      previous: this.fmt(prev),
      current: this.fmt(cur),
      delta: prev > 0 ? this.fmtAbsPct((diff / prev) * 100) : this.fmt(Math.abs(diff)),
      direction: this.direction(diff),
      good: diff === 0 ? null : diff > 0,
    };
  }

  private ratioRow(label: string, prev: number | null, cur: number | null): ComparisonRow {
    if (prev === null || cur === null) {
      return { label, previous: this.fmtOpt(prev, 1), current: this.fmtOpt(cur, 1), delta: '—', direction: 'none', good: null };
    }
    const diff = cur - prev;
    return {
      label,
      previous: this.fmt(prev, 1),
      current: this.fmt(cur, 1),
      delta: this.fmt(Math.abs(diff), 1),
      direction: this.direction(diff),
      good: null,
    };
  }

  /** Ranking: número menor é melhor, então "subir" significa o número cair. */
  private rankRow(label: string, prev: number | null, cur: number | null): ComparisonRow {
    if (prev === null || cur === null) {
      return {
        label,
        previous: prev === null ? '—' : `#${prev}`,
        current: cur === null ? '—' : `#${cur}`,
        delta: '—',
        direction: 'none',
        good: null,
      };
    }
    const gained = prev - cur;
    return {
      label,
      previous: `#${prev}`,
      current: `#${cur}`,
      delta: gained === 0 ? 'igual' : `${Math.abs(gained)} ${Math.abs(gained) === 1 ? 'posição' : 'posições'}`,
      direction: this.direction(gained),
      good: gained === 0 ? null : gained > 0,
    };
  }

  private pointsRow(label: string, prev: number | null, cur: number | null): ComparisonRow {
    if (prev === null || cur === null) {
      return { label, previous: '—', current: '—', delta: '—', direction: 'none', good: null };
    }
    const diff = cur - prev;
    return {
      label,
      previous: `${this.fmt(prev, 1)}%`,
      current: `${this.fmt(cur, 1)}%`,
      delta: `${this.fmt(Math.abs(diff), 1)} p.p.`,
      direction: this.direction(diff),
      good: diff === 0 ? null : diff > 0,
    };
  }
}
