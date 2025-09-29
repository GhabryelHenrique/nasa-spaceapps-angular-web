import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeamsService } from '../services/teams.service';
import { Team } from '../shared/data/teams.data';

@Component({
  selector: 'app-teams',
  imports: [CommonModule, FormsModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  teams: Team[] = [];
  loading = false;
  error = '';
  searchQuery = '';
  totalCount = 0;
  hasNextPage = false;
  endCursor = '';

  // Filter properties
  selectedChallenge = '';
  availableChallenges: { id: string, title: string }[] = [];

  constructor(private teamsService: TeamsService) {}

  ngOnInit(): void {
    this.loadTeams();
    this.loadChallenges();
  }

  loadTeams(after: string = ''): void {
    this.loading = true;
    this.error = '';

    this.teamsService.getTeams(100, after, this.searchQuery).subscribe({
      next: (response) => {
        if (response.data && response.data[0] && response.data[0].teams) {
          const teamsData = response.data[0].teams;
          let teams = teamsData.edges.map(edge => edge.node);

          // Apply challenge filter
          if (this.selectedChallenge) {
            teams = teams.filter(team =>
              team.challengeDetails?.id === this.selectedChallenge ||
              team.challengeDetails?.title === this.selectedChallenge
            );
          }

          if (after) {
            this.teams.push(...teams);
          } else {
            this.teams = teams;
          }
          this.totalCount = this.selectedChallenge ? teams.length : teamsData.totalCount;
          this.hasNextPage = teamsData.pageInfo.hasNextPage;
          this.endCursor = teamsData.pageInfo.endCursor;
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar times. Tente novamente mais tarde.';
        this.loading = false;
        console.error('Error loading teams:', error);
      }
    });
  }

  onSearch(): void {
    this.loadTeams();
  }

  loadMore(): void {
    if (this.hasNextPage && !this.loading) {
      this.loadTeams(this.endCursor);
    }
  }

  getTeamImageUrl(team: Team): string {
    return team.featuredImage?.rendition?.fullUrl || '/assets/nasa-spaceapps-logo.png';
  }

  getMemberCount(team: Team): number {
    return team.memberships ? team.memberships.length : 0;
  }

  loadChallenges(): void {
    this.teamsService.getTeams(100, '', '').subscribe({
      next: (response) => {
        if (response.data && response.data[0] && response.data[0].teams) {
          const teams = response.data[0].teams.edges.map(edge => edge.node);
          const challengeMap = new Map<string, string>();

          teams.forEach(team => {
            if (team.challengeDetails && team.challengeDetails.title) {
              challengeMap.set(team.challengeDetails.id || team.challenge, team.challengeDetails.title);
            }
          });

          this.availableChallenges = Array.from(challengeMap.entries())
            .map(([id, title]) => ({ id, title }))
            .sort((a, b) => a.title.localeCompare(b.title));

            console.log('Available Challenges:', this.availableChallenges);
        }
      },
      error: (error) => {
        console.error('Error loading challenges:', error);
      }
    });
  }

  onChallengeFilter(): void {
    this.loadTeams();
  }

  clearFilters(): void {
    this.selectedChallenge = '';
    this.searchQuery = '';
    this.loadTeams();
  }

  getSelectedChallengeTitle(): string {
    const challenge = this.availableChallenges.find(c => c.id === this.selectedChallenge);
    return challenge ? challenge.title : '';
  }
}
