import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TeamsService } from '../services/teams.service';
import { Team } from '../shared/data/teams.data';

@Component({
  selector: 'app-teams',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  teams = signal<Team[]>([]);
  loading = signal(false);
  error = signal('');
  searchQuery = '';
  totalCount = signal(0);
  hasNextPage = signal(false);
  endCursor = signal('');

  // Filter properties
  selectedChallenge = '';
  availableChallenges: { id: string, title: string }[] = [];
  selectedSubmissionStatus = ''; // '' = todos, 'submitted' = submetidos, 'not-submitted' = não submetidos

  constructor(private teamsService: TeamsService) {}

  ngOnInit(): void {
    this.loadTeams();
    this.loadChallenges();
  }

  loadTeams(after: string = ''): void {
    this.loading.set(true);
    this.error.set('');

    this.teamsService.getTeams(100, after, this.searchQuery).subscribe({
      next: (response) => {
        if (response.data && response.data[0] && response.data[0].teams) {
          const teamsData = response.data[0].teams;
          let teamsList = teamsData.edges.map(edge => edge.node);

          // Apply challenge filter
          if (this.selectedChallenge) {
            teamsList = teamsList.filter(team =>
              team.challengeDetails?.id === this.selectedChallenge ||
              team.challengeDetails?.title === this.selectedChallenge
            );
          }

          // Apply submission status filter
          if (this.selectedSubmissionStatus === 'submitted') {
            teamsList = teamsList.filter(team => team.projectSubmitted === true);
          } else if (this.selectedSubmissionStatus === 'not-submitted') {
            teamsList = teamsList.filter(team => team.projectSubmitted === false);
          }

          if (after) {
            this.teams.update(prev => [...prev, ...teamsList]);
          } else {
            this.teams.set(teamsList);
          }
          this.totalCount.set(this.selectedChallenge ? teamsList.length : teamsData.totalCount);
          this.hasNextPage.set(teamsData.pageInfo.hasNextPage);
          this.endCursor.set(teamsData.pageInfo.endCursor);
        }
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Erro ao carregar times. Tente novamente mais tarde.');
        this.loading.set(false);
        console.error('Error loading teams:', error);
      }
    });
  }

  onSearch(): void {
    this.loadTeams();
  }

  loadMore(): void {
    if (this.hasNextPage() && !this.loading()) {
      this.loadTeams(this.endCursor());
    }
  }

  getTeamImageUrl(team: Team): string {
    return team.featuredImage?.rendition?.url || '/assets/nasa-spaceapps-logo.png';
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

  onSubmissionStatusFilter(): void {
    this.loadTeams();
  }

  clearFilters(): void {
    this.selectedChallenge = '';
    this.selectedSubmissionStatus = '';
    this.searchQuery = '';
    this.loadTeams();
  }

  getSelectedChallengeTitle(): string {
    const challenge = this.availableChallenges.find(c => c.id === this.selectedChallenge);
    return challenge ? challenge.title : '';
  }

  getSubmissionStatusLabel(): string {
    if (this.selectedSubmissionStatus === 'submitted') {
      return 'Projeto submetido';
    } else if (this.selectedSubmissionStatus === 'not-submitted') {
      return 'Projeto não submetido';
    }
    return '';
  }

  getTotalCountLabel(): string {
    if (this.selectedSubmissionStatus === 'submitted') {
      return this.teams().filter(team => team.projectSubmitted).length.toString();
    } else if (this.selectedSubmissionStatus === 'not-submitted') {
      return this.teams().filter(team => !team.projectSubmitted).length.toString();
    }
    return this.totalCount().toString();
  }
}
