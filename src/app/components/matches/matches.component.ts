import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BestMatchesResponse, IndividualMatch, TeamMatchResult } from '../../models/matchmaking.models';
import { AuthService } from '../../services/api/auth.service';
import { MatchmakingAuthService } from '../../services/api/matchmaking.service';
import { UserRegistration } from '../../models/auth.models';
import Swal from 'sweetalert2';

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
  showProfileModal = false;
  selectedProfile: any = null;

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

  getGenderLabel(gender: string): string {
    const labels: Record<string, string> = {
      'masculine': 'Masculino',
      'feminine': 'Feminino',
      'non-binary': 'Não-binário',
      'other': 'Outro',
      'prefer-not-to-say': 'Prefere não informar'
    };
    return labels[gender] || gender;
  }

  goToProfile(email: string): void {
    if (!email) return;

    this.matchmakingService.getProfile(email).subscribe({
      next: (profileResponse) => {
        if (profileResponse?.profile) {
          this.selectedProfile = profileResponse.profile;
          this.showProfileModal = true;
        } else {
          Swal.fire({
            title: 'Perfil não encontrado',
            text: 'Não foi possível carregar o perfil deste usuário.',
            icon: 'warning',
            confirmButtonText: 'Ok'
          });
        }
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        Swal.fire({
          title: 'Erro!',
          text: 'Erro ao carregar perfil. Tente novamente.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
    this.selectedProfile = null;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  sendMessage(email: string): void {
    if (!this.currentUser?.email) return;
    const sender = this.currentUser.email;
    this.matchmakingService.sendMatchNotification(sender, email).subscribe({
      next: () => {
        Swal.fire({
          title: 'Sucesso!',
          text: 'Mensagem enviada com sucesso!',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      },
      error: (err) => {
        console.error('Error sending message to:', email, err);
        Swal.fire({
          title: 'Erro!',
          text: 'Erro ao enviar mensagem. Tente novamente.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  viewTeamDetails(teamId: string): void {
    // Implementar visualização de detalhes do time
    Swal.fire({
      title: 'Detalhes do Time',
      text: `Funcionalidade em desenvolvimento para o time: ${teamId}`,
      icon: 'info',
      confirmButtonText: 'Ok'
    });
  }

  trackByEmail(index: number, match: IndividualMatch): string {
    return match.participant.email;
  }

  trackByTeamId(index: number, team: TeamMatchResult): string {
    return team.teamId;
  }
}
