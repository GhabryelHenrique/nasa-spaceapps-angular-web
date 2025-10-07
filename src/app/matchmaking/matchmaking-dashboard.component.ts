import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatchmakingService, MatchmakingUser } from '../shared/services/matchmaking.service';
import { TeamPreferencesModalComponent } from '../shared/components/team-preferences-modal/team-preferences-modal.component';

@Component({
  selector: 'app-matchmaking-dashboard',
  imports: [CommonModule, TeamPreferencesModalComponent],
  templateUrl: './matchmaking-dashboard.component.html',
  styleUrl: './matchmaking-dashboard.component.scss'
})
export class MatchmakingDashboardComponent implements OnInit, OnDestroy {
  currentUser: MatchmakingUser | null = null;
  matchingUsers: MatchmakingUser[] = [];
  isLoading = false;
  errorMessage = '';
  showPreferencesModal = false;
  private subscription = new Subscription();

  constructor(
    private matchmakingService: MatchmakingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.matchmakingService.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (user && !user.lookingForTeam) {
          this.checkUserPreferences();
        } else if (user && user.lookingForTeam) {
          this.loadMatchingUsers();
        }
      })
    );

    this.subscription.add(
      this.matchmakingService.isAuthenticated$.subscribe(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/']);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private checkUserPreferences(): void {
    if (this.currentUser && (!this.currentUser.area || !this.currentUser.skills)) {
      this.showPreferencesModal = true;
    }
  }

  toggleLookingForTeam(): void {
    if (!this.currentUser) return;

    if (!this.currentUser.lookingForTeam && (!this.currentUser.area || !this.currentUser.skills)) {
      this.showPreferencesModal = true;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.matchmakingService.toggleLookingForTeam().subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.currentUser = updatedUser;
        if (updatedUser.lookingForTeam) {
          this.loadMatchingUsers();
        } else {
          this.matchingUsers = [];
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao atualizar status. Tente novamente.';
        console.error('Toggle looking for team error:', error);
      }
    });
  }

  private loadMatchingUsers(): void {
    if (!this.currentUser?.lookingForTeam) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.matchmakingService.getMatchingUsers().subscribe({
      next: (users) => {
        this.isLoading = false;
        this.matchingUsers = users.filter(user => user.id !== this.currentUser?.id);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao carregar usuários. Tente novamente.';
        console.error('Get matching users error:', error);
      }
    });
  }

  onPreferencesSet(): void {
    this.showPreferencesModal = false;
    if (this.currentUser) {
      this.loadMatchingUsers();
    }
  }

  getAreaDisplayName(areaId: string): string {
    const areaMap: { [key: string]: string } = {
      'development': 'Desenvolvimento',
      'design': 'Design & UX/UI',
      'data-science': 'Ciência de Dados',
      'engineering': 'Engenharia',
      'business': 'Negócios & Gestão',
      'research': 'Pesquisa & Ciência',
      'communication': 'Comunicação',
      'other': 'Outras Áreas'
    };
    return areaMap[areaId] || areaId;
  }

  getAreaIcon(areaId: string): string {
    const iconMap: { [key: string]: string } = {
      'development': 'fa-solid fa-code',
      'design': 'fa-solid fa-palette',
      'data-science': 'fa-solid fa-chart-line',
      'engineering': 'fa-solid fa-cogs',
      'business': 'fa-solid fa-briefcase',
      'research': 'fa-solid fa-flask',
      'communication': 'fa-solid fa-bullhorn',
      'other': 'fa-solid fa-plus'
    };
    return iconMap[areaId] || 'fa-solid fa-user';
  }

  contactUser(user: MatchmakingUser): void {
    if (user.email) {
      window.open(`mailto:${user.email}?subject=NASA Space Apps - Vamos formar um time!&body=Olá! Vi seu perfil no sistema de matchmaking do NASA Space Apps e gostaria de conversar sobre formarmos um time. Você tem interesse?`, '_blank');
    }
  }

  refreshMatches(): void {
    this.loadMatchingUsers();
  }

  logout(): void {
    this.matchmakingService.logout();
    this.router.navigate(['/']);
  }
}