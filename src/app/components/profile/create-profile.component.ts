import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatchmakingService } from '../../services/api/matchmaking.service';
import { AuthService } from '../../services/api/auth.service';

@Component({
  selector: 'app-create-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
          <div class="card-header d-flex justify-content-between align-items-center">
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
  `,
  styles: [`
    .card {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .card-header {
      background: linear-gradient(135deg, #4ecdc4 0%, #45b7d1 100%);
      color: white;
    }
    .badge {
      background: linear-gradient(135deg, #4ecdc4 0%, #45b7d1 100%);
    }
    .btn-success {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      border: none;
    }
  `]
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
        alert('Erro ao criar perfil: ' + (error.error?.message || error.message));
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}