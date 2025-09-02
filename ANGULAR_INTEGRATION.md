# 🚀 Integração Angular - NASA Space Apps Matchmaking API

Esta documentação detalha como integrar um frontend Angular com a API de matchmaking do NASA Space Apps Challenge Uberlândia.

## 📋 Sumário

- [Configuração Inicial](#configuração-inicial)
- [Serviços Angular](#serviços-angular)
- [Modelos de Dados (Interfaces)](#modelos-de-dados-interfaces)
- [Fluxo de Autenticação](#fluxo-de-autenticação)
- [Sistema de Matchmaking](#sistema-de-matchmaking)
- [Componentes de Exemplo](#componentes-de-exemplo)
- [Interceptors](#interceptors)
- [Guards](#guards)
- [Tratamento de Erros](#tratamento-de-erros)

---

## 🔧 Configuração Inicial

### 1. Instalação de Dependências

```bash
# Instalar Angular CLI (se necessário)
npm install -g @angular/cli

# Criar projeto Angular
ng new nasa-spaceapps-frontend
cd nasa-spaceapps-frontend

# Instalar dependências necessárias
npm install @angular/forms
npm install @angular/common/http
npm install rxjs
npm install bootstrap # Opcional para UI
```

### 2. Configuração do Ambiente

**`src/environments/environment.ts`**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000', // URL da API
  apiVersion: 'v1'
};
```

**`src/environments/environment.prod.ts`**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com',
  apiVersion: 'v1'
};
```

### 3. Configuração do HttpClient

**`src/app/app.module.ts`**
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

---

## 📦 Modelos de Dados (Interfaces)

**`src/app/models/auth.models.ts`**
```typescript
export interface CheckEmailRequest {
  email: string;
}

export interface CheckEmailResponse {
  email: string;
  isRegistered: boolean;
  message: string;
  emailSent?: boolean;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  email: string;
  authenticated: boolean;
  message: string;
  registrationInfo?: UserRegistration;
}

export interface UserRegistration {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  city?: string;
  educationLevel?: string;
  participationMode?: 'Presencial' | 'Remoto';
}
```

**`src/app/models/matchmaking.models.ts`**
```typescript
export interface WorkExperience {
  company: string;
  position: string;
  sector: string;
  yearsOfExperience: number;
  technologies: string[];
  description?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  role: string;
  duration?: string;
  url?: string;
}

export interface Availability {
  hoursPerWeek: number;
  timezone: string;
  preferredWorkingHours: string;
  availableDates: string[];
}

export interface Preferences {
  teamSize: 'small' | 'medium' | 'large' | 'any';
  projectType: string[];
  communicationStyle: 'direct' | 'collaborative' | 'supportive' | 'analytical';
  workStyle: 'leader' | 'contributor' | 'specialist' | 'facilitator';
  interests: string[];
}

export interface ParticipantProfile {
  email: string;
  fullName: string;
  skills: string[];
  expertiseLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  workExperience: WorkExperience[];
  education: string;
  projects: Project[];
  availability: Availability;
  preferences: Preferences;
  languages: string[];
  githubProfile?: string;
  linkedinProfile?: string;
  portfolioUrl?: string;
  bio?: string;
  participationGoals?: string[];
  challengesInterests?: string[];
}

export interface MatchScore {
  overall: number;
  skillsCompatibility: number;
  experienceBalance: number;
  availabilityMatch: number;
  preferencesAlignment: number;
  communicationFit: number;
}

export interface TeamMatch {
  id: string;
  participantEmails: string[];
  matchScore: MatchScore;
  reasoning: {
    strengths: string[];
    concerns: string[];
    suggestions: string[];
  };
  challengeCategory?: string;
  recommendedRoles?: Record<string, string>;
  createdAt: string;
  status: 'suggested' | 'accepted' | 'rejected' | 'expired';
  metadata: {
    teamSize: number;
    isHighQuality: boolean;
    isViable: boolean;
  };
}

export interface FindMatchesRequest {
  email: string;
  teamSize?: number;
  challengeCategories?: string[];
  minMatchScore?: number;
}
```

---

## 🔐 Serviços Angular

### 1. Serviço de Autenticação

**`src/app/services/auth.service.ts`**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { 
  CheckEmailRequest, 
  CheckEmailResponse, 
  VerifyCodeRequest, 
  VerifyCodeResponse,
  UserRegistration 
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<UserRegistration | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar se existe usuário no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  /**
   * Verifica se o email está registrado e envia código
   */
  checkEmail(email: string): Observable<CheckEmailResponse> {
    const request: CheckEmailRequest = { email };
    return this.http.get<CheckEmailResponse>(`${this.apiUrl}/registration/check-email`, {
      params: { email }
    });
  }

  /**
   * Verifica o código de 6 dígitos
   */
  verifyCode(email: string, code: string): Observable<VerifyCodeResponse> {
    const request: VerifyCodeRequest = { email, code };
    return this.http.post<VerifyCodeResponse>(`${this.apiUrl}/registration/verify-code`, request)
      .pipe(
        tap(response => {
          if (response.authenticated && response.registrationInfo) {
            this.setCurrentUser(response.registrationInfo);
          }
        })
      );
  }

  /**
   * Obtém informações do usuário
   */
  getUserInfo(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/registration/info`, {
      params: { email }
    });
  }

  /**
   * Verifica se o usuário está logado
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Obtém o usuário atual
   */
  getCurrentUser(): UserRegistration | null {
    return this.currentUserSubject.value;
  }

  /**
   * Define o usuário atual
   */
  private setCurrentUser(user: UserRegistration): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
```

### 2. Serviço de Matchmaking

**`src/app/services/matchmaking.service.ts`**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  ParticipantProfile, 
  TeamMatch, 
  FindMatchesRequest 
} from '../models/matchmaking.models';

@Injectable({
  providedIn: 'root'
})
export class MatchmakingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Profile Management
  createProfile(profile: ParticipantProfile): Observable<any> {
    return this.http.post(`${this.apiUrl}/matchmaking/profile`, profile);
  }

  getProfile(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/matchmaking/profile/${encodeURIComponent(email)}`);
  }

  updateProfile(email: string, profile: Partial<ParticipantProfile>): Observable<any> {
    return this.http.put(`${this.apiUrl}/matchmaking/profile/${encodeURIComponent(email)}`, profile);
  }

  deleteProfile(email: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/matchmaking/profile/${encodeURIComponent(email)}`);
  }

  getAllProfiles(skills?: string[]): Observable<any> {
    const params = skills ? { skills: skills.join(',') } : {};
    return this.http.get(`${this.apiUrl}/matchmaking/profiles`, { params });
  }

  // Matchmaking
  findMatches(request: FindMatchesRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/matchmaking/find-matches`, request);
  }

  getMatches(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/matchmaking/matches/${encodeURIComponent(email)}`);
  }

  acceptMatch(matchId: string, participantEmail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/matchmaking/matches/${matchId}/accept`, {
      participantEmail
    });
  }

  rejectMatch(matchId: string, participantEmail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/matchmaking/matches/${matchId}/reject`, {
      participantEmail
    });
  }

  getMatchById(matchId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/matchmaking/match/${matchId}`);
  }

  generateTeams(teamSize?: number): Observable<any> {
    const params = teamSize ? { teamSize: teamSize.toString() } : {};
    return this.http.post(`${this.apiUrl}/matchmaking/generate-teams`, {}, { params });
  }

  getHighQualityMatches(minScore?: number): Observable<any> {
    const params = minScore ? { minScore: minScore.toString() } : {};
    return this.http.get(`${this.apiUrl}/matchmaking/high-quality-matches`, { params });
  }

  // Analytics
  exportMatchmakingData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/matchmaking/analytics/export`);
  }

  getSimilarProfiles(email: string, limit?: number): Observable<any> {
    const params = limit ? { limit: limit.toString() } : {};
    return this.http.get(`${this.apiUrl}/matchmaking/similar-profiles/${encodeURIComponent(email)}`, { params });
  }
}
```

---

## 🔒 Fluxo de Autenticação

### 1. Componente de Login

**`src/app/components/auth/login.component.ts`**
```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3>🚀 NASA Space Apps Login</h3>
            </div>
            <div class="card-body">
              <!-- Passo 1: Verificar Email -->
              <form *ngIf="step === 1" [formGroup]="emailForm" (ngSubmit)="checkEmail()">
                <div class="mb-3">
                  <label class="form-label">Email registrado:</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    formControlName="email"
                    [class.is-invalid]="emailForm.get('email')?.invalid && emailForm.get('email')?.touched"
                  >
                  <div class="invalid-feedback" *ngIf="emailForm.get('email')?.invalid && emailForm.get('email')?.touched">
                    Email inválido
                  </div>
                </div>
                <button type="submit" class="btn btn-primary" [disabled]="emailForm.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Verificar Email
                </button>
              </form>

              <!-- Passo 2: Inserir Código -->
              <form *ngIf="step === 2" [formGroup]="codeForm" (ngSubmit)="verifyCode()">
                <div class="alert alert-info">
                  Código enviado para <strong>{{ currentEmail }}</strong>
                </div>
                <div class="mb-3">
                  <label class="form-label">Código de 6 dígitos:</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    formControlName="code"
                    maxlength="6"
                    placeholder="123456"
                    [class.is-invalid]="codeForm.get('code')?.invalid && codeForm.get('code')?.touched"
                  >
                  <div class="invalid-feedback" *ngIf="codeForm.get('code')?.invalid && codeForm.get('code')?.touched">
                    Código deve ter exatamente 6 dígitos
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-success" [disabled]="codeForm.invalid || loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    Verificar Código
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="goBack()">
                    Voltar
                  </button>
                </div>
              </form>

              <!-- Mensagens de erro -->
              <div *ngIf="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  step = 1;
  loading = false;
  errorMessage = '';
  currentEmail = '';

  emailForm: FormGroup;
  codeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  checkEmail(): void {
    if (this.emailForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    const email = this.emailForm.get('email')?.value;

    this.authService.checkEmail(email).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.isRegistered) {
          this.currentEmail = email;
          this.step = 2;
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erro ao verificar email. Tente novamente.';
        console.error(error);
      }
    });
  }

  verifyCode(): void {
    if (this.codeForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    const code = this.codeForm.get('code')?.value;

    this.authService.verifyCode(this.currentEmail, code).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.authenticated) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Código inválido ou expirado.';
        console.error(error);
      }
    });
  }

  goBack(): void {
    this.step = 1;
    this.codeForm.reset();
    this.errorMessage = '';
  }
}
```

---

## 🤖 Sistema de Matchmaking

### 1. Componente de Criação de Perfil

**`src/app/components/profile/create-profile.component.ts`**
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatchmakingService } from '../../services/matchmaking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-profile',
  template: `
    <div class="container mt-4">
      <h2>🎯 Criar Perfil de Matchmaking</h2>
      
      <form [formGroup]="profileForm" (ngSubmit)="createProfile()">
        <!-- Informações Básicas -->
        <div class="card mb-4">
          <div class="card-header"><h5>📋 Informações Básicas</h5></div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Nome Completo *</label>
                  <input type="text" class="form-control" formControlName="fullName" required>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Nível de Expertise *</label>
                  <select class="form-control" formControlName="expertiseLevel" required>
                    <option value="">Selecione...</option>
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="advanced">Avançado</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Skills *</label>
              <input type="text" class="form-control" [(ngModel)]="skillsInput" 
                     (keyup.enter)="addSkill()" placeholder="Digite uma skill e pressione Enter"
                     [ngModelOptions]="{standalone: true}">
              <div class="mt-2">
                <span *ngFor="let skill of skills; let i = index" class="badge bg-primary me-2">
                  {{ skill }} <span class="ms-1" style="cursor: pointer;" (click)="removeSkill(i)">×</span>
                </span>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Educação *</label>
              <input type="text" class="form-control" formControlName="education" 
                     placeholder="Ex: Bacharelado em Ciência da Computação" required>
            </div>

            <div class="mb-3">
              <label class="form-label">Bio</label>
              <textarea class="form-control" formControlName="bio" rows="3"
                        placeholder="Conte um pouco sobre você..."></textarea>
            </div>
          </div>
        </div>

        <!-- Experiência Profissional -->
        <div class="card mb-4">
          <div class="card-header">
            <h5>💼 Experiência Profissional</h5>
            <button type="button" class="btn btn-sm btn-outline-primary" (click)="addWorkExperience()">
              Adicionar Experiência
            </button>
          </div>
          <div class="card-body">
            <div formArrayName="workExperience">
              <div *ngFor="let exp of workExperienceArray.controls; let i = index" 
                   [formGroupName]="i" class="border p-3 mb-3 rounded">
                <div class="row">
                  <div class="col-md-4">
                    <label class="form-label">Empresa *</label>
                    <input type="text" class="form-control" formControlName="company" required>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Cargo *</label>
                    <input type="text" class="form-control" formControlName="position" required>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Setor *</label>
                    <input type="text" class="form-control" formControlName="sector" required>
                  </div>
                </div>
                <div class="row mt-2">
                  <div class="col-md-3">
                    <label class="form-label">Anos de Experiência *</label>
                    <input type="number" class="form-control" formControlName="yearsOfExperience" min="0" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Tecnologias *</label>
                    <input type="text" class="form-control" 
                           placeholder="Ex: JavaScript, Python, React (separado por vírgula)"
                           (blur)="updateTechnologies(i, $event)">
                  </div>
                  <div class="col-md-3 d-flex align-items-end">
                    <button type="button" class="btn btn-danger btn-sm" (click)="removeWorkExperience(i)">
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Disponibilidade -->
        <div class="card mb-4">
          <div class="card-header"><h5>⏰ Disponibilidade</h5></div>
          <div class="card-body" formGroupName="availability">
            <div class="row">
              <div class="col-md-4">
                <label class="form-label">Horas por Semana *</label>
                <input type="number" class="form-control" formControlName="hoursPerWeek" 
                       min="1" max="40" required>
              </div>
              <div class="col-md-4">
                <label class="form-label">Fuso Horário *</label>
                <select class="form-control" formControlName="timezone" required>
                  <option value="">Selecione...</option>
                  <option value="America/Sao_Paulo">Brasília (UTC-3)</option>
                  <option value="America/New_York">Nova York (UTC-5)</option>
                  <option value="Europe/London">Londres (UTC+0)</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Horário Preferido *</label>
                <input type="text" class="form-control" formControlName="preferredWorkingHours" 
                       placeholder="Ex: 18:00-22:00" required>
              </div>
            </div>
          </div>
        </div>

        <!-- Preferências -->
        <div class="card mb-4">
          <div class="card-header"><h5>🎯 Preferências</h5></div>
          <div class="card-body" formGroupName="preferences">
            <div class="row">
              <div class="col-md-3">
                <label class="form-label">Tamanho da Equipe *</label>
                <select class="form-control" formControlName="teamSize" required>
                  <option value="">Selecione...</option>
                  <option value="small">Pequena (2-3)</option>
                  <option value="medium">Média (4-5)</option>
                  <option value="large">Grande (6+)</option>
                  <option value="any">Qualquer</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Estilo de Comunicação *</label>
                <select class="form-control" formControlName="communicationStyle" required>
                  <option value="">Selecione...</option>
                  <option value="direct">Direto</option>
                  <option value="collaborative">Colaborativo</option>
                  <option value="supportive">Apoiador</option>
                  <option value="analytical">Analítico</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Papel Preferido *</label>
                <select class="form-control" formControlName="workStyle" required>
                  <option value="">Selecione...</option>
                  <option value="leader">Líder</option>
                  <option value="contributor">Contribuidor</option>
                  <option value="specialist">Especialista</option>
                  <option value="facilitator">Facilitador</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Idiomas *</label>
                <input type="text" class="form-control" [(ngModel)]="languagesInput"
                       placeholder="Ex: Português, Inglês" [ngModelOptions]="{standalone: true}"
                       (blur)="updateLanguages()">
              </div>
            </div>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="d-flex gap-2 mb-4">
          <button type="submit" class="btn btn-success" [disabled]="profileForm.invalid || loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            Criar Perfil
          </button>
          <button type="button" class="btn btn-secondary" (click)="cancel()">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `
})
export class CreateProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;
  skills: string[] = [];
  skillsInput = '';
  languagesInput = '';

  constructor(
    private fb: FormBuilder,
    private matchmakingService: MatchmakingService,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profileForm.patchValue({
        email: currentUser.email,
        fullName: currentUser.fullName
      });
    }
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      skills: [[]],
      expertiseLevel: ['', Validators.required],
      workExperience: this.fb.array([]),
      education: ['', Validators.required],
      projects: this.fb.array([]),
      availability: this.fb.group({
        hoursPerWeek: ['', [Validators.required, Validators.min(1), Validators.max(40)]],
        timezone: ['', Validators.required],
        preferredWorkingHours: ['', Validators.required],
        availableDates: [[]]
      }),
      preferences: this.fb.group({
        teamSize: ['', Validators.required],
        projectType: [[]],
        communicationStyle: ['', Validators.required],
        workStyle: ['', Validators.required],
        interests: [[]]
      }),
      languages: [[]],
      githubProfile: [''],
      linkedinProfile: [''],
      portfolioUrl: [''],
      bio: [''],
      participationGoals: [[]],
      challengesInterests: [[]]
    });
  }

  get workExperienceArray(): FormArray {
    return this.profileForm.get('workExperience') as FormArray;
  }

  addWorkExperience(): void {
    const workExp = this.fb.group({
      company: ['', Validators.required],
      position: ['', Validators.required],
      sector: ['', Validators.required],
      yearsOfExperience: ['', [Validators.required, Validators.min(0)]],
      technologies: [[], Validators.required],
      description: ['']
    });
    this.workExperienceArray.push(workExp);
  }

  removeWorkExperience(index: number): void {
    this.workExperienceArray.removeAt(index);
  }

  updateTechnologies(index: number, event: any): void {
    const technologies = event.target.value.split(',').map((tech: string) => tech.trim());
    this.workExperienceArray.at(index).patchValue({ technologies });
  }

  addSkill(): void {
    if (this.skillsInput.trim() && !this.skills.includes(this.skillsInput.trim())) {
      this.skills.push(this.skillsInput.trim());
      this.profileForm.patchValue({ skills: this.skills });
      this.skillsInput = '';
    }
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
    this.profileForm.patchValue({ skills: this.skills });
  }

  updateLanguages(): void {
    const languages = this.languagesInput.split(',').map(lang => lang.trim());
    this.profileForm.patchValue({ languages });
  }

  createProfile(): void {
    if (this.profileForm.invalid) return;

    this.loading = true;
    this.matchmakingService.createProfile(this.profileForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        alert('Perfil criado com sucesso!');
        this.router.navigate(['/matches']);
      },
      error: (error) => {
        this.loading = false;
        alert('Erro ao criar perfil: ' + error.error?.message || error.message);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
```

### 2. Componente de Visualização de Matches

**`src/app/components/matches/matches.component.ts`**
```typescript
import { Component, OnInit } from '@angular/core';
import { MatchmakingService } from '../../services/matchmaking.service';
import { AuthService } from '../../services/auth.service';
import { TeamMatch } from '../../models/matchmaking.models';

@Component({
  selector: 'app-matches',
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
                <div class="progress-stacked mb-2">
                  <div class="progress" role="progressbar" style="width: 30%">
                    <div class="progress-bar bg-primary" 
                         [style.width.%]="match.matchScore.skillsCompatibility * 100">
                    </div>
                  </div>
                  <small>Skills: {{ (match.matchScore.skillsCompatibility * 100) | number:'1.0-0' }}%</small>
                </div>
                <div class="progress-stacked mb-2">
                  <div class="progress" role="progressbar" style="width: 25%">
                    <div class="progress-bar bg-success" 
                         [style.width.%]="match.matchScore.experienceBalance * 100">
                    </div>
                  </div>
                  <small>Experiência: {{ (match.matchScore.experienceBalance * 100) | number:'1.0-0' }}%</small>
                </div>
                <div class="progress-stacked mb-2">
                  <div class="progress" role="progressbar" style="width: 20%">
                    <div class="progress-bar bg-warning" 
                         [style.width.%]="match.matchScore.availabilityMatch * 100">
                    </div>
                  </div>
                  <small>Disponibilidade: {{ (match.matchScore.availabilityMatch * 100) | number:'1.0-0' }}%</small>
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
  `
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
```

---

## 🛡️ Guards

**`src/app/guards/auth.guard.ts`**
```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
```

---

## 🔧 Interceptors

**`src/app/interceptors/http-error.interceptor.ts`**
```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // Erro do lado do cliente
          errorMessage = `Erro: ${error.error.message}`;
        } else {
          // Erro do lado do servidor
          switch (error.status) {
            case 401:
              errorMessage = 'Não autorizado. Faça login novamente.';
              this.authService.logout();
              this.router.navigate(['/login']);
              break;
            case 403:
              errorMessage = 'Acesso negado.';
              break;
            case 404:
              errorMessage = 'Recurso não encontrado.';
              break;
            case 500:
              errorMessage = 'Erro interno do servidor.';
              break;
            default:
              errorMessage = error.error?.message || 'Erro desconhecido';
          }
        }

        console.error('HTTP Error:', error);
        return throwError(errorMessage);
      })
    );
  }
}
```

---

## 🚦 Rotas

**`src/app/app-routing.module.ts`**
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateProfileComponent } from './components/profile/create-profile.component';
import { MatchesComponent } from './components/matches/matches.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile/create', component: CreateProfileComponent, canActivate: [AuthGuard] },
  { path: 'matches', component: MatchesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

---

## 🚀 Exemplo de Uso Completo

### 1. Fluxo de Autenticação
```typescript
// 1. Usuário acessa /login
// 2. Insere email registrado no NASA Space Apps
// 3. API verifica se email existe na planilha
// 4. Se existe, envia código de 6 dígitos por email
// 5. Usuário insere código
// 6. API valida código e retorna dados do usuário
// 7. Frontend salva dados no localStorage
// 8. Redireciona para /dashboard
```

### 2. Fluxo de Matchmaking
```typescript
// 1. Usuário cria perfil detalhado em /profile/create
// 2. Frontend envia dados para API
// 3. Usuário vai para /matches
// 4. Clica em "Encontrar Novos Matches"
// 5. API executa algoritmo de ML e retorna matches
// 6. Frontend exibe matches com scores e explicações
// 7. Usuário pode aceitar/rejeitar matches
// 8. API atualiza status do match
```

---

## 📱 Responsividade e UX

### CSS Adicional Recomendado
```css
/* src/styles.css */
.match-card {
  transition: transform 0.2s ease-in-out;
}

.match-card:hover {
  transform: translateY(-2px);
}

.progress-stacked {
  display: flex;
  align-items: center;
  gap: 10px;
}

.skill-badge {
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
}

.high-quality-match {
  box-shadow: 0 0 15px rgba(40, 167, 69, 0.3);
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
  
  .card-body {
    padding: 15px;
  }
}
```

---

## 🔍 Dicas de Implementação

### 1. **Performance**
- Use OnPush change detection em componentes pesados
- Implemente paginação para listas grandes
- Cache dados quando apropriado

### 2. **UX/UI**
- Adicione loading states em todas as operações
- Implemente feedback visual para ações do usuário
- Use modais para confirmação de ações destrutivas

### 3. **Segurança**
- Sempre valide dados no frontend E backend
- Não armazene dados sensíveis no localStorage
- Implemente HTTPS em produção

### 4. **Monitoramento**
- Adicione analytics para rastrear uso
- Implemente error reporting (Sentry, Bugsnag)
- Monitore performance com Web Vitals

Esta documentação fornece uma base sólida para integrar o frontend Angular com a API de matchmaking do NASA Space Apps! 🚀