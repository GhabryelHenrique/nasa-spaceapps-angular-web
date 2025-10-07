import { Component, OnInit } from '@angular/core';
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
  citiesComparison: CityComparison[] = [];
  uberlandia: CityComparison | null = null;
  otherCities: CityComparison[] = [];
  isLoading = true;

  // Rankings
  uberlandiaTeamsRank: number = 0;
  uberlandiaSubmissionRank: number = 0;

  // Statistics
  totalTeamsBrazil = 0;
  totalSubmittedBrazil = 0;
  averageSubmissionRate = 0;

  constructor(
    private teamsService: TeamsService,
    private otherCitiesTeamsService: OtherCitiesTeamsService
  ) {}

  ngOnInit() {
    this.loadComparisonData();
  }

  private loadComparisonData() {
    this.isLoading = true;

    // Load Uberlândia data
    this.teamsService.getTeams(100, '', '').subscribe({
      next: (response) => {
        if (response.data && response.data[0]) {
          const uberlandiaData = response.data[0];
          const teams = uberlandiaData.teams.edges.map(edge => edge.node);

          this.uberlandia = {
            cityName: 'Uberlândia',
            totalTeams: teams.length,
            submittedProjects: teams.filter(t => t.projectSubmitted).length,
            submissionRate: teams.length > 0
              ? (teams.filter(t => t.projectSubmitted).length / teams.length) * 100
              : 0,
            members: teams.reduce((sum, t) => sum + (t.memberships?.length || 0), 0),
            isUberlandia: true
          };

          this.loadOtherCitiesData();
        }
      },
      error: (error) => {
        console.error('Erro ao carregar dados de Uberlândia:', error);
        this.isLoading = false;
      }
    });
  }

  private loadOtherCitiesData() {
    this.otherCitiesTeamsService.getTeamStatsByCity().subscribe({
      next: (stats) => {
        this.otherCities = stats.map(city => ({
          cityName: city.locationName,
          totalTeams: city.totalTeams,
          submittedProjects: city.submittedProjects,
          submissionRate: city.submissionRate,
          members: 0, // Não temos essa informação nas outras cidades ainda
          isUberlandia: false
        }));

        this.buildComparison();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados de outras cidades:', error);
        this.isLoading = false;
      }
    });
  }

  private buildComparison() {
    if (!this.uberlandia) return;

    // Combine all cities
    this.citiesComparison = [this.uberlandia, ...this.otherCities];

    // Sort by total teams
    const sortedByTeams = [...this.citiesComparison].sort((a, b) => b.totalTeams - a.totalTeams);
    sortedByTeams.forEach((city, index) => {
      city.rank = index + 1;
      if (city.isUberlandia) {
        this.uberlandiaTeamsRank = index + 1;
      }
    });

    // Sort by submission rate for ranking
    const sortedBySubmission = [...this.citiesComparison].sort((a, b) => b.submissionRate - a.submissionRate);
    const uberlandiaSubmissionIndex = sortedBySubmission.findIndex(c => c.isUberlandia);
    this.uberlandiaSubmissionRank = uberlandiaSubmissionIndex + 1;

    // Calculate statistics
    this.totalTeamsBrazil = this.citiesComparison.reduce((sum, c) => sum + c.totalTeams, 0);
    this.totalSubmittedBrazil = this.citiesComparison.reduce((sum, c) => sum + c.submittedProjects, 0);
    this.averageSubmissionRate = this.citiesComparison.length > 0
      ? this.citiesComparison.reduce((sum, c) => sum + c.submissionRate, 0) / this.citiesComparison.length
      : 0;

    // Sort final list by total teams for display
    this.citiesComparison.sort((a, b) => b.totalTeams - a.totalTeams);
  }

  getUberlandiaPercentage(metric: 'teams' | 'submitted'): number {
    if (!this.uberlandia) return 0;

    if (metric === 'teams' && this.totalTeamsBrazil > 0) {
      return (this.uberlandia.totalTeams / this.totalTeamsBrazil) * 100;
    }

    if (metric === 'submitted' && this.totalSubmittedBrazil > 0) {
      return (this.uberlandia.submittedProjects / this.totalSubmittedBrazil) * 100;
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
