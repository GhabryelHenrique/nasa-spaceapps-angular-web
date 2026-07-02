import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsService } from '../../../services/teams.service';
import { OtherCitiesTeamsService } from '../../../services/other-cities-teams.service';

interface CityComparison {
  cityName: string;
  totalTeams: number;
  submittedProjects: number;
  submissionRate: number;
  members: number;
  isUberlandia: boolean;
  rank?: number;
}

@Component({
  selector: 'app-brazilian-cities-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brazilian-cities-comparison.component.html',
  styleUrl: './brazilian-cities-comparison.component.scss'
})
export class BrazilianCitiesComparisonComponent implements OnInit {
  citiesComparison = signal<CityComparison[]>([]);
  uberlandia = signal<CityComparison | null>(null);
  otherCities = signal<CityComparison[]>([]);
  isLoading = signal(true);

  // Rankings
  uberlandiaTeamsRank = signal<number>(0);
  uberlandiaSubmissionRank = signal<number>(0);

  // Statistics
  totalTeamsBrazil = signal(0);
  totalSubmittedBrazil = signal(0);
  averageSubmissionRate = signal(0);

  constructor(
    private teamsService: TeamsService,
    private otherCitiesTeamsService: OtherCitiesTeamsService
  ) {}

  ngOnInit() {
    this.loadComparisonData();
  }

  private loadComparisonData() {
    this.isLoading.set(true);
    console.log('[BrazilianCitiesComparison] Iniciando loadComparisonData...');

    // Load Uberlândia data
    this.teamsService.getTeams(100, '', '').subscribe({
      next: (response) => {
        console.log('[BrazilianCitiesComparison] Resposta getTeams recebida:', response);
        if (response && response.data && response.data[0]) {
          const uberlandiaData = response.data[0];
          const teams = uberlandiaData.teams.edges.map(edge => edge.node);
          console.log('[BrazilianCitiesComparison] Uberlândia times mapeados:', teams.length);

          const ubeData = {
            cityName: 'Uberlândia',
            totalTeams: teams.length,
            submittedProjects: teams.filter(t => t.projectSubmitted).length,
            submissionRate: teams.length > 0
              ? (teams.filter(t => t.projectSubmitted).length / teams.length) * 100
              : 0,
            members: teams.reduce((sum, t) => sum + (t.memberships?.length || 0), 0),
            isUberlandia: true
          };
          this.uberlandia.set(ubeData);
          console.log('[BrazilianCitiesComparison] Uberlândia stats criadas:', ubeData);

          this.loadOtherCitiesData();
        } else {
          console.warn('[BrazilianCitiesComparison] Resposta getTeams inválida ou vazia:', response);
          this.isLoading.set(false);
        }
      },
      error: (error) => {
        console.error('[BrazilianCitiesComparison] Erro ao carregar dados de Uberlândia:', error);
        this.isLoading.set(false);
      }
    });
  }

  private loadOtherCitiesData() {
    console.log('[BrazilianCitiesComparison] Iniciando loadOtherCitiesData...');
    this.otherCitiesTeamsService.getBrazilianCitiesStats().subscribe({
      next: (stats) => {
        console.log('[BrazilianCitiesComparison] Estatísticas de outras cidades recebidas:', stats.length, stats);
        // Filtra Uberlândia para não duplicar
        const other = stats
          .filter(city => {
            const name = city.locationName.toLowerCase();
            return name !== 'uberlandia' && name !== 'uberlândia';
          })
          .map(city => ({
            cityName: city.locationName,
            totalTeams: city.totalTeams,
            submittedProjects: city.submittedProjects,
            submissionRate: city.submissionRate,
            members: 0,
            isUberlandia: false
          }));
        this.otherCities.set(other);
        console.log('[BrazilianCitiesComparison] Outras cidades mapeadas:', other.length);

        this.buildComparison();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('[BrazilianCitiesComparison] Erro ao carregar dados de outras cidades brasileiras:', error);
        this.isLoading.set(false);
      }
    });
  }

  private buildComparison() {
    const ube = this.uberlandia();
    if (!ube) return;

    // Combine all cities
    const list = [ube, ...this.otherCities()];

    // Sort by total teams
    const sortedByTeams = [...list].sort((a, b) => b.totalTeams - a.totalTeams);
    sortedByTeams.forEach((city, index) => {
      city.rank = index + 1;
      if (city.isUberlandia) {
        this.uberlandiaTeamsRank.set(index + 1);
      }
    });

    // Sort by submission rate for ranking
    const sortedBySubmission = [...list].sort((a, b) => b.submissionRate - a.submissionRate);
    const uberlandiaSubmissionIndex = sortedBySubmission.findIndex(c => c.isUberlandia);
    this.uberlandiaSubmissionRank.set(uberlandiaSubmissionIndex + 1);

    // Calculate statistics
    this.totalTeamsBrazil.set(list.reduce((sum, c) => sum + c.totalTeams, 0));
    this.totalSubmittedBrazil.set(list.reduce((sum, c) => sum + c.submittedProjects, 0));
    this.averageSubmissionRate.set(list.length > 0
      ? list.reduce((sum, c) => sum + c.submissionRate, 0) / list.length
      : 0);

    // Sort final list by total teams for display
    list.sort((a, b) => b.totalTeams - a.totalTeams);
    this.citiesComparison.set(list);
  }

  getUberlandiaPercentage(metric: 'teams' | 'submitted'): number {
    const ube = this.uberlandia();
    if (!ube) return 0;

    if (metric === 'teams' && this.totalTeamsBrazil() > 0) {
      return (ube.totalTeams / this.totalTeamsBrazil()) * 100;
    }

    if (metric === 'submitted' && this.totalSubmittedBrazil() > 0) {
      return (ube.submittedProjects / this.totalSubmittedBrazil()) * 100;
    }

    return 0;
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
}
