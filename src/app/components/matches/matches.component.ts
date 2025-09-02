import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatchmakingService } from '../../services/api/matchmaking.service';
import { AuthService } from '../../services/api/auth.service';
import { TeamMatch } from '../../models/matchmaking.models';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>🤝 Seus Matches</h2>

      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <button class="btn btn-primary" (click)="findMatches()" [disabled]="loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                🔍 Encontrar Novos Matches
              </button>
            </div>
            <div class="col-md-4">
              <select class="form-control" [(ngModel)]="statusFilter" (change)="filterMatches()">
                <option value="">Todos os Status</option>
                <option value="suggested">Sugeridos</option>
                <option value="accepted">Aceitos</option>
                <option value="rejected">Rejeitados</option>
              </select>
            </div>
            <div class="col-md-4">
              <input type="range" class="form-range" min="0.5" max="1" step="0.1" 
                     [(ngModel)]="minScoreFilter" (change)="filterMatches()">
              <label>Score mínimo: {{ minScoreFilter }}</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Matches -->
      <div class="row">
        <div *ngFor="let match of filteredMatches" class="col-md-6 mb-4">
          <div class="card" [class.border-success]="match.metadata.isHighQuality">
            <div class="card-header d-flex justify-content-between">
              <h6>🎯 Match Score: {{ (match.matchScore.overall * 100) | number:'1.0-0' }}%</h6>
              <span class="badge" [class]="getStatusBadgeClass(match.status)">
                {{ getStatusLabel(match.status) }}
              </span>
            </div>
            <div class="card-body">
              <!-- Participantes -->
              <h6>👥 Equipe ({{ match.metadata.teamSize }} pessoas):</h6>
              <ul class="list-unstyled mb-3">
                <li *ngFor="let email of match.participantEmails" class="mb-1">
                  <span class="badge bg-info me-2">{{ getRecommendedRole(match, email) }}</span>
                  {{ email }}
                </li>
              </ul>

              <!-- Scores Detalhados -->
              <div class="mb-3">
                <h6>📊 Compatibilidade Detalhada:</h6>
                <div class="progress mb-2" style="height: 15px;">
                  <div class="progress-bar bg-primary" role="progressbar" 
                       [style.width.%]="match.matchScore.skillsCompatibility * 100">
                    <small>Skills: {{ (match.matchScore.skillsCompatibility * 100) | number:'1.0-0' }}%</small>
                  </div>
                </div>
                <div class="progress mb-2" style="height: 15px;">
                  <div class="progress-bar bg-success" role="progressbar" 
                       [style.width.%]="match.matchScore.experienceBalance * 100">
                    <small>Exp: {{ (match.matchScore.experienceBalance * 100) | number:'1.0-0' }}%</small>
                  </div>
                </div>
                <div class="progress mb-2" style="height: 15px;">
                  <div class="progress-bar bg-warning" role="progressbar" 
                       [style.width.%]="match.matchScore.availabilityMatch * 100">
                    <small>Disp: {{ (match.matchScore.availabilityMatch * 100) | number:'1.0-0' }}%</small>
                  </div>
                </div>
              </div>

              <!-- Pontos Fortes -->
              <div *ngIf="match.reasoning.strengths.length > 0" class="mb-3">
                <h6>✅ Pontos Fortes:</h6>
                <ul class="list-unstyled">
                  <li *ngFor="let strength of match.reasoning.strengths" class="text-success">
                    • {{ strength }}
                  </li>
                </ul>
              </div>

              <!-- Preocupações -->
              <div *ngIf="match.reasoning.concerns.length > 0" class="mb-3">
                <h6>⚠️ Pontos de Atenção:</h6>
                <ul class="list-unstyled">
                  <li *ngFor="let concern of match.reasoning.concerns" class="text-warning">
                    • {{ concern }}
                  </li>
                </ul>
              </div>

              <!-- Ações -->
              <div class="d-flex gap-2" *ngIf="match.status === 'suggested'">
                <button class="btn btn-success btn-sm" (click)="acceptMatch(match.id)">
                  ✅ Aceitar
                </button>
                <button class="btn btn-danger btn-sm" (click)="rejectMatch(match.id)">
                  ❌ Rejeitar
                </button>
                <button class="btn btn-info btn-sm" (click)="viewDetails(match.id)">
                  👁️ Detalhes
                </button>
              </div>
            </div>
            <div class="card-footer text-muted small">
              Criado em: {{ match.createdAt | date:'short' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vazio -->
      <div *ngIf="filteredMatches.length === 0 && !loading" class="text-center py-5">
        <h4>🔍 Nenhum match encontrado</h4>
        <p class="text-muted">Tente ajustar os filtros ou encontrar novos matches.</p>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease-in-out;
    }
    .card:hover {
      transform: translateY(-2px);
    }
    .border-success {
      box-shadow: 0 0 15px rgba(40, 167, 69, 0.3);
    }
    .progress {
      background-color: #e9ecef;
    }
    .progress-bar small {
      color: white;
      font-weight: 500;
    }
    .btn-primary {
      background: linear-gradient(135deg, #4ecdc4 0%, #45b7d1 100%);
      border: none;
    }
  `]
})
export class MatchesComponent implements OnInit {
  matches: TeamMatch[] = [];
  filteredMatches: TeamMatch[] = [];
  loading = false;
  currentUserEmail = '';
  statusFilter = '';
  minScoreFilter = 0.6;

  constructor(
    private matchmakingService: MatchmakingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUserEmail = currentUser.email;
      this.loadMatches();
    }
  }

  loadMatches(): void {
    this.loading = true;
    this.matchmakingService.getMatches(this.currentUserEmail).subscribe({
      next: (response) => {
        this.loading = false;
        this.matches = response.matches || [];
        this.filterMatches();
      },
      error: (error) => {
        this.loading = false;
        console.error('Erro ao carregar matches:', error);
      }
    });
  }

  findMatches(): void {
    this.loading = true;
    const request = {
      email: this.currentUserEmail,
      teamSize: 4,
      minMatchScore: 0.6
    };

    this.matchmakingService.findMatches(request).subscribe({
      next: (response) => {
        this.loading = false;
        this.matches = response.matches || [];
        this.filterMatches();
      },
      error: (error) => {
        this.loading = false;
        console.error('Erro ao encontrar matches:', error);
      }
    });
  }

  filterMatches(): void {
    this.filteredMatches = this.matches.filter(match => {
      const statusMatch = !this.statusFilter || match.status === this.statusFilter;
      const scoreMatch = match.matchScore.overall >= this.minScoreFilter;
      return statusMatch && scoreMatch;
    });
  }

  acceptMatch(matchId: string): void {
    this.matchmakingService.acceptMatch(matchId, this.currentUserEmail).subscribe({
      next: () => {
        this.loadMatches();
        alert('Match aceito com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao aceitar match:', error);
        alert('Erro ao aceitar match.');
      }
    });
  }

  rejectMatch(matchId: string): void {
    this.matchmakingService.rejectMatch(matchId, this.currentUserEmail).subscribe({
      next: () => {
        this.loadMatches();
        alert('Match rejeitado.');
      },
      error: (error) => {
        console.error('Erro ao rejeitar match:', error);
        alert('Erro ao rejeitar match.');
      }
    });
  }

  viewDetails(matchId: string): void {
    // Navegar para página de detalhes do match
    console.log('Visualizar detalhes do match:', matchId);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'suggested': return 'bg-primary';
      case 'accepted': return 'bg-success';
      case 'rejected': return 'bg-danger';
      case 'expired': return 'bg-secondary';
      default: return 'bg-light';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'suggested': return 'Sugerido';
      case 'accepted': return 'Aceito';
      case 'rejected': return 'Rejeitado';
      case 'expired': return 'Expirado';
      default: return status;
    }
  }

  getRecommendedRole(match: TeamMatch, email: string): string {
    return match.recommendedRoles?.[email] || 'Membro';
  }
}