import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { CityParticipation } from '../../../shared/interfaces/local-event.interface';
import { LATAM_COUNTRIES } from '../../../shared/data/latam-countries.data';
import { LatamTeamSummary, LatamTeamsService } from '../../../services/latam-teams.service';
import { normalizeName, prettifyCityName } from '../../services/editions-comparison.service';

/** Uma sede latino-americana, com inscritos (localEvents) e times (latamTeams) cruzados. */
export interface LatamCityRow {
  key: string;
  cityName: string;
  country: string;
  countryName: string;
  flag: string;
  registrations: number;
  totalTeams: number;
  submittedProjects: number;
  isUberlandia: boolean;
}

/** Um país, agregando todas as suas sedes. */
export interface LatamCountryRow {
  country: string;
  countryName: string;
  flag: string;
  sedes: number;
  registrations: number;
  totalTeams: number;
  submittedProjects: number;
  avgPerSede: number;
  topCity: { name: string; registrations: number };
  isBrazil: boolean;
}

export interface Ranked<T> {
  item: T;
  rank: number;
}

export type LatamSortKey = 'registrations' | 'teams' | 'submitted';

/** Fração mínima de times com projeto enviado para exibir as métricas de envio. */
const SUBMISSIONS_MIN_SHARE = 0.05;

/** Quantas sedes a tabela mostra antes do "ver todas". */
const TOP_N = 15;

const METRICS: Record<LatamSortKey, (row: LatamCityRow) => number> = {
  registrations: row => row.registrations,
  teams: row => row.totalTeams,
  submitted: row => row.submittedProjects,
};

/**
 * Ranking "de competição" (1, 2, 2, 4): empate divide a posição. Com contagens
 * pequenas (times, projetos) empates são comuns e o índice puro inventaria uma
 * ordem que não existe. Inscritos desempatam; depois, nome.
 */
export function competitionRank<T extends { registrations: number }>(
  items: T[],
  metric: (item: T) => number,
  label: (item: T) => string
): Ranked<T>[] {
  const sorted = [...items].sort((a, b) =>
    metric(b) - metric(a) ||
    b.registrations - a.registrations ||
    label(a).localeCompare(label(b), 'pt-BR')
  );

  let rank = 0;
  let previous: number | undefined;
  return sorted.map((item, index) => {
    const value = metric(item);
    if (value !== previous) {
      rank = index + 1;
      previous = value;
    }
    return { item, rank };
  });
}

@Component({
  selector: 'app-latam-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './latam-comparison.component.html',
  styleUrl: './latam-comparison.component.scss'
})
export class LatamComparisonComponent {
  /** Sedes do mundo inteiro (localEvents); o recorte latino-americano acontece aqui. */
  readonly cities = input.required<CityParticipation[]>();
  readonly year = input.required<number>();

  private readonly latamTeams = inject(LatamTeamsService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly teamSummary = signal<LatamTeamSummary[]>([]);
  readonly loadingTeams = signal(true);
  /** Sem `latamTeams.json` a seção continua de pé só com inscritos. */
  readonly teamsUnavailable = signal(false);

  protected readonly Math = Math;

  readonly sortKey = signal<LatamSortKey>('registrations');
  readonly countryFilter = signal('');
  readonly showAll = signal(false);

  constructor() {
    toObservable(this.year)
      .pipe(
        tap(() => {
          this.loadingTeams.set(true);
          this.teamsUnavailable.set(false);
        }),
        switchMap(year =>
          this.latamTeams.getSummary(year).pipe(
            catchError(error => {
              console.error('[LatamComparison] latamTeams.json — ERRO:', error);
              this.teamsUnavailable.set(true);
              return of([] as LatamTeamSummary[]);
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(summary => {
        this.teamSummary.set(summary);
        this.loadingTeams.set(false);
      });
  }

  // ─── Sedes ──────────────────────────────────────────────────

  readonly rows = computed<LatamCityRow[]>(() => {
    const byId = new Map(this.teamSummary().map(s => [s.locationId, s]));
    // Plano B para sedes sem ID (não deveria acontecer com localEvents atual).
    const byName = new Map(
      this.teamSummary().map(s => [`${s.country}|${normalizeName(s.locationName)}`, s])
    );

    return this.cities()
      .filter(city => city.country in LATAM_COUNTRIES)
      .map(city => {
        const country = LATAM_COUNTRIES[city.country];
        const teams = (city.locationId && byId.get(city.locationId))
          || byName.get(`${city.country}|${normalizeName(city.city)}`);
        return {
          key: city.locationId || `${city.country}|${city.city}`,
          cityName: prettifyCityName(city.city),
          country: city.country,
          countryName: country.name,
          flag: country.flag,
          registrations: city.registrations,
          totalTeams: teams?.totalTeams ?? 0,
          submittedProjects: teams?.submittedProjects ?? 0,
          isUberlandia: normalizeName(city.city).includes('uberlandia'),
        };
      });
  });

  readonly uberlandia = computed(() => this.rows().find(row => row.isUberlandia) ?? null);
  readonly totalCities = computed(() => this.rows().length);

  readonly totalRegistrations = computed(() => this.sum(row => row.registrations));
  readonly totalTeams = computed(() => this.sum(row => row.totalTeams));
  readonly totalSubmitted = computed(() => this.sum(row => row.submittedProjects));

  readonly hasTeams = computed(() => this.totalTeams() > 0);
  /**
   * Submissões só entram quando a rodada de envio de fato começou: um projeto
   * de teste enviado antes do hackathon ligaria colunas inteiras de "0,0%".
   */
  readonly hasSubmissions = computed(() =>
    this.totalSubmitted() > 0 && this.totalSubmitted() >= this.totalTeams() * SUBMISSIONS_MIN_SHARE
  );

  private readonly rankings = computed(() => {
    const label = (row: LatamCityRow) => row.cityName;
    return {
      registrations: competitionRank(this.rows(), METRICS.registrations, label),
      teams: competitionRank(this.rows(), METRICS.teams, label),
      submitted: competitionRank(this.rows(), METRICS.submitted, label),
    };
  });

  readonly registrationsRank = computed(() => this.uberlandiaRank('registrations'));
  readonly teamsRank = computed(() => this.uberlandiaRank('teams'));
  readonly submittedRank = computed(() => this.uberlandiaRank('submitted'));

  /** "Top X%" — arredondado para cima, para nunca vender melhor do que é. */
  readonly topPercent = computed(() => {
    const total = this.totalCities();
    return total ? Math.max(1, Math.ceil((this.registrationsRank() / total) * 100)) : 0;
  });

  readonly registrationsShare = computed(() =>
    this.share(this.uberlandia()?.registrations, this.totalRegistrations())
  );
  readonly teamsShare = computed(() =>
    this.share(this.uberlandia()?.totalTeams, this.totalTeams())
  );

  /** Taxa agregada (total enviado / total de times): sedes de 1 time não distorcem. */
  readonly latamSubmissionRate = computed(() => this.share(this.totalSubmitted(), this.totalTeams()));
  readonly ubeSubmissionRate = computed(() => {
    const ube = this.uberlandia();
    return ube ? this.share(ube.submittedProjects, ube.totalTeams) : 0;
  });

  /**
   * Times formados a cada 100 inscritos: o quanto a inscrição virou equipe.
   * (A API pública não expõe membros, então não dá para medir por pessoa.)
   */
  readonly latamTeamsPer100 = computed(() => this.share(this.totalTeams(), this.totalRegistrations()));
  readonly ubeTeamsPer100 = computed(() => {
    const ube = this.uberlandia();
    return ube ? this.share(ube.totalTeams, ube.registrations) : 0;
  });

  readonly averageRegistrations = computed(() =>
    this.totalCities() ? this.totalRegistrations() / this.totalCities() : 0
  );

  /** Primeira sede do ranking quando não é Uberlândia, com a distância até ela. */
  readonly leader = computed(() => {
    const first = this.rankings().registrations[0]?.item;
    const ube = this.uberlandia();
    if (!first || !ube || first.isUberlandia) return null;
    return { row: first, gap: first.registrations - ube.registrations };
  });

  /** A sede logo acima de Uberlândia em inscritos — ou a logo abaixo, quando ela lidera. */
  readonly registrationsNeighbor = computed(() => {
    const ranked = this.rankings().registrations;
    const index = ranked.findIndex(entry => entry.item.isUberlandia);
    if (index === -1 || ranked.length < 2) return null;

    const ube = ranked[index].item;
    const isLeading = index === 0;
    const neighbor = ranked[isLeading ? 1 : index - 1].item;
    return {
      row: neighbor,
      gap: Math.abs(ube.registrations - neighbor.registrations),
      isLeading,
    };
  });

  // ─── Países ─────────────────────────────────────────────────

  readonly countryRows = computed<Ranked<LatamCountryRow>[]>(() => {
    const groups = new Map<string, LatamCityRow[]>();
    for (const row of this.rows()) {
      groups.set(row.country, [...(groups.get(row.country) ?? []), row]);
    }

    const countries = [...groups.entries()].map(([country, cityRows]) => {
      const registrations = cityRows.reduce((sum, row) => sum + row.registrations, 0);
      const top = cityRows.reduce((best, row) => row.registrations > best.registrations ? row : best);
      return {
        country,
        countryName: cityRows[0].countryName,
        flag: cityRows[0].flag,
        sedes: cityRows.length,
        registrations,
        totalTeams: cityRows.reduce((sum, row) => sum + row.totalTeams, 0),
        submittedProjects: cityRows.reduce((sum, row) => sum + row.submittedProjects, 0),
        avgPerSede: registrations / cityRows.length,
        topCity: { name: top.cityName, registrations: top.registrations },
        isBrazil: country === 'Brazil',
      };
    });

    return competitionRank(countries, country => country.registrations, country => country.countryName);
  });

  readonly brazil = computed(() => this.countryRows().find(entry => entry.item.isBrazil) ?? null);
  readonly totalCountries = computed(() => this.countryRows().length);

  private readonly otherCountries = computed(() =>
    this.countryRows().map(entry => entry.item).filter(country => !country.isBrazil)
  );

  /** Países (fora o Brasil) que, somando todas as sedes, têm menos inscritos que Uberlândia. */
  readonly countriesOutnumbered = computed(() => {
    const ube = this.uberlandia();
    if (!ube) return [];
    return this.otherCountries().filter(country => country.registrations < ube.registrations);
  });

  /** "Paraguai, Honduras e Panamá" — o emoji de bandeira não renderiza no Windows. */
  readonly outnumberedNames = computed(() => {
    const names = this.countriesOutnumbered().map(country => country.countryName);
    return names.length > 1 ? `${names.slice(0, -1).join(', ')} e ${names.at(-1)}` : names.join('');
  });

  /** Países (fora o Brasil) cuja maior sede tem menos inscritos que Uberlândia. */
  readonly leadersOutnumbered = computed(() => {
    const ube = this.uberlandia();
    if (!ube) return [];
    return this.otherCountries().filter(country => country.topCity.registrations < ube.registrations);
  });
  readonly otherCountriesCount = computed(() => this.otherCountries().length);

  /** Posição de Uberlândia dentro do Brasil, pelo mesmo critério. */
  readonly brazilRank = computed(() => {
    const brazilRows = this.rows().filter(row => row.country === 'Brazil');
    const ranked = competitionRank(brazilRows, METRICS.registrations, row => row.cityName);
    return ranked.find(entry => entry.item.isUberlandia)?.rank ?? 0;
  });

  readonly maxCountryRegistrations = computed(() =>
    Math.max(...this.countryRows().map(entry => entry.item.registrations), 1)
  );

  // ─── Tabela de sedes ────────────────────────────────────────

  readonly countryOptions = computed(() =>
    [...this.countryRows()]
      .map(entry => entry.item)
      .sort((a, b) => a.countryName.localeCompare(b.countryName, 'pt-BR'))
  );

  private readonly sortedRows = computed(() => this.rankings()[this.sortKey()]);

  readonly visibleRows = computed<Ranked<LatamCityRow>[]>(() => {
    const filter = this.countryFilter();
    const rows = this.sortedRows();
    if (filter) return rows.filter(entry => entry.item.country === filter);
    return this.showAll() ? rows : rows.slice(0, TOP_N);
  });

  /** Uberlândia fixada no fim da tabela quando o corte do top a deixa de fora. */
  readonly pinnedUberlandia = computed<Ranked<LatamCityRow> | null>(() => {
    if (this.countryFilter() || this.showAll()) return null;
    const visible = this.visibleRows();
    if (visible.some(entry => entry.item.isUberlandia)) return null;
    return this.sortedRows().find(entry => entry.item.isUberlandia) ?? null;
  });

  readonly hiddenCount = computed(() =>
    this.countryFilter() || this.showAll() ? 0 : Math.max(0, this.sortedRows().length - TOP_N)
  );

  /** Colunas numéricas além de Pos/Sede/métrica — variam com a ordenação e a fase da edição. */
  readonly extraColumns = computed(() => {
    const sort = this.sortKey();
    let extra = 0;
    if (sort !== 'registrations') extra++;
    if (this.hasTeams() && sort !== 'teams') extra++;
    if (this.hasSubmissions()) extra++;
    return extra;
  });

  private readonly maxMetric = computed(() => {
    const metric = METRICS[this.sortKey()];
    return Math.max(...this.rows().map(metric), 1);
  });

  setSort(key: LatamSortKey): void {
    this.sortKey.set(key);
  }

  setCountryFilter(value: string): void {
    this.countryFilter.set(value);
  }

  toggleShowAll(): void {
    this.showAll.update(value => !value);
  }

  metricValue(row: LatamCityRow): number {
    return METRICS[this.sortKey()](row);
  }

  barWidth(row: LatamCityRow): number {
    return (this.metricValue(row) / this.maxMetric()) * 100;
  }

  countryBarWidth(country: LatamCountryRow): number {
    return (country.registrations / this.maxCountryRegistrations()) * 100;
  }

  rate(row: LatamCityRow): number {
    return this.share(row.submittedProjects, row.totalTeams);
  }

  // ─── Formatação ─────────────────────────────────────────────

  fmt(value: number): string {
    return value.toLocaleString('pt-BR');
  }

  pct(value: number): string {
    return value.toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + '%';
  }

  dec(value: number): string {
    return value.toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  }

  getRankEmoji(rank: number): string {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  }

  plural(count: number, singular: string, pluralForm: string): string {
    return count === 1 ? singular : pluralForm;
  }

  /**
   * Posição de Uberlândia na métrica; 0 quando ela ainda não pontuou — empatar
   * em zero com metade da região não é uma colocação de verdade.
   */
  private uberlandiaRank(key: LatamSortKey): number {
    const entry = this.rankings()[key].find(e => e.item.isUberlandia);
    if (!entry || METRICS[key](entry.item) === 0) return 0;
    return entry.rank;
  }

  private sum(metric: (row: LatamCityRow) => number): number {
    return this.rows().reduce((total, row) => total + metric(row), 0);
  }

  private share(value: number | undefined, total: number): number {
    if (value === undefined || total <= 0) return 0;
    return (value / total) * 100;
  }
}
