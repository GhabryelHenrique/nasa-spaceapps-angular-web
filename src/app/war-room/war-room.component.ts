import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as localEvents  from '../../assets/data/localEvents.json';
import { CityParticipation } from '../shared/interfaces/local-event.interface';
import { RegistrationChartsComponent } from './components/registration-charts/registration-charts.component';
import { RegistrationMapComponent } from './components/registration-map/registration-map.component';
import { ChallengeChartComponent } from './components/challenge-chart/challenge-chart.component';
import { ParticipantsByCountryChartComponent } from './components/participants-by-country-chart/participants-by-country-chart.component';
import { BrazilianCitiesComparisonComponent } from './components/brazilian-cities-comparison/brazilian-cities-comparison.component';
import { WorldCitiesComparisonComponent } from './components/world-cities-comparison/world-cities-comparison.component';
import { FeedbackDetailsComponent } from './components/feedback-details/feedback-details.component';
import { RegistrationDataService, RegistrationStats } from '../services/registration-data.service';
import { GoogleSheetsService, RegistrationRow, FeedbackRow } from '../services/google-sheets.service';
import { NasaTeamsService, TeamData, LocalEventData } from '../services/nasa-teams.service';
import { TeamsService } from '../services/teams.service';
import { OtherCitiesTeamsService } from '../services/other-cities-teams.service';
import { Team } from '../shared/data/teams.data';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-war-room',
  imports: [CommonModule, RegistrationChartsComponent, RegistrationMapComponent, ChallengeChartComponent, ParticipantsByCountryChartComponent, BrazilianCitiesComparisonComponent, WorldCitiesComparisonComponent, FeedbackDetailsComponent],
  templateUrl: './war-room.component.html',
  styleUrl: './war-room.component.scss'
})
export class WarRoomComponent implements OnInit, OnDestroy {
  cities: CityParticipation[] = [];
  sortOrder: 'desc' | 'asc' = 'desc';
  totalParticipants = 0;
  totalCities = 0;
  uberlandia: any
  registrationStats: RegistrationStats | any = null;
  isLoadingFile = false;

  // Feedback data
  feedbackData: FeedbackRow[] = [];
  feedbackStats: any = null;
  isLoadingFeedback = false;

  // NASA Teams data
  teams: TeamData[] = [];
  localEventsLive: LocalEventData[] = [];
  isLoadingTeams = false;
  teamsError: string | null = null;
  lastTeamsUpdate: Date | null = null;

  // Teams data for challenge chart
  teamsForChart: Team[] = [];

  // City teams stats
  cityTeamsStats: Array<{
    locationName: string;
    locationId: string;
    totalTeams: number;
    submittedProjects: number;
    submissionRate: number;
  }> = [];

  private destroy$ = new Subject<void>();

  constructor(
    private registrationDataService: RegistrationDataService,
    private googleSheetsService: GoogleSheetsService,
    private nasaTeamsService: NasaTeamsService,
    private teamsService: TeamsService,
    private otherCitiesTeamsService: OtherCitiesTeamsService
  ) {}

  ngOnInit() {
    this.loadCities();
    this.loadGoogleSheetsData();
    this.loadFeedbackData();
    this.subscribeToNasaData();
    this.loadTeamsData();
    this.loadCityTeamsStats();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToNasaData() {
    // Subscribe to teams data
    this.nasaTeamsService.teams$
      .pipe(takeUntil(this.destroy$))
      .subscribe(teams => {
        this.teams = teams;
        this.lastTeamsUpdate = new Date();
        console.log(`🚀 Times NASA atualizados: ${teams.length} teams`);
      });

    // Subscribe to local events data
    this.nasaTeamsService.localEvents$
      .pipe(takeUntil(this.destroy$))
      .subscribe(events => {
        this.localEventsLive = events;
        // Atualiza os dados das cidades com dados em tempo real se disponível
        this.updateCitiesWithLiveData();
        console.log(`🌍 Eventos locais atualizados: ${events.length} eventos`);
      });

    // Subscribe to loading state
    this.nasaTeamsService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoadingTeams = loading;
      });

    // Subscribe to error state
    this.nasaTeamsService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.teamsError = error;
      });
  }

  private updateCitiesWithLiveData() {
    if (this.localEventsLive.length > 0) {
      // Merge dados estáticos com dados em tempo real
      this.cities = this.cities.map(city => {
        const liveEvent = this.localEventsLive.find(event =>
          event.properties.displayName.toLowerCase() === city.city.toLowerCase() ||
          event.properties.title.toLowerCase() === city.city.toLowerCase()
        );

        if (liveEvent) {
          return {
            ...city,
            registrations: liveEvent.properties.cachedRegistrations,
            eventType: liveEvent.properties.eventType,
            url: liveEvent.properties.meta.htmlUrl
          };
        }

        return city;
      });

      // Encontra Uberlândia nos dados em tempo real
      const uberlandiaLive = this.localEventsLive.find(event =>
        event.properties.displayName.toLowerCase().includes('uberlândia') ||
        event.properties.displayName.toLowerCase().includes('uberlandia')
      );

      if (uberlandiaLive) {
        this.uberlandia = {
          city: uberlandiaLive.properties.displayName,
          country: uberlandiaLive.properties.country,
          registrations: uberlandiaLive.properties.cachedRegistrations,
          eventType: uberlandiaLive.properties.eventType,
          url: uberlandiaLive.properties.meta.htmlUrl
        };
      }

      this.sortCities();
      this.calculateStats();
    }
  }

  private loadGoogleSheetsData() {
    console.log('=== WAR ROOM COMPONENT DEBUG ===');
    console.log('Carregando dados diretamente do Google Sheets');

    this.isLoadingFile = true;

    this.googleSheetsService.getRegistrationDataFromGoogleSheets().subscribe({
      next: (data: RegistrationRow[]) => {
        console.log('Dados brutos recebidos do Google Sheets:', data.length, 'registros');
        console.log('Primeira linha de dados (anonimizada):', data[0]);

        try {
          // Transforma os dados do Google Sheets no formato esperado pelo service
          const registrationData = data.map((row: RegistrationRow) => ({
            timestamp: this.convertTimestampToDate(row.timestamp),
            name: row.name || '', // Nome anonimizado (apenas iniciais)
            email: row.email || row.emailAddress || '', // Email removido para privacidade
            phone: row.ddd ? `${row.ddd}000000000` : (row.phone || ''), // DDD ou telefone para análise de região
            city: row.city || '',
            motivations: row.howHeard || '',
            experience: row.education || '',
            interests: row.birthDate || '',
            availability: row.participationMode || '',
            expectations: row.interestAreas || '',
            gender: row.gender || '', // Dados de gênero para análise
          }));

          console.log('Dados transformados:', registrationData.length, 'registros');
          console.log('Primeiro registro transformado:', registrationData[0]);

          // Atualiza o service com os dados do Google Sheets
          this.registrationDataService.setRegistrationData(registrationData);
          this.registrationStats = this.registrationDataService.getRegistrationStats();

          console.log('Stats calculadas:', this.registrationStats);
          console.log(`Dados do Google Sheets carregados com sucesso: ${this.registrationStats?.totalRegistrations} registros`);
          console.log('=== END WAR ROOM DEBUG ===');
        } catch (error) {
          console.error('Erro ao processar dados do Google Sheets:', error);
        } finally {
          this.isLoadingFile = false;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar dados do Google Sheets:', error);
        console.log('Detalhes do erro:', error);
        console.log('Tentando carregar dados do arquivo local como fallback...');

        // Fallback para arquivo local em caso de erro
        this.googleSheetsService.getRegistrationDataFromLocal().subscribe({
          next: (data: RegistrationRow[]) => {
            console.log('Dados do fallback local carregados:', data.length, 'registros');
            const registrationData = data.map((row: RegistrationRow) => ({
              timestamp: this.convertTimestampToDate(row.timestamp),
              name: row.name || '',
              email: row.email || row.emailAddress || '',
              phone: row.ddd ? `${row.ddd}000000000` : (row.phone || ''),
              city: row.city || '',
              motivations: row.howHeard || '',
              experience: row.education || '',
              interests: row.birthDate || '',
              availability: row.participationMode || '',
              expectations: row.interestAreas || '',
              gender: row.gender || '',
            }));
            this.registrationDataService.setRegistrationData(registrationData);
            this.registrationStats = this.registrationDataService.getRegistrationStats();
            this.isLoadingFile = false;
          },
          error: (fallbackError) => {
            console.error('Erro ao carregar fallback local:', fallbackError);
            this.isLoadingFile = false;
          }
        });
      }
    });
  }

  private convertTimestampToDate(timestamp: any): string {
    try {
      if (!timestamp) return '';

      // Se é uma string de data do Google Forms (formato brasileiro)
      if (typeof timestamp === 'string') {
        // Tenta diferentes formatos de data
        const brazilianDatePattern = /(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/;
        const match = timestamp.match(brazilianDatePattern);

        if (match) {
          // Formato: DD/MM/YYYY HH:MM:SS
          const [, day, month, year, hour, minute, second] = match;
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
          return date.toISOString();
        }

        // Tenta parsing direto se não for formato brasileiro
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
      }

      // Se é timestamp em milissegundos
      if (typeof timestamp === 'number') {
        const date = new Date(timestamp);
        return date.toISOString();
      }

      return String(timestamp || '');
    } catch (error) {
      console.warn('Erro ao converter timestamp:', timestamp, error);
      return '';
    }
  }

  private loadCities() {
    this.cities = localEvents.data.map((event: any) => ({
      city: event.node.properties.displayName,
      country: event.node.properties.country,
      registrations: event.node.properties.cachedRegistrations,
      eventType: event.node.properties.eventType,
      url: event.node.properties.meta.htmlUrl
    }));
    this.uberlandia = this.cities.find((city: any) => city.city.toLowerCase().includes('uberlandia') || city.city.toLowerCase().includes('uberlândia'));
    this.sortCities();
    this.calculateStats();
  }

  sortCities(order?: 'desc' | 'asc') {
    if (order) {
      this.sortOrder = order;
    }

    this.cities.sort((a, b) => {
      if (this.sortOrder === 'desc') {
        return b.registrations - a.registrations;
      } else {
        return a.registrations - b.registrations;
      }
    }).slice(0, 10);
  }

  private calculateStats() {
    this.totalCities = this.cities.length;
    this.totalParticipants = this.cities.reduce((sum, city) => sum + city.registrations, 0);
  }

  getEventTypeClass(eventType: string): string {
    switch (eventType) {
      case 'In-Person':
        return 'event-type-inperson';
      case 'Virtual':
        return 'event-type-virtual';
      case 'Virtual & In-Person':
        return 'event-type-hybrid';
      default:
        return '';
    }
  }

  getEventTypeIcon(eventType: string): string {
    switch (eventType) {
      case 'In-Person':
        return '👥';
      case 'Virtual':
        return '💻';
      case 'Virtual & In-Person':
        return '🌐';
      default:
        return '📍';
    }
  }

  trackByCity(index: number, city: CityParticipation): string {
    return `${city.city}-${city.country}`;
  }

  getDayWithMostRegistrations(): number {
    if (!this.registrationStats || !this.registrationStats.dailyRegistrations.length) {
      return 0;
    }
    return Math.max(...this.registrationStats.dailyRegistrations.map((d: { date: string; count: number }) => d.count));
  }

  getMostCommonEducation(): string {
    if (!this.registrationStats || !this.registrationStats.experienceStats.length) {
      return 'N/A';
    }
    return this.registrationStats.experienceStats[0].level;
  }

  getEducationPercentage(): number {
    if (!this.registrationStats || !this.registrationStats.experienceStats.length) {
      return 0;
    }
    const mostCommon = this.registrationStats.experienceStats[0];
    return Math.round((mostCommon.count / this.registrationStats.totalRegistrations) * 100);
  }

  getMostCommonAgeGroup(): string {
    if (!this.registrationStats || !this.registrationStats.ageStats.length) {
      return 'N/A';
    }
    return this.registrationStats.ageStats.sort((a: { ageGroup: string; count: number }, b: { ageGroup: string; count: number }) => b.count - a.count)[0].ageGroup;
  }

  getAgeGroupPercentage(): number {
    if (!this.registrationStats || !this.registrationStats.ageStats.length) {
      return 0;
    }
    const mostCommon = this.registrationStats.ageStats[0];
    return Math.round((mostCommon.count / this.registrationStats.totalRegistrations) * 100);
  }

  getParticipationMode(): string {
    if (!this.registrationStats || !this.registrationStats.participationModeStats.length) {
      return 'N/A';
    }
    return this.registrationStats.participationModeStats[0].mode;
  }

  getParticipationPercentage(): number {
    if (!this.registrationStats || !this.registrationStats.participationModeStats.length) {
      return 0;
    }
    const mostCommon = this.registrationStats.participationModeStats[0];
    return Math.round((mostCommon.count / this.registrationStats.totalRegistrations) * 100);
  }

  getMostCommonArea(): string {
    if (!this.registrationStats || !this.registrationStats.phoneAreaStats.length) {
      return 'N/A';
    }
    return this.registrationStats.phoneAreaStats[0].area;
  }

  getAreaPercentage(): number {
    if (!this.registrationStats || !this.registrationStats.phoneAreaStats.length) {
      return 0;
    }
    const mostCommon = this.registrationStats.phoneAreaStats[0];
    return Math.round((mostCommon.count / this.registrationStats.totalRegistrations) * 100);
  }

  // Métodos para refresh manual dos dados NASA
  refreshNasaTeams() {
    console.log('🔄 Refresh manual dos times NASA...');
    this.nasaTeamsService.refreshTeams();
  }

  refreshLocalEvents() {
    console.log('🔄 Refresh manual dos eventos locais...');
    this.nasaTeamsService.refreshLocalEvents();
  }

  refreshAllNasaData() {
    console.log('🔄 Refresh manual de todos os dados NASA...');
    this.nasaTeamsService.refreshAll();
  }

  // Getters para estatísticas dos times
  get totalTeams(): number {
    return this.teams.length;
  }

  get teamsWithProjects(): number {
    return this.teams.filter(team => team.projectSubmitted).length;
  }

  get uberlandiaTeams(): number {
    return this.teams.filter(team =>
      team.locationDetails?.displayName?.toLowerCase().includes('uberlândia') ||
      team.locationDetails?.displayName?.toLowerCase().includes('uberlandia')
    ).length;
  }

  get teamMembersTotal(): number {
    return this.teams.reduce((total, team) => total + (team.memberships?.length || 0), 0);
  }

  // Helper para formatação de data
  formatLastUpdate(date: Date | null): string {
    if (!date) return 'Nunca';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes} min atrás`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;

    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  }

  // Method to load teams data for challenge chart
  private loadTeamsData() {
    this.teamsService.getTeams(100, '', '').subscribe({
      next: (response) => {
        if (response.data && response.data[0] && response.data[0].teams) {
          this.teamsForChart = response.data[0].teams.edges.map(edge => edge.node);
          console.log(`📊 Teams carregados para gráfico de desafios: ${this.teamsForChart.length} times`);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar times para gráfico:', error);
      }
    });
  }

  // Method to load city teams statistics (outras cidades)
  private loadCityTeamsStats() {
    this.otherCitiesTeamsService.getTeamStatsByCity().subscribe({
      next: (stats) => {
        this.cityTeamsStats = stats;
        console.log(`🌍 Estatísticas de times por cidade carregadas: ${stats.length} cidades`);
        console.log('Estatísticas:', stats);
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas de times por cidade:', error);
      }
    });
  }

  // Helper method to get total teams across all cities
  get totalTeamsAllCities(): number {
    return this.cityTeamsStats.reduce((total, city) => total + city.totalTeams, 0);
  }

  // Helper method to get total submitted projects across all cities
  get totalSubmittedProjectsAllCities(): number {
    return this.cityTeamsStats.reduce((total, city) => total + city.submittedProjects, 0);
  }

  // Helper method to get average submission rate
  get averageSubmissionRate(): number {
    if (this.cityTeamsStats.length === 0) return 0;
    const totalRate = this.cityTeamsStats.reduce((total, city) => total + city.submissionRate, 0);
    return totalRate / this.cityTeamsStats.length;
  }

  // Feedback data methods
  private loadFeedbackData() {
    console.log('=== LOADING FEEDBACK DATA ===');
    this.isLoadingFeedback = true;

    this.googleSheetsService.getFeedbackDataFromGoogleSheets().subscribe({
      next: (data: FeedbackRow[]) => {
        console.log('Dados de feedback recebidos:', data.length, 'respostas');
        this.feedbackData = data;
        this.calculateFeedbackStats();
        this.isLoadingFeedback = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados de feedback:', error);
        this.isLoadingFeedback = false;
      }
    });
  }

  private calculateFeedbackStats() {
    if (this.feedbackData.length === 0) {
      this.feedbackStats = null;
      return;
    }

    // Calcula médias das avaliações numéricas baseadas nos novos campos
    const numericRatings = {
      communication: this.calculateAverageRating(this.feedbackData.map(f => f.communicationRating)),
      scheduleClarity: this.calculateAverageRating(this.feedbackData.map(f => f.scheduleClarity)),
      mentorsSupport: this.calculateAverageRating(this.feedbackData.map(f => f.mentorsSupport)),
      volunteersQuality: this.calculateAverageRating(this.feedbackData.map(f => f.volunteersQuality)),
      discordStructure: this.calculateAverageRating(this.feedbackData.map(f => f.discordStructure)),

      // Médias dos locais
      venueNASADigital: this.calculateAverageRating(this.feedbackData.map(f => f.venueNASADigital)),
      venueIFTM: this.calculateAverageRating(this.feedbackData.map(f => f.venueIFTM)),
      venueSankhya: this.calculateAverageRating(this.feedbackData.map(f => f.venueSankhya)),
      venueUFU: this.calculateAverageRating(this.feedbackData.map(f => f.venueUFU)),
      venueUNA: this.calculateAverageRating(this.feedbackData.map(f => f.venueUNA)),
      venueUniube: this.calculateAverageRating(this.feedbackData.map(f => f.venueUniube)),

      // Médias das palestras
      talkUberlandia: this.calculateAverageRating(this.feedbackData.map(f => f.talkUberlandia)),
      talkGabrielle: this.calculateAverageRating(this.feedbackData.map(f => f.talkGabrielle)),
      talkCasosSucesso: this.calculateAverageRating(this.feedbackData.map(f => f.talkCasosSucesso)),
      talkIA: this.calculateAverageRating(this.feedbackData.map(f => f.talkIA)),
      talkDicasHackathon: this.calculateAverageRating(this.feedbackData.map(f => f.talkDicasHackathon)),
      talkPitch: this.calculateAverageRating(this.feedbackData.map(f => f.talkPitch)),
      talkAstronauta: this.calculateAverageRating(this.feedbackData.map(f => f.talkAstronauta)),
      talkCienciaEspaco: this.calculateAverageRating(this.feedbackData.map(f => f.talkCienciaEspaco))
    };

    // Conta satisfação geral
    const satisfactionCounts = this.countValues(this.feedbackData.map(f => f.overallSatisfaction));

    // Conta recomendação
    const recommendationCounts = this.countValues(this.feedbackData.map(f => f.recommendation));

    // Conta diversidade de desafios
    const challengesDiversityCounts = this.countValues(this.feedbackData.map(f => f.challengesDiversity));

    // Conta formação de equipe
    const teamFormationCounts = this.countValues(this.feedbackData.map(f => f.teamFormation));

    this.feedbackStats = {
      totalResponses: this.feedbackData.length,
      averageRatings: numericRatings,
      overallAverage: this.calculateOverallAverage(numericRatings),
      satisfactionCounts,
      recommendationCounts,
      challengesDiversityCounts,
      teamFormationCounts,
      commentsCount: this.feedbackData.filter(f => f.additionalComments && f.additionalComments.trim() !== '').length,
      positiveAspectsCount: this.feedbackData.filter(f => f.positiveAspects && f.positiveAspects.trim() !== '').length,
      improvementSuggestionsCount: this.feedbackData.filter(f => f.improvementSuggestions && f.improvementSuggestions.trim() !== '').length
    };

    console.log('Estatísticas de feedback calculadas:', this.feedbackStats);
  }

  private calculateAverageRating(ratings: string[]): number {
    const validRatings = ratings
      .map(r => parseFloat(r))
      .filter(r => !isNaN(r) && r > 0);

    if (validRatings.length === 0) return 0;

    const sum = validRatings.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / validRatings.length) * 10) / 10;
  }

  private calculateOverallAverage(ratings: any): number {
    const values = Object.values(ratings) as number[];
    const validValues = values.filter(v => v > 0);
    if (validValues.length === 0) return 0;
    const sum = validValues.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / validValues.length) * 10) / 10;
  }

  private countValues(values: string[]): { [key: string]: number } {
    return values.reduce((acc, val) => {
      if (val && val.trim() !== '') {
        acc[val] = (acc[val] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });
  }

  // Getter methods for feedback stats
  get feedbackResponsesCount(): number {
    return this.feedbackStats?.totalResponses || 0;
  }

  get feedbackOverallAverage(): number {
    return this.feedbackStats?.overallAverage || 0;
  }

  get feedbackMostCommonSatisfaction(): string {
    if (!this.feedbackStats?.satisfactionCounts) return 'N/A';
    const entries = Object.entries(this.feedbackStats.satisfactionCounts);
    if (entries.length === 0) return 'N/A';
    const sorted = entries.sort((a, b) => (b[1] as number) - (a[1] as number));
    return sorted[0][0];
  }

  get feedbackRecommendationPercentage(): number {
    if (!this.feedbackStats?.recommendationCounts) return 0;
    const positive = (this.feedbackStats.recommendationCounts['Sim'] || 0) +
                     (this.feedbackStats.recommendationCounts['Com certeza'] || 0);
    return Math.round((positive / this.feedbackStats.totalResponses) * 100);
  }
}
