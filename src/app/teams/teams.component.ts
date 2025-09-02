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

  constructor(private teamsService: TeamsService) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(after: string = ''): void {
    this.loading = true;
    this.error = '';

    this.teamsService.getTeams(100, after, this.searchQuery).subscribe({
      next: (response) => {
        if (response.data && response.data[0] && response.data[0].teams) {
          const teamsData = response.data[0].teams;
          if (after) {
            this.teams.push(...teamsData.edges.map(edge => edge.node));
          } else {
            this.teams = teamsData.edges.map(edge => edge.node);
          }
          this.totalCount = teamsData.totalCount;
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
}
