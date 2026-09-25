import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { CityParticipation } from '../../../shared/interfaces/local-event.interface';
import { CityTeamStats, OtherCitiesTeamsService } from '../../../services/other-cities-teams.service';

/** Uma sede brasileira na comparação, com as duas fontes já cruzadas. */
export interface BrazilCityRow {
  cityName: string;
  registrations: number;
  totalTeams: number;
  submittedProjects: number;
  submissionRate: number;
  isUberlandia: boolean;
  rank: number;
}

/** Conectivos que não recebem maiúscula ao recompor um nome em caixa uniforme. */
const MINOR_WORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

@Component({
  selector: 'app-brazilian-cities-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brazilian-cities-comparison.component.html',
  styleUrl: './brazilian-cities-comparison.component.scss'
})
export class BrazilianCitiesComparisonComponent {
  /** Sedes do mundo inteiro (localEvents); o filtro por Brasil acontece aqui. */
  readonly cities = input.required<CityParticipation[]>();
  readonly year = input.required<number>();

  private readonly otherCities = inject(OtherCitiesTeamsService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly teamStats = signal<CityTeamStats[]>([]);
  readonly loadingTeams = signal(true);
  /** Os inscritos continuam de pé mesmo sem os JSONs de times. */
  readonly teamsUnavailable = signal(false);

  constructor() {
    // A Sala de Guerra reusa a instância ao trocar de edição, então o ano é
    // acompanhado continuamente — não basta carregar uma vez no init.
    toObservable(this.year)
      .pipe(
        tap(() => {
          this.loadingTeams.set(true);
          this.teamsUnavailable.set(false);
        }),
        switchMap(year =>
          this.otherCities.getTeamStatsByCity(year).pipe(
            catchError(error => {
              console.error('[BrazilianCitiesComparison] times por sede — ERRO:', error);
              this.teamsUnavailable.set(true);
              return of([] as CityTeamStats[]);
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(stats => {
        this.teamStats.set(stats);
        this.loadingTeams.set(false);
      });
  }

  /**
   * Sedes brasileiras ordenadas por inscritos. Inscritos vêm da plataforma
   * (localEvents) e existem desde o primeiro dia; times vêm do crawler e podem
   * faltar em sedes ainda não mapeadas — daí o `?? 0` em vez de descartar a linha.
   */
  readonly rows = computed<BrazilCityRow[]>(() => {
    const teamsByCity = new Map(
      this.teamStats().map(stats => [normalize(stats.locationName), stats])
    );

    return this.cities()
      .filter(city => ['brazil', 'brasil'].includes(normalize(city.country)))
      .map(city => {
        const stats = teamsByCity.get(normalize(city.city));
        return {
          cityName: this.prettifyCityName(city.city),
          registrations: city.registrations,
          totalTeams: stats?.totalTeams ?? 0,
          submittedProjects: stats?.submittedProjects ?? 0,
          submissionRate: stats?.submissionRate ?? 0,
          isUberlandia: normalize(city.city).includes('uberlandia'),
          rank: 0,
        };
      })
      .sort((a, b) => b.registrations - a.registrations)
      .map((row, index) => ({ ...row, rank: index + 1 }));
  });

  readonly uberlandia = computed(() => this.rows().find(row => row.isUberlandia) ?? null);
  readonly totalCities = computed(() => this.rows().length);

  readonly totalRegistrations = computed(() =>
    this.rows().reduce((sum, row) => sum + row.registrations, 0)
  );
  readonly totalTeams = computed(() =>
    this.rows().reduce((sum, row) => sum + row.totalTeams, 0)
  );
  readonly totalSubmitted = computed(() =>
    this.rows().reduce((sum, row) => sum + row.submittedProjects, 0)
  );

  /** Antes do hackathon ninguém submeteu — as colunas de projeto só fazem sentido depois. */
  readonly hasSubmissions = computed(() => this.totalSubmitted() > 0);
  /** Idem para times, que só existem depois que a formação de equipes abre. */
  readonly hasTeams = computed(() => this.totalTeams() > 0);

  readonly registrationsRank = computed(() => this.uberlandia()?.rank ?? 0);
  readonly teamsRank = computed(() => this.rankBy(row => row.totalTeams));
  readonly submissionRank = computed(() => this.rankBy(row => row.submissionRate));

  /** Escala das barras da coluna de inscritos. */
  readonly maxRegistrations = computed(() =>
    Math.max(...this.rows().map(row => row.registrations), 1)
  );

  readonly averageSubmissionRate = computed(() => {
    const withTeams = this.rows().filter(row => row.totalTeams > 0);
    if (!withTeams.length) return 0;
    return withTeams.reduce((sum, row) => sum + row.submissionRate, 0) / withTeams.length;
  });

  readonly registrationsShare = computed(() =>
    this.share(this.uberlandia()?.registrations, this.totalRegistrations())
  );
  readonly teamsShare = computed(() =>
    this.share(this.uberlandia()?.totalTeams, this.totalTeams())
  );

  /**
   * A sede logo acima de Uberlândia em inscritos — ou a logo abaixo, quando
   * Uberlândia lidera. É o número que a organização usa para saber o fôlego
   * que falta (ou a folga que tem).
   */
  readonly registrationsNeighbor = computed(() => {
    const ube = this.uberlandia();
    const rows = this.rows();
    if (!ube || rows.length < 2) return null;

    const neighbor = ube.rank === 1 ? rows[1] : rows[ube.rank - 2];
    if (!neighbor) return null;

    return {
      city: neighbor.cityName,
      gap: Math.abs(ube.registrations - neighbor.registrations),
      isLeading: ube.rank === 1,
    };
  });

  fmt(value: number): string {
    return value.toLocaleString('pt-BR');
  }

  getRankEmoji(rank: number): string {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  }

  getComparisonClass(value: number, average: number): string {
    if (value > average * 1.2) return 'above-average';
    if (value < average * 0.8) return 'below-average';
    return 'average';
  }

  getSubmissionRateClass(rate: number): string {
    if (rate >= 80) return 'excellent';
    if (rate >= 60) return 'good';
    if (rate >= 40) return 'average';
    return 'needs-improvement';
  }

  /** Largura da barra de inscritos, relativa à maior sede. */
  getRegistrationsWidth(registrations: number): number {
    return (registrations / this.maxRegistrations()) * 100;
  }

  private share(value: number | undefined, total: number): number {
    if (value === undefined || total <= 0) return 0;
    return (value / total) * 100;
  }

  private rankBy(metric: (row: BrazilCityRow) => number): number {
    const ordered = [...this.rows()].sort((a, b) => metric(b) - metric(a));
    const index = ordered.findIndex(row => row.isUberlandia);
    return index === -1 ? 0 : index + 1;
  }

  /**
   * A plataforma aceita o nome da sede como o organizador digitou, então a lista
   * mistura `ARACAJU` e `balneário camboriú`. Só reescreve o que veio em caixa
   * uniforme; nomes já capitalizados ficam como estão.
   */
  private prettifyCityName(name: string): string {
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
}
