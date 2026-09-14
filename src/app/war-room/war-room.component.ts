import { Component, OnInit, DestroyRef, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';
import { CityParticipation } from '../shared/interfaces/local-event.interface';
import { GoogleSheetsService, InscritoRow } from '../services/google-sheets.service';
import { RegistrationDataService, RegistrationStats } from '../services/registration-data.service';
import { RegistrationExportService, RegistrationExportStats } from '../services/registration-export.service';
import {
  WarRoomInsightsService,
  InscritosExtras,
  MentoresInsights,
  FeedbackInsights,
  TeamsInsights,
} from './services/war-room-insights.service';
import { NasaTeamsService } from '../services/nasa-teams.service';
import { WinnerTeamsService } from '../services/winner-teams.service';
import { WinnerTeam } from '../shared/data/winner-teams.data';
import { CURRENT_CHALLENGE_YEAR } from '../shared/data/challenges.data';
import { InscritosSectionComponent } from './components/inscritos-section/inscritos-section.component';
import { RegistrationsExportSectionComponent } from './components/registrations-export-section/registrations-export-section.component';
import { MentoresSectionComponent } from './components/mentores-section/mentores-section.component';
import { FeedbackSectionComponent } from './components/feedback-section/feedback-section.component';
import { TeamsSectionComponent } from './components/teams-section/teams-section.component';
import { StatTileComponent } from './components/stat-tile/stat-tile.component';
import { RegistrationMapComponent } from './components/registration-map/registration-map.component';
import { ParticipantsByCountryChartComponent } from './components/participants-by-country-chart/participants-by-country-chart.component';
import { BrazilianCitiesComparisonComponent } from './components/brazilian-cities-comparison/brazilian-cities-comparison.component';

/** Edições com Sala de Guerra, da mais recente para a mais antiga. */
export const WAR_ROOM_YEARS = [2026, 2025];

@Component({
  selector: 'app-war-room',
  imports: [
    CommonModule,
    RouterModule,
    InscritosSectionComponent,
    RegistrationsExportSectionComponent,
    MentoresSectionComponent,
    FeedbackSectionComponent,
    TeamsSectionComponent,
    StatTileComponent,
    RegistrationMapComponent,
    ParticipantsByCountryChartComponent,
    BrazilianCitiesComparisonComponent,
  ],
  templateUrl: './war-room.component.html',
  styleUrl: './war-room.component.scss',
})
export class WarRoomComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  readonly years = WAR_ROOM_YEARS;

  /**
   * Ano da rota (/sala-de-guerra/2025 | /2026). Via observable, e não snapshot,
   * porque o seletor de edição reusa a mesma instância do componente.
   */
  readonly year = toSignal(
    this.route.data.pipe(map(d => (d['year'] as number) ?? CURRENT_CHALLENGE_YEAR)),
    { initialValue: CURRENT_CHALLENGE_YEAR }
  );

  readonly isCurrentEdition = computed(() => this.year() === CURRENT_CHALLENGE_YEAR);

  // ── Inscrições ────────────────────────────────────────────
  // 2025 veio de formulário próprio (Google Sheets, com recortes demográficos);
  // 2026 vem do export da plataforma da NASA, bem mais enxuto.
  inscritosStats = signal<RegistrationStats | null>(null);
  inscritosExtras = signal<InscritosExtras | null>(null);
  exportStats = signal<RegistrationExportStats | null>(null);
  loadingInscritos = signal(true);
  erroInscritos = signal(false);

  // Mentores (Google Sheets)
  mentores = signal<MentoresInsights | null>(null);
  loadingMentores = signal(true);
  erroMentores = signal(false);

  // Feedback (Google Sheets) — só existe depois do evento
  feedback = signal<FeedbackInsights | null>(null);
  loadingFeedback = signal(true);
  erroFeedback = signal(false);

  // Times e vencedores (JSON local)
  teamsInsights = signal<TeamsInsights | null>(null);
  winners = signal<WinnerTeam[]>([]);

  // Eventos globais (JSON local)
  cities = signal<CityParticipation[]>([]);
  uberlandia = signal<CityParticipation | null>(null);
  totalCitiesWorld = signal(0);
  totalParticipantsWorld = signal(0);

  /** Total de inscritos na sede segundo a plataforma — serve de contraprova ao export. */
  readonly platformRegistrations = computed(() => this.uberlandia()?.registrations ?? null);

  topCities = computed(() => this.cities().slice(0, 10));
  uberlandiaRank = computed(() => {
    const ube = this.uberlandia();
    if (!ube) return 0;
    return this.cities().indexOf(ube) + 1;
  });

  /** Total de inscritos da edição, seja qual for a fonte. */
  readonly totalInscritos = computed(() =>
    this.isCurrentEdition()
      ? this.exportStats()?.total ?? null
      : this.inscritosStats()?.totalRegistrations ?? null
  );

  private readonly destroyRef = inject(DestroyRef);
  private readonly sheets = inject(GoogleSheetsService);
  private readonly registrationData = inject(RegistrationDataService);
  private readonly registrationExport = inject(RegistrationExportService);
  private readonly insights = inject(WarRoomInsightsService);
  private readonly nasaTeams = inject(NasaTeamsService);
  private readonly winnerTeams = inject(WinnerTeamsService);

  ngOnInit(): void {
    this.nasaTeams.loadYear(this.year());
    this.subscribeTeams();
    this.subscribeLocalEvents();

    if (this.isCurrentEdition()) {
      this.loadRegistrationExport();
    } else {
      this.loadInscritos();
      this.loadMentores();
      this.loadFeedback();
      this.loadWinners();
    }
  }

  fmt(n: number): string {
    return n.toLocaleString('pt-BR');
  }

  /** 2026: export CSV da plataforma da NASA. */
  private loadRegistrationExport(): void {
    this.registrationExport.getStats(this.year()).subscribe({
      next: stats => {
        this.exportStats.set(stats);
        this.loadingInscritos.set(false);
      },
      error: err => {
        console.error('[WarRoom] export de inscrições — ERRO:', err);
        this.erroInscritos.set(true);
        this.loadingInscritos.set(false);
      },
    });
  }

  /** 2025: planilha do formulário próprio de inscrição. */
  private loadInscritos(): void {
    this.sheets.getInscritos().subscribe({
      next: rows => {
        this.registrationData.setRegistrationData(rows.map(row => this.toRegistrationData(row)));
        this.inscritosStats.set(this.registrationData.getRegistrationStats());
        this.inscritosExtras.set(this.insights.buildInscritosExtras(rows));
        this.loadingInscritos.set(false);
      },
      error: err => {
        console.error('[WarRoom] loadInscritos — ERRO:', err);
        this.erroInscritos.set(true);
        this.loadingInscritos.set(false);
      },
    });
  }

  /**
   * Adapta a linha da planilha ao contrato histórico do RegistrationDataService
   * (interests = data de nascimento, motivations = como ficou sabendo etc.).
   */
  private toRegistrationData(row: InscritoRow) {
    return {
      timestamp: row.timestamp ? row.timestamp.toISOString() : '',
      name: '',
      email: '',
      phone: row.ddd ? `${row.ddd}900000000` : '',
      city: row.city,
      motivations: row.howHeard,
      experience: row.education,
      interests: row.birthDate,
      availability: row.participationMode,
      expectations: row.interestAreas,
      gender: row.gender,
    };
  }

  private loadMentores(): void {
    this.sheets.getMentores().subscribe({
      next: rows => {
        this.mentores.set(this.insights.buildMentoresInsights(rows));
        this.loadingMentores.set(false);
      },
      error: err => {
        console.error('[WarRoom] loadMentores — ERRO:', err);
        this.erroMentores.set(true);
        this.loadingMentores.set(false);
      },
    });
  }

  private loadFeedback(): void {
    this.sheets.getFeedback().subscribe({
      next: rows => {
        this.feedback.set(this.insights.buildFeedbackInsights(rows));
        this.loadingFeedback.set(false);
      },
      error: err => {
        console.error('[WarRoom] loadFeedback — ERRO:', err);
        this.erroFeedback.set(true);
        this.loadingFeedback.set(false);
      },
    });
  }

  private subscribeTeams(): void {
    this.nasaTeams.teams$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(teams => {
        this.teamsInsights.set(teams.length ? this.insights.buildTeamsInsights(teams) : null);
      });
  }

  private subscribeLocalEvents(): void {
    this.nasaTeams.localEvents$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(events => {
        const mappedCities = events
          .map(event => ({
            city: event.properties.displayName,
            country: event.properties.country,
            registrations: event.properties.cachedRegistrations,
            eventType: event.properties.eventType,
            url: event.properties.meta.htmlUrl,
          }))
          .sort((a, b) => b.registrations - a.registrations);

        this.cities.set(mappedCities);

        const ube = mappedCities.find(city =>
          city.city.toLowerCase().includes('uberlândia') ||
          city.city.toLowerCase().includes('uberlandia')
        ) || null;
        this.uberlandia.set(ube);
        this.totalCitiesWorld.set(mappedCities.length);
        this.totalParticipantsWorld.set(mappedCities.reduce((sum, city) => sum + city.registrations, 0));
      });
  }

  private loadWinners(): void {
    this.winnerTeams.getAllWinnerTeams()
      .subscribe(winners => this.winners.set(winners));
  }
}
