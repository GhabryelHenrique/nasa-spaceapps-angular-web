import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BestMatchesResponse, IndividualMatch, TeamMatchResult } from '../../models/matchmaking.models';
import { AuthService } from '../../services/api/auth.service';
import { MatchmakingAuthService } from '../../services/api/matchmaking.service';
import { UserRegistration } from '../../models/auth.models';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss'
})
export class MatchesComponent implements OnInit {
  currentUser: UserRegistration | null = null;
  bestMatches: BestMatchesResponse | null = null;
  isLoading = false;
  error: string | null = null;
  showTeamMatches = false;
  selectedTab: 'individual' | 'team' = 'individual';

  constructor(
    private authService: AuthService,
    private matchmakingService: MatchmakingAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.email) {
      this.loadBestMatches();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadBestMatches(): void {
    if (!this.currentUser?.email) return;

    this.isLoading = true;
    this.error = null;

    this.matchmakingService.getBestMatches(
      this.currentUser.email,
      20,
      this.showTeamMatches
    ).subscribe({
      next: (response) => {
        this.bestMatches = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar matches. Tente novamente.';
        this.isLoading = false;
        console.error('Error loading best matches:', err);
      }
    });
  }

  selectTab(tab: 'individual' | 'team'): void {
    this.selectedTab = tab;
    if (tab === 'team' && !this.showTeamMatches) {
      this.showTeamMatches = true;
      this.loadBestMatches();
    }
  }

  getScoreColor(score: number): string {
    if (score >= 0.8) return '#4CAF50'; // Verde
    if (score >= 0.6) return '#FF9800'; // Laranja
    return '#F44336'; // Vermelho
  }

  getScorePercentage(score: number): number {
    return Math.round(score * 100);
  }

  getExpertiseLevelLabel(level: string): string {
    const labels: Record<string, string> = {
      'beginner': 'Iniciante',
      'intermediate': 'Intermediário',
      'advanced': 'Avançado',
      'expert': 'Especialista'
    };
    return labels[level] || level;
  }

  goToProfile(email: string): void {
    // TODO: Implementar navegação para perfil do usuário
    console.log('Navigate to profile:', email);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  sendMessage(email: string): void {
    // TODO: Implementar sistema de mensagens
    console.log('Send message to:', email);
  }

  viewTeamDetails(teamId: string): void {
    // TODO: Implementar visualização de detalhes do time
    console.log('View team details:', teamId);
  }

  trackByEmail(index: number, match: IndividualMatch): string {
    return match.participant.email;
  }

  trackByTeamId(index: number, team: TeamMatchResult): string {
    return team.teamId;
  }
}
