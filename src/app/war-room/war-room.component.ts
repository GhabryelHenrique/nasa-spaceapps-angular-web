import { Component, OnInit, DestroyRef, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { CityParticipation } from '../shared/interfaces/local-event.interface';
import { GoogleSheetsService, InscritoRow } from '../services/google-sheets.service';
import { RegistrationDataService, RegistrationStats } from '../services/registration-data.service';
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
import { InscritosSectionComponent } from './components/inscritos-section/inscritos-section.component';
import { MentoresSectionComponent } from './components/mentores-section/mentores-section.component';
import { FeedbackSectionComponent } from './components/feedback-section/feedback-section.component';
import { TeamsSectionComponent } from './components/teams-section/teams-section.component';
import { StatTileComponent } from './components/stat-tile/stat-tile.component';
import { RegistrationMapComponent } from './components/registration-map/registration-map.component';
import { ParticipantsByCountryChartComponent } from './components/participants-by-country-chart/participants-by-country-chart.component';
import { BrazilianCitiesComparisonComponent } from './components/brazilian-cities-comparison/brazilian-cities-comparison.component';

@Component({
  selector: 'app-war-room',
  imports: [
    CommonModule,
    InscritosSectionComponent,
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
  // Inscrições (Google Sheets)
  inscritosStats = signal<RegistrationStats | null>(null);
  inscritosExtras = signal<InscritosExtras | null>(null);
  loadingInscritos = signal(true);
  erroInscritos = signal(false);

  // Mentores (Google Sheets)
  mentores = signal<MentoresInsights | null>(null);
  loadingMentores = signal(true);
  erroMentores = signal(false);

  // Feedback (Google Sheets)
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

  // Computed properties
  topCities = computed(() => this.cities().slice(0, 10));
  uberlandiaRank = computed(() => {
    const ube = this.uberlandia();
    if (!ube) return 0;
    return this.cities().indexOf(ube) + 1;
  });

  private readonly destroyRef = inject(DestroyRef);
  private readonly sheets = inject(GoogleSheetsService);
  private readonly registrationData = inject(RegistrationDataService);
  private readonly insights = inject(WarRoomInsightsService);
  private readonly nasaTeams = inject(NasaTeamsService);
  private readonly winnerTeams = inject(WinnerTeamsService);

  ngOnInit(): void {
    console.log('[WarRoom] ngOnInit — iniciando carregamento de dados');
    this.loadInscritos();
    this.loadMentores();
    this.loadFeedback();
    this.subscribeTeams();
    this.subscribeLocalEvents();
    this.loadWinners();
  }

  fmt(n: number): string {
    return n.toLocaleString('pt-BR');
  }

  private loadInscritos(): void {
    console.log('[WarRoom] loadInscritos — chamando sheets.getInscritos()');
    this.sheets.getInscritos().subscribe({
      next: rows => {
        console.log('[WarRoom] loadInscritos — recebeu', rows.length, 'linhas da planilha');
        const mappedData = rows.map(row => this.toRegistrationData(row));
        console.log('[WarRoom] loadInscritos — dados mapeados:', mappedData.length, 'registros');
        this.registrationData.setRegistrationData(mappedData);
        const stats = this.registrationData.getRegistrationStats();
        this.inscritosStats.set(stats);
        console.log('[WarRoom] loadInscritos — stats:', JSON.stringify({
          total: stats?.totalRegistrations,
          cities: stats?.cityStats?.length,
          ageGroups: stats?.ageStats?.length,
        }));
        this.inscritosExtras.set(this.insights.buildInscritosExtras(rows));
        console.log('[WarRoom] loadInscritos — extras:', !!this.inscritosExtras());
        this.loadingInscritos.set(false);
        console.log('[WarRoom] loadInscritos — CONCLUÍDO. loadingInscritos=false');
      },
      error: (err) => {
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
    console.log('[WarRoom] loadMentores — chamando sheets.getMentores()');
    this.sheets.getMentores().subscribe({
      next: rows => {
        console.log('[WarRoom] loadMentores — recebeu', rows.length, 'linhas');
        const insightsData = this.insights.buildMentoresInsights(rows);
        this.mentores.set(insightsData);
        console.log('[WarRoom] loadMentores — insights:', !!insightsData, 'total:', insightsData?.total);
        this.loadingMentores.set(false);
      },
      error: (err) => {
        console.error('[WarRoom] loadMentores — ERRO:', err);
        this.erroMentores.set(true);
        this.loadingMentores.set(false);
      },
    });
  }

  private loadFeedback(): void {
    console.log('[WarRoom] loadFeedback — chamando sheets.getFeedback()');
    this.sheets.getFeedback().subscribe({
      next: rows => {
        console.log('[WarRoom] loadFeedback — recebeu', rows.length, 'linhas');
        const insightsData = this.insights.buildFeedbackInsights(rows);
        this.feedback.set(insightsData);
        console.log('[WarRoom] loadFeedback — insights:', !!insightsData, 'total:', insightsData);
        console.log('[WarRoom] loadFeedback — NPS:', insightsData?.nps?.score, 'Satisfação:', insightsData?.overallAvg);
        this.loadingFeedback.set(false);
      },
      error: (err) => {
        console.error('[WarRoom] loadFeedback — ERRO:', err);
        this.erroFeedback.set(true);
        this.loadingFeedback.set(false);
      },
    });
  }

  private subscribeTeams(): void {
    console.log('[WarRoom] subscribeTeams — inscrevendo em nasaTeams.teams$');
    this.nasaTeams.teams$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(teams => {
        console.log('[WarRoom] subscribeTeams — recebeu', teams.length, 'times');
        const insightsData = teams.length ? this.insights.buildTeamsInsights(teams) : null;
        this.teamsInsights.set(insightsData);
        console.log('[WarRoom] subscribeTeams — insights:', !!insightsData);
      });
  }

  private subscribeLocalEvents(): void {
    console.log('[WarRoom] subscribeLocalEvents — inscrevendo em nasaTeams.localEvents$');
    this.nasaTeams.localEvents$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(events => {
        console.log('[WarRoom] subscribeLocalEvents — recebeu', events.length, 'eventos');
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
    console.log('[WarRoom] loadWinners — chamando winnerTeams.getAllWinnerTeams()');
    this.winnerTeams.getAllWinnerTeams()
      .subscribe(winners => {
        console.log('[WarRoom] loadWinners — recebeu', winners.length, 'vencedores');
        this.winners.set(winners);
      });
  }
}
