import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { UserRegistration } from '../../models/auth.models';
import { AuthService } from '../../services/api/auth.service';
import { MatchmakingAuthService } from '../../services/api/matchmaking.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="">
          <div class="header-content">
            <div class="welcome-section">
              <h1 *ngIf="currentUser">
                Olá, {{ getFirstName(currentUser.fullName) }}! 👋
              </h1>
              <p class="subtitle">Dashboard do NASA Space Apps Matchmaking</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-outline-light" (click)="refreshData()">
                <i class="fas fa-sync"></i>
                Atualizar
              </button>
              <button class="btn btn-light" (click)="logout()">
                <i class="fas fa-sign-out-alt"></i>
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="dashboard-main">
        <div
          class=""
          style="display: flex;    flex-direction: column;
    align-items: center;     padding: 0 3rem;"
        >
          <!-- Quick Stats -->
          <!-- <section class="stats-section">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-user-check"></i>
                </div>
                <div class="stat-info">
                  <h3>Ativo</h3>
                  <p>Status da Conta</p>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-heart"></i>
                </div>
                <div class="stat-info">
                  <h3>{{ matchCount }}</h3>
                  <p>Matches</p>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-info">
                  <h3>{{ profileProgress }}%</h3>
                  <p>Perfil Completo</p>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                  <h3>{{ totalUsers }}</h3>
                  <p>Participantes</p>
                </div>
              </div>
            </div>
          </section> -->

          <!-- Main Actions -->
          <section class="actions-section">
            <h2 class="section-title">Ações Principais</h2>
            <div
              class="row g-4"
              style="    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
    "
            >
              <div class="col-md-4">
                <div class="action-card" (click)="navigateToProfile()">
                  <div class="action-icon bg-primary">
                    <i class="fas fa-user-edit"></i>
                  </div>
                  <h4>{{ hasProfile ? 'Editar Perfil' : 'Criar Perfil' }}</h4>
                  <p>
                    {{
                      hasProfile
                        ? 'Atualize suas informações'
                        : 'Configure seu perfil de matchmaking'
                    }}
                  </p>
                  <div class="action-footer">
                    <span
                      class="badge"
                      [class]="hasProfile ? 'badge-success' : 'badge-warning'"
                    >
                      {{ hasProfile ? 'Configurado' : 'Pendente' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="action-card" (click)="navigateToMatches()">
                  <div class="action-icon bg-secondary">
                    <i class="fas fa-handshake"></i>
                  </div>
                  <h4>Ver Matches</h4>
                  <p>Verificar seus matches</p>
                  <div class="action-footer">
                    <span class="badge badge-secondary">Verificar</span>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="action-card" (click)="findMatches()" [class.disabled]="isSearching || !isProfileComplete">
                  <div class="action-icon bg-secondary">
                    <i class="fas fa-search"></i>
                  </div>
                  <h4>Buscar Matches</h4>
                  <p>{{ isProfileComplete ? 'Buscar novos matches' : 'Complete seu perfil para buscar matches' }}</p>
                  <div class="action-footer">
                    <span class="badge" [class]="isProfileComplete ? 'badge-secondary' : 'badge-warning'">
                      {{ isProfileComplete ? 'Buscar' : 'Perfil Incompleto' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Progress & Tips -->
          <section class="content-section">
              <!-- Progress -->
              <div class="col-md-8" style="display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;">
                <div class="content-card">
                  <h3 class="card-title">Seu Progresso</h3>
                  <div class="progress-list">
                    <div class="progress-item" [class.completed]="true">
                      <div class="progress-marker"></div>
                      <div class="progress-content">
                        <h5>Conta Verificada</h5>
                        <p>Email confirmado com sucesso</p>
                      </div>
                    </div>

                    <div
                      class="progress-item"
                      [class.completed]="hasProfile"
                      [class.active]="!hasProfile"
                    >
                      <div class="progress-marker"></div>
                      <div class="progress-content">
                        <h5>Perfil Completo</h5>
                        <p>Configure suas habilidades</p>
                      </div>
                    </div>

                    <div
                      class="progress-item"
                      [class.completed]="matchCount > 0"
                      [class.active]="hasProfile && matchCount === 0"
                    >
                      <div class="progress-marker"></div>
                      <div class="progress-content">
                        <h5>Primeiro Match</h5>
                        <p>Encontre sua primeira sugestão</p>
                      </div>
                    </div>

                    <div class="progress-item" [class.active]="matchCount > 0">
                      <div class="progress-marker"></div>
                      <div class="progress-content">
                        <h5>Equipe Formada</h5>
                        <p>Monte sua equipe ideal</p>
                      </div>
                  </div>
                </div>
              </div>

              <!-- Tips -->
              <div class="col-md-4">
                <div class="content-card">
                  <h3 class="card-title">Dicas Rápidas</h3>
                  <div class="tips-list">
                    <div class="tip-item">
                      <i class="fas fa-lightbulb"></i>
                      <span>Complete seu perfil detalhadamente</span>
                    </div>
                    <div class="tip-item">
                      <i class="fas fa-lightbulb"></i>
                      <span>Seja específico sobre suas skills</span>
                    </div>
                    <div class="tip-item">
                      <i class="fas fa-lightbulb"></i>
                      <span>Defina horários de disponibilidade</span>
                    </div>
                    <div class="tip-item">
                      <i class="fas fa-lightbulb"></i>
                      <span>Mantenha uma postura colaborativa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .dashboard {
        min-height: 100vh;
        background: #0b0d17;
        color: #ffffff;
      }

      /* Header */
      .dashboard-header {
        background: linear-gradient(
          135deg,
          #1a1d35 0%,
          #2c3555 50%,
          #0f3460 100%
        );
        border-bottom: 2px solid #ff4444;
        color: white;
        padding: 8rem 4rem 2rem;
        margin-bottom: 2rem;
        position: relative;
      }

      .dashboard-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stars" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="0.5" fill="%23ffffff" opacity="0.3"/><circle cx="7" cy="7" r="0.3" fill="%23ffffff" opacity="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23stars)"/></svg>')
          repeat;
        opacity: 0.1;
        pointer-events: none;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;
      }

      .welcome-section h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      .subtitle {
        font-size: 1.2rem;
        opacity: 0.9;
        margin: 0;
      }

      .header-actions {
        display: flex;
        gap: 1rem;
      }

      .btn {
        border-radius: 8px;
        font-weight: 500;
        padding: 0.75rem 1.5rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn:hover {
        transform: translateY(-1px);
      }

      .btn-outline-light {
        border: 2px solid #ff4444;
        color: #ff4444;
        background: transparent;
      }

      .btn-outline-light:hover {
        background: #ff4444;
        color: white;
        border-color: #ff4444;
      }

      .btn-light {
        background: #ff4444;
        color: white;
        border: none;
      }

      .btn-light:hover {
        background: #e63939;
        color: white;
      }

      /* Main Content */
      .dashboard-main {
        padding-bottom: 3rem;
      }

      .container {
        max-width: 1200px;
      }

      /* Stats Section */
      .stats-section {
        margin-bottom: 3rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      @media (min-width: 768px) {
        .stats-grid {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      @media (max-width: 767px) {
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
      }

      @media (max-width: 480px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }
      }

      .stat-card {
        background: linear-gradient(135deg, #1a1d35 0%, #2c3555 100%);
        border: 1px solid #3a4370;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 8px 32px rgba(255, 68, 68, 0.1);
        display: flex;
        align-items: center;
        gap: 1.5rem;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(
          90deg,
          #ff4444 0%,
          #ff6b6b 50%,
          #ff4444 100%
        );
      }

      .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(255, 68, 68, 0.2);
        border-color: #ff4444;
      }

      .stat-icon {
        width: 70px;
        height: 70px;
        border-radius: 16px;
        background: linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.7rem;
        box-shadow: 0 4px 20px rgba(255, 68, 68, 0.3);
      }

      .stat-info h3 {
        font-size: 2.2rem;
        font-weight: 700;
        margin: 0;
        color: #ffffff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .stat-info p {
        margin: 0;
        color: #b8c5d6;
        font-size: 1rem;
        font-weight: 500;
      }

      /* Actions Section */
      .actions-section {
        width: 100%;
        margin-bottom: 3rem;
      }

      .section-title {
        font-size: 1.8rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 2rem;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .action-card {
        background: linear-gradient(135deg, #1a1d35 0%, #2c3555 100%);
        border: 1px solid #3a4370;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        transition: all 0.3s ease;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .action-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 16px 48px rgba(255, 68, 68, 0.15);
        border-color: #ff4444;
      }

      .action-card.disabled {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
      }

      .action-card.disabled:hover {
        transform: none;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        border-color: #3a4370;
      }

      .bg-secondary {
        background: linear-gradient(135deg, #6c757d 0%, #5a6169 100%);
      }

      .action-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }

      .action-card h4 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 0.5rem;
      }

      .action-card p {
        color: #b8c5d6;
        flex-grow: 1;
        margin-bottom: 1rem;
      }

      .action-footer {
        margin-top: auto;
      }

      /* Badges */
      .badge {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .badge-success {
        background: rgba(40, 167, 69, 0.2);
        color: #40e662;
        border: 1px solid rgba(40, 167, 69, 0.3);
      }

      .badge-warning {
        background: rgba(255, 193, 7, 0.2);
        color: #ffc107;
        border: 1px solid rgba(255, 193, 7, 0.3);
      }

      .badge-info {
        background: rgba(23, 162, 184, 0.2);
        color: #17a2b8;
        border: 1px solid rgba(23, 162, 184, 0.3);
      }

      .badge-secondary {
        background: rgba(108, 117, 125, 0.2);
        color: #adb5bd;
        border: 1px solid rgba(108, 117, 125, 0.3);
      }

      /* Content Cards */
      .content-section {
        width: 100%;
        margin-bottom: 2rem;
      }

      .content-card {
        background: linear-gradient(135deg, #1a1d35 0%, #2c3555 100%);
        border: 1px solid #3a4370;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        height: 100%;
      }

      .card-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 1.5rem;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      /* Progress List */
      .progress-list {
        position: relative;
      }

      .progress-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1.5rem;
        opacity: 0.5;
        position: relative;
      }

      .progress-item.completed {
        opacity: 1;
      }

      .progress-item.active {
        opacity: 1;
      }

      .progress-item:not(:last-child)::after {
        content: '';
        position: absolute;
        left: 11px;
        top: 30px;
        width: 2px;
        height: calc(100% + 0.5rem);
        background: #e9ecef;
      }

      .progress-item.completed:not(:last-child)::after {
        background: #40e662;
      }

      .progress-marker {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #3a4370;
        flex-shrink: 0;
        position: relative;
      }

      .progress-item.completed .progress-marker {
        background: #40e662;
        box-shadow: 0 0 10px rgba(64, 230, 98, 0.5);
      }

      .progress-item.active .progress-marker {
        background: #ff4444;
        box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
      }

      .progress-content h5 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 0.25rem;
      }

      .progress-content p {
        color: #b8c5d6;
        font-size: 0.9rem;
        margin: 0;
      }

      /* Tips List */
      .tips-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .tip-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1rem;
        background: rgba(58, 67, 112, 0.3);
        border: 1px solid #3a4370;
        border-radius: 12px;
        transition: all 0.3s ease;
      }

      .tip-item:hover {
        background: rgba(58, 67, 112, 0.5);
        border-color: #ff4444;
      }

      .tip-item i {
        color: #ffc107;
        margin-top: 2px;
        flex-shrink: 0;
      }

      .tip-item span {
        font-size: 0.9rem;
        line-height: 1.4;
        color: #e8ecf0;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .header-content {
          flex-direction: column;
          text-align: center;
        }

        .welcome-section h1 {
          font-size: 2rem;
        width: 100%;

        }

        .stat-card {
          padding: 1.5rem;
        }

        .action-card {
          padding: 1.5rem;
        }

        .content-card {
          padding: 1.5rem;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  currentUser: UserRegistration | null = null;
  hasProfile = false;
  isProfileComplete = false;
  matchCount = 0;
  profileProgress = 0;
  totalUsers = 0;
  isSearching = false;

  constructor(
    private authService: AuthService,
    private matchmakingService: MatchmakingAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  getFirstName(fullName: string): string {
    return fullName.split(' ')[0];
  }

  async loadDashboardData(): Promise<void> {
    if (!this.currentUser) return;

    try {
      // Check if user has profile
      this.matchmakingService.getProfile(this.currentUser.email).subscribe({
        next: (profile) => {
          this.hasProfile = !!profile;
          this.isProfileComplete = this.checkProfileComplete(profile?.profile);
          this.calculateProfileProgress(profile?.profile);
        },
        error: () => {
          this.hasProfile = false;
          this.isProfileComplete = false;
          this.profileProgress = 0;
        },
      });

      // Get user matches
      this.matchmakingService.getMatches(this.currentUser.email).subscribe({
        next: (response) => {
          this.matchCount = response.matches?.length || 0;
        },
        error: () => {
          this.matchCount = 0;
        },
      });

      // Get total users
      this.matchmakingService.getAllProfiles().subscribe({
        next: (response) => {
          this.totalUsers = response.profiles?.length || 0;
        },
        error: () => {
          this.totalUsers = 0;
        },
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  checkProfileComplete(profile: any): boolean {
    if (!profile) return false;

    // All required fields according to the schema
    const requiredFields = [
      profile.fullName && profile.fullName.trim().length >= 2,
      profile.phoneNumber && profile.phoneNumber.trim(),
      profile.education && profile.education.trim(),
      profile.expertiseLevel && profile.expertiseLevel.trim(),
      profile.age && profile.age >= 16 && profile.age <= 100,
      profile.skills && profile.skills.length > 0,
      profile.preferences && profile.preferences.teamSize && profile.preferences.teamSize.trim(),
      profile.preferences && profile.preferences.communicationStyle && profile.preferences.communicationStyle.trim(),
      profile.preferences && profile.preferences.workStyle && profile.preferences.workStyle.trim()
    ];

    return requiredFields.every(field => !!field);
  }

  calculateProfileProgress(profile: any): void {
    if (!profile) {
      this.profileProgress = 0;
      return;
    }

    let completed = 0;
    const fields = [
      profile.fullName,
      profile.phoneNumber, // Telefone obrigatório
      profile.skills?.length > 0,
      profile.expertiseLevel,
      profile.education,
      profile.workExperience?.length > 0,
      profile.availability,
      profile.preferences,
      profile.languages?.length > 0,
      profile.bio,
      profile.challengesOfInterest?.length > 0,
      profile.interestAreas?.length > 0,
      profile.githubProfile,
      profile.linkedinProfile,
      profile.portfolioUrl
    ];

    completed = fields.filter((field) => !!field).length;
    this.profileProgress = Math.round((completed / fields.length) * 100);
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile/create']);
  }

  navigateToMatches(): void {
    this.router.navigate(['/matches']);
  }

  findMatches(): void {
    if (!this.currentUser) {
      Swal.fire({
        icon: 'error',
        title: 'Usuário não encontrado!',
        text: 'Por favor, faça login novamente.',
        confirmButtonColor: '#ff4444'
      });
      return;
    }

    if (!this.isProfileComplete) {
      Swal.fire({
        icon: 'warning',
        title: 'Perfil Incompleto',
        html: `
          <div style="text-align: left;">
            <p><strong>Para buscar matches, você precisa:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Nome completo</li>
              <li>Telefone (obrigatório para contato)</li>
              <li>Educação</li>
              <li>Nível de experiência</li>
              <li>Idade</li>
              <li>Pelo menos uma habilidade</li>
              <li>Preferências de equipe</li>
            </ul>
          </div>
        `,
        confirmButtonColor: '#ff4444',
        confirmButtonText: 'Completar Perfil',
        showCancelButton: true,
        cancelButtonText: 'Voltar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/profile/create']);
        }
      });
      return;
    }

    this.isSearching = true;

    const request = {
      email: this.currentUser.email,
      teamSize: 4,
      minMatchScore: 0.6,
    };

    this.matchmakingService.findMatches(request).subscribe({
      next: (response) => {
        this.isSearching = false;
        const newMatches = response.matches?.length || 0;

        if (newMatches > 0) {
          this.matchCount = newMatches;
          Swal.fire({
            icon: 'success',
            title: 'Matches Encontrados!',
            text: `🎉 Encontramos ${newMatches} novos matches para você!`,
            confirmButtonColor: '#4ecdc4',
            confirmButtonText: 'Ver Matches'
          }).then(() => {
            this.router.navigate(['/matches']);
          });
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Nenhum Match Novo',
            text: 'Nenhum novo match encontrado no momento. Tente novamente mais tarde.',
            confirmButtonColor: '#45b7d1'
          });
        }
      },
      error: () => {
        this.isSearching = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro na Busca',
          text: 'Erro ao buscar matches. Tente novamente.',
          confirmButtonColor: '#ff4444'
        });
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
