import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/api/auth.service';
import { MatchmakingService } from '../../services/api/matchmaking.service';
import { ParticipantProfile, WorkExperience, Project, Availability, Preferences } from '../../models/matchmaking.models';
import { UserRegistration } from '../../models/auth.models';

@Component({
  selector: 'app-profile-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="profile-create">
      <!-- Header -->
      <header class="profile-header">
        <div class="container">
          <div class="header-content">
            <button class="btn-back" (click)="goBack()">
              <i class="fas fa-arrow-left"></i>
              Voltar ao Dashboard
            </button>
            <div class="header-info">
              <h1>{{ isEditing ? 'Editar Perfil' : 'Criar Perfil de Matchmaking' }}</h1>
              <p>Complete seu perfil para encontrar parceiros ideais para o NASA Space Apps</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="profile-main">
        <div class="container">
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
            
            <!-- Progress Indicator -->
            <div class="progress-section">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="getProgress()"></div>
              </div>
              <span class="progress-text">{{ getProgress() }}% Completo</span>
            </div>

            <!-- Section 1: Basic Information -->
            <div class="form-section">
              <h2 class="section-title">
                <i class="fas fa-user"></i>
                Informações Básicas
              </h2>
              
              <div class="form-grid">
                <div class="form-group">
                  <label for="fullName">Nome Completo *</label>
                  <input 
                    type="text" 
                    id="fullName"
                    formControlName="fullName"
                    placeholder="Seu nome completo"
                    [class.error]="profileForm.get('fullName')?.invalid && profileForm.get('fullName')?.touched">
                  <div class="error-message" *ngIf="profileForm.get('fullName')?.invalid && profileForm.get('fullName')?.touched">
                    Nome completo é obrigatório
                  </div>
                </div>

                <div class="form-group">
                  <label for="education">Formação Acadêmica *</label>
                  <input 
                    type="text" 
                    id="education"
                    formControlName="education"
                    placeholder="Ex: Engenharia de Software, Universidade Federal"
                    [class.error]="profileForm.get('education')?.invalid && profileForm.get('education')?.touched">
                  <div class="error-message" *ngIf="profileForm.get('education')?.invalid && profileForm.get('education')?.touched">
                    Formação é obrigatória
                  </div>
                </div>

                <div class="form-group">
                  <label for="expertiseLevel">Nível de Experiência *</label>
                  <select 
                    id="expertiseLevel"
                    formControlName="expertiseLevel"
                    [class.error]="profileForm.get('expertiseLevel')?.invalid && profileForm.get('expertiseLevel')?.touched">
                    <option value="">Selecione seu nível</option>
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="advanced">Avançado</option>
                    <option value="expert">Especialista</option>
                  </select>
                  <div class="error-message" *ngIf="profileForm.get('expertiseLevel')?.invalid && profileForm.get('expertiseLevel')?.touched">
                    Selecione seu nível de experiência
                  </div>
                </div>
              </div>

              <div class="form-group full-width">
                <label for="bio">Biografia</label>
                <textarea 
                  id="bio"
                  formControlName="bio"
                  rows="4"
                  placeholder="Conte um pouco sobre você, suas paixões e objetivos..."></textarea>
              </div>
            </div>

            <!-- Section 2: Skills & Languages -->
            <div class="form-section">
              <h2 class="section-title">
                <i class="fas fa-code"></i>
                Habilidades e Idiomas
              </h2>

              <div class="form-group">
                <label>Habilidades Técnicas *</label>
                <div class="skills-input">
                  <input 
                    type="text" 
                    [(ngModel)]="newSkill"
                    [ngModelOptions]="{standalone: true}"
                    (keyup.enter)="addSkill()"
                    placeholder="Digite uma habilidade e pressione Enter">
                  <button type="button" class="btn-add" (click)="addSkill()">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <div class="tags-container">
                  <span 
                    *ngFor="let skill of skills; let i = index"
                    class="tag">
                    {{ skill }}
                    <button type="button" (click)="removeSkill(i)">
                      <i class="fas fa-times"></i>
                    </button>
                  </span>
                </div>
                <div class="error-message" *ngIf="skills.length === 0 && profileForm.touched">
                  Adicione pelo menos uma habilidade
                </div>
              </div>

              <div class="form-group">
                <label>Idiomas *</label>
                <div class="skills-input">
                  <input 
                    type="text" 
                    [(ngModel)]="newLanguage"
                    [ngModelOptions]="{standalone: true}"
                    (keyup.enter)="addLanguage()"
                    placeholder="Ex: Português (Nativo), Inglês (Fluente)">
                  <button type="button" class="btn-add" (click)="addLanguage()">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <div class="tags-container">
                  <span 
                    *ngFor="let language of languages; let i = index"
                    class="tag">
                    {{ language }}
                    <button type="button" (click)="removeLanguage(i)">
                      <i class="fas fa-times"></i>
                    </button>
                  </span>
                </div>
                <div class="error-message" *ngIf="languages.length === 0 && profileForm.touched">
                  Adicione pelo menos um idioma
                </div>
              </div>
            </div>

            <!-- Section 3: Work Experience -->
            <div class="form-section">
              <h2 class="section-title">
                <i class="fas fa-briefcase"></i>
                Experiência Profissional
                <button type="button" class="btn-add-section" (click)="addWorkExperience()">
                  <i class="fas fa-plus"></i>
                  Adicionar
                </button>
              </h2>

              <div formArrayName="workExperience">
                <div 
                  *ngFor="let exp of workExperienceArray.controls; let i = index"
                  [formGroupName]="i"
                  class="experience-item">
                  
                  <div class="experience-header">
                    <h3>Experiência {{ i + 1 }}</h3>
                    <button type="button" class="btn-remove" (click)="removeWorkExperience(i)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>

                  <div class="form-grid">
                    <div class="form-group">
                      <label>Empresa *</label>
                      <input type="text" formControlName="company" placeholder="Nome da empresa">
                    </div>
                    <div class="form-group">
                      <label>Cargo *</label>
                      <input type="text" formControlName="position" placeholder="Seu cargo">
                    </div>
                    <div class="form-group">
                      <label>Setor *</label>
                      <input type="text" formControlName="sector" placeholder="Ex: Tecnologia, Educação">
                    </div>
                    <div class="form-group">
                      <label>Anos de Experiência *</label>
                      <input type="number" formControlName="yearsOfExperience" min="0" max="50">
                    </div>
                  </div>

                  <div class="form-group full-width">
                    <label>Descrição</label>
                    <textarea formControlName="description" rows="3" placeholder="Descreva suas responsabilidades e conquistas..."></textarea>
                  </div>
                </div>

                <div *ngIf="workExperienceArray.length === 0" class="empty-state">
                  <i class="fas fa-briefcase"></i>
                  <p>Nenhuma experiência adicionada ainda</p>
                  <button type="button" class="btn btn-primary" (click)="addWorkExperience()">
                    Adicionar Primeira Experiência
                  </button>
                </div>
              </div>
            </div>

            <!-- Section 4: Availability -->
            <div class="form-section">
              <h2 class="section-title">
                <i class="fas fa-calendar"></i>
                Disponibilidade
              </h2>

              <div formGroupName="availability" class="form-grid">
                <div class="form-group">
                  <label for="hoursPerWeek">Horas por Semana *</label>
                  <input 
                    type="number" 
                    id="hoursPerWeek"
                    formControlName="hoursPerWeek"
                    min="1" 
                    max="168"
                    placeholder="Ex: 20">
                  <small>Durante o período do hackathon</small>
                </div>

                <div class="form-group">
                  <label for="timezone">Fuso Horário *</label>
                  <select id="timezone" formControlName="timezone">
                    <option value="">Selecione</option>
                    <option value="America/Sao_Paulo">Brasília (UTC-3)</option>
                    <option value="America/Manaus">Manaus (UTC-4)</option>
                    <option value="America/Rio_Branco">Rio Branco (UTC-5)</option>
                  </select>
                </div>

                <div class="form-group full-width">
                  <label for="preferredWorkingHours">Horário Preferido de Trabalho *</label>
                  <input 
                    type="text" 
                    id="preferredWorkingHours"
                    formControlName="preferredWorkingHours"
                    placeholder="Ex: 9:00-17:00, ou Flexível">
                </div>
              </div>
            </div>

            <!-- Section 5: Preferences -->
            <div class="form-section">
              <h2 class="section-title">
                <i class="fas fa-heart"></i>
                Preferências de Equipe
              </h2>

              <div formGroupName="preferences" class="form-grid">
                <div class="form-group">
                  <label for="teamSize">Tamanho de Equipe Preferido *</label>
                  <select id="teamSize" formControlName="teamSize">
                    <option value="">Selecione</option>
                    <option value="small">Pequena (2-3 pessoas)</option>
                    <option value="medium">Média (4-5 pessoas)</option>
                    <option value="large">Grande (6+ pessoas)</option>
                    <option value="any">Qualquer tamanho</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="communicationStyle">Estilo de Comunicação *</label>
                  <select id="communicationStyle" formControlName="communicationStyle">
                    <option value="">Selecione</option>
                    <option value="direct">Direto</option>
                    <option value="collaborative">Colaborativo</option>
                    <option value="supportive">Apoiador</option>
                    <option value="analytical">Analítico</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="workStyle">Estilo de Trabalho *</label>
                  <select id="workStyle" formControlName="workStyle">
                    <option value="">Selecione</option>
                    <option value="leader">Líder</option>
                    <option value="contributor">Contribuidor</option>
                    <option value="specialist">Especialista</option>
                    <option value="facilitator">Facilitador</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Section 6: Links -->
            <div class="form-section">
              <h2 class="section-title">
                <i class="fas fa-link"></i>
                Links Profissionais (Opcional)
              </h2>

              <div class="form-grid">
                <div class="form-group">
                  <label for="githubProfile">GitHub</label>
                  <input 
                    type="url" 
                    id="githubProfile"
                    formControlName="githubProfile"
                    placeholder="https://github.com/seuperfil">
                </div>

                <div class="form-group">
                  <label for="linkedinProfile">LinkedIn</label>
                  <input 
                    type="url" 
                    id="linkedinProfile"
                    formControlName="linkedinProfile"
                    placeholder="https://linkedin.com/in/seuperfil">
                </div>

                <div class="form-group">
                  <label for="portfolioUrl">Portfólio</label>
                  <input 
                    type="url" 
                    id="portfolioUrl"
                    formControlName="portfolioUrl"
                    placeholder="https://seuportfolio.com">
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="goBack()">
                Cancelar
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="isLoading || !isFormValid()">
                <i *ngIf="isLoading" class="fas fa-spinner fa-spin"></i>
                {{ isLoading ? 'Salvando...' : (isEditing ? 'Atualizar Perfil' : 'Criar Perfil') }}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .profile-create {
      min-height: 100vh;
      background: #0b0d17;
      color: #ffffff;
    }

    /* Header */
    .profile-header {
      background: linear-gradient(135deg, #1a1d35 0%, #2c3555 50%, #0f3460 100%);
      border-bottom: 2px solid #ff4444;
      padding: 2rem 0;
      position: relative;
    }

    .profile-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stars" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="0.5" fill="%23ffffff" opacity="0.3"/><circle cx="7" cy="7" r="0.3" fill="%23ffffff" opacity="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23stars)"/></svg>') repeat;
      opacity: 0.1;
      pointer-events: none;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .btn-back {
      background: transparent;
      border: 2px solid #ff4444;
      color: #ff4444;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
    }

    .btn-back:hover {
      background: #ff4444;
      color: white;
      transform: translateY(-2px);
    }

    .header-info h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .header-info p {
      margin: 0;
      color: #b8c5d6;
      font-size: 1.1rem;
    }

    /* Main Content */
    .profile-main {
      padding: 3rem 0;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    /* Progress */
    .progress-section {
      background: linear-gradient(135deg, #1a1d35 0%, #2c3555 100%);
      border: 1px solid #3a4370;
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .progress-bar {
      flex: 1;
      height: 8px;
      background: rgba(58, 67, 112, 0.5);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff4444 0%, #ff6b6b 100%);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-text {
      color: #ff4444;
      font-weight: 600;
      font-size: 1.1rem;
    }

    /* Form Sections */
    .form-section {
      background: linear-gradient(135deg, #1a1d35 0%, #2c3555 100%);
      border: 1px solid #3a4370;
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .section-title i {
      color: #ff4444;
      font-size: 1.2rem;
    }

    .btn-add-section {
      background: #ff4444;
      border: none;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .btn-add-section:hover {
      background: #e63939;
      transform: translateY(-1px);
    }

    /* Form Grid */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    /* Form Elements */
    label {
      color: #e8ecf0;
      font-weight: 500;
      font-size: 1rem;
    }

    input, select, textarea {
      background: rgba(26, 29, 53, 0.5);
      border: 1px solid #3a4370;
      border-radius: 12px;
      padding: 0.875rem 1rem;
      color: #ffffff;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #ff4444;
      box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.1);
    }

    input::placeholder, textarea::placeholder {
      color: #8892b0;
    }

    input.error, select.error, textarea.error {
      border-color: #ff6b6b;
      background: rgba(255, 107, 107, 0.1);
    }

    small {
      color: #8892b0;
      font-size: 0.85rem;
    }

    /* Skills Input */
    .skills-input {
      display: flex;
      gap: 0.5rem;
    }

    .skills-input input {
      flex: 1;
    }

    .btn-add {
      background: #ff4444;
      border: none;
      color: white;
      padding: 0.875rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-add:hover {
      background: #e63939;
    }

    /* Tags */
    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .tag {
      background: rgba(255, 68, 68, 0.2);
      border: 1px solid #ff4444;
      color: #ff6b6b;
      padding: 0.5rem 0.75rem;
      border-radius: 20px;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .tag button {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      padding: 0;
      font-size: 0.8rem;
      opacity: 0.7;
    }

    .tag button:hover {
      opacity: 1;
    }

    /* Experience Items */
    .experience-item {
      background: rgba(58, 67, 112, 0.2);
      border: 1px solid #3a4370;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }

    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .experience-header h3 {
      color: #ff4444;
      font-size: 1.1rem;
      margin: 0;
    }

    .btn-remove {
      background: rgba(255, 107, 107, 0.2);
      border: 1px solid #ff6b6b;
      color: #ff6b6b;
      padding: 0.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-remove:hover {
      background: #ff6b6b;
      color: white;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: #8892b0;
    }

    .empty-state i {
      font-size: 3rem;
      color: #3a4370;
      margin-bottom: 1rem;
    }

    .empty-state p {
      margin: 0 0 1.5rem 0;
      font-size: 1.1rem;
    }

    /* Buttons */
    .btn {
      padding: 0.875rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
    }

    .btn-primary {
      background: #ff4444;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #e63939;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 68, 68, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-secondary {
      background: transparent;
      color: #8892b0;
      border: 1px solid #3a4370;
    }

    .btn-secondary:hover {
      border-color: #8892b0;
      color: #ffffff;
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 2rem;
      margin-top: 2rem;
      border-top: 1px solid #3a4370;
    }

    /* Error Messages */
    .error-message {
      color: #ff6b6b;
      font-size: 0.9rem;
      margin-top: 0.25rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .header-info h1 {
        font-size: 2rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .container {
        padding: 0 1rem;
      }
    }
  `]
})
export class ProfileCreateComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: UserRegistration | null = null;
  isLoading = false;
  isEditing = false;
  
  // Arrays for dynamic fields
  skills: string[] = [];
  languages: string[] = [];
  newSkill = '';
  newLanguage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private matchmakingService: MatchmakingService,
    private router: Router
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/']);
      return;
    }

    this.loadExistingProfile();
  }

  createForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required]],
      education: ['', [Validators.required]],
      expertiseLevel: ['', [Validators.required]],
      bio: [''],
      workExperience: this.fb.array([]),
      availability: this.fb.group({
        hoursPerWeek: ['', [Validators.required, Validators.min(1)]],
        timezone: ['', [Validators.required]],
        preferredWorkingHours: ['', [Validators.required]]
      }),
      preferences: this.fb.group({
        teamSize: ['', [Validators.required]],
        communicationStyle: ['', [Validators.required]],
        workStyle: ['', [Validators.required]]
      }),
      githubProfile: [''],
      linkedinProfile: [''],
      portfolioUrl: ['']
    });
  }

  get workExperienceArray(): FormArray {
    return this.profileForm.get('workExperience') as FormArray;
  }

  loadExistingProfile(): void {
    if (!this.currentUser) return;

    this.matchmakingService.getProfile(this.currentUser.email).subscribe({
      next: (profile) => {
        if (profile) {
          this.isEditing = true;
          this.populateForm(profile);
        }
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
  }

  populateForm(profile: ParticipantProfile): void {
    this.profileForm.patchValue({
      fullName: profile.fullName,
      education: profile.education,
      expertiseLevel: profile.expertiseLevel,
      bio: profile.bio,
      availability: profile.availability,
      preferences: profile.preferences,
      githubProfile: profile.githubProfile,
      linkedinProfile: profile.linkedinProfile,
      portfolioUrl: profile.portfolioUrl
    });

    this.skills = [...profile.skills];
    this.languages = [...profile.languages];

    // Populate work experience
    this.workExperienceArray.clear();
    profile.workExperience.forEach(exp => {
      this.workExperienceArray.push(this.createWorkExperienceGroup(exp));
    });
  }

  createWorkExperienceGroup(exp?: WorkExperience): FormGroup {
    return this.fb.group({
      company: [exp?.company || '', [Validators.required]],
      position: [exp?.position || '', [Validators.required]],
      sector: [exp?.sector || '', [Validators.required]],
      yearsOfExperience: [exp?.yearsOfExperience || 0, [Validators.required, Validators.min(0)]],
      technologies: [exp?.technologies || []],
      description: [exp?.description || '']
    });
  }

  addWorkExperience(): void {
    this.workExperienceArray.push(this.createWorkExperienceGroup());
  }

  removeWorkExperience(index: number): void {
    this.workExperienceArray.removeAt(index);
  }

  addSkill(): void {
    if (this.newSkill.trim() && !this.skills.includes(this.newSkill.trim())) {
      this.skills.push(this.newSkill.trim());
      this.newSkill = '';
    }
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
  }

  addLanguage(): void {
    if (this.newLanguage.trim() && !this.languages.includes(this.newLanguage.trim())) {
      this.languages.push(this.newLanguage.trim());
      this.newLanguage = '';
    }
  }

  removeLanguage(index: number): void {
    this.languages.splice(index, 1);
  }

  getProgress(): number {
    const fields = [
      this.profileForm.get('fullName')?.value,
      this.profileForm.get('education')?.value,
      this.profileForm.get('expertiseLevel')?.value,
      this.skills.length > 0,
      this.languages.length > 0,
      this.profileForm.get('availability.hoursPerWeek')?.value,
      this.profileForm.get('availability.timezone')?.value,
      this.profileForm.get('availability.preferredWorkingHours')?.value,
      this.profileForm.get('preferences.teamSize')?.value,
      this.profileForm.get('preferences.communicationStyle')?.value,
      this.profileForm.get('preferences.workStyle')?.value
    ];

    const completed = fields.filter(field => !!field).length;
    return Math.round((completed / fields.length) * 100);
  }

  isFormValid(): boolean {
    return this.profileForm.valid && 
           this.skills.length > 0 && 
           this.languages.length > 0;
  }

  onSubmit(): void {
    if (!this.isFormValid() || !this.currentUser) return;

    this.isLoading = true;

    const profileData: ParticipantProfile = {
      email: this.currentUser.email,
      fullName: this.profileForm.get('fullName')?.value,
      skills: this.skills,
      expertiseLevel: this.profileForm.get('expertiseLevel')?.value,
      workExperience: this.workExperienceArray.value,
      education: this.profileForm.get('education')?.value,
      projects: [], // Can be added in future version
      availability: this.profileForm.get('availability')?.value,
      preferences: {
        ...this.profileForm.get('preferences')?.value,
        projectType: [], // Can be added in future version
        interests: [] // Can be added in future version
      },
      languages: this.languages,
      githubProfile: this.profileForm.get('githubProfile')?.value,
      linkedinProfile: this.profileForm.get('linkedinProfile')?.value,
      portfolioUrl: this.profileForm.get('portfolioUrl')?.value,
      bio: this.profileForm.get('bio')?.value,
      participationGoals: [], // Can be added in future version
      challengesInterests: [] // Can be added in future version
    };

    const request = this.isEditing ? 
      this.matchmakingService.updateProfile(this.currentUser.email, profileData) :
      this.matchmakingService.createProfile(profileData);

    request.subscribe({
      next: (response) => {
        this.isLoading = false;
        alert(`Perfil ${this.isEditing ? 'atualizado' : 'criado'} com sucesso!`);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error saving profile:', error);
        alert(`Erro ao ${this.isEditing ? 'atualizar' : 'criar'} perfil. Tente novamente.`);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}