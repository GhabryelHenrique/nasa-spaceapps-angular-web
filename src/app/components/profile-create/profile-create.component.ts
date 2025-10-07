import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserRegistration } from '../../models/auth.models';
import { ParticipantProfile, WorkExperience } from '../../models/matchmaking.models';
import { AuthService } from '../../services/api/auth.service';
import { MatchmakingAuthService } from '../../services/api/matchmaking.service';
import { Challenge, CHALLENGES_DATA } from '../../shared/data/challenges.data';

@Component({
  selector: 'app-profile-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile-create.component.html',
  styleUrls: ['./profile-create.component.scss']
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
  selectedChallenges: string[] = [];
  selectedInterestAreas: string[] = [];

  // Available challenges from NASA Space Apps
  availableChallenges: Challenge[] = CHALLENGES_DATA;

  interestAreas = [
    { value: 'climate-change', label: 'Mudanças Climáticas' },
    { value: 'space-exploration', label: 'Exploração Espacial' },
    { value: 'earth-observation', label: 'Observação da Terra' },
    { value: 'sustainability', label: 'Sustentabilidade' },
    { value: 'agriculture', label: 'Agricultura e Alimentação' },
    { value: 'disaster-management', label: 'Gestão de Desastres' },
    { value: 'health', label: 'Saúde e Medicina' },
    { value: 'education', label: 'Educação e Conscientização' },
    { value: 'transportation', label: 'Transporte e Mobilidade' },
    { value: 'energy', label: 'Energia Renovavel' },
    { value: 'ocean-science', label: 'Ciências Oceânicas' },
    { value: 'biodiversity', label: 'Biodiversidade e Conservação' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private matchmakingService: MatchmakingAuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[\d\s\+\-\(\)]+$/)]],
      education: ['', [Validators.required]],
      expertiseLevel: ['', [Validators.required]],
      bio: [''],
      workExperience: this.fb.array([]),
      gender: [''],
      preferFemaleTeam: [false],
      age: ['', [Validators.required, Validators.min(16), Validators.max(100)]],
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

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/']);
      return;
    }

    this.loadExistingProfile();
  }

  get workExperienceArray(): FormArray {
    return this.profileForm.get('workExperience') as FormArray;
  }

  loadExistingProfile(): void {
    if (!this.currentUser) return;

    this.matchmakingService.getProfile(this.currentUser.email).subscribe({
      next: (profile) => {
        console.log(profile)
        if (profile) {
          this.isEditing = true;
          this.populateForm(profile.profile);
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
      phoneNumber: profile.phoneNumber,
      education: profile.education,
      expertiseLevel: profile.expertiseLevel,
      bio: profile.bio,
      gender: profile.gender || '',
      preferFemaleTeam: profile.preferFemaleTeam || false,
      age: profile.age || '',
      preferences: profile.preferences,
      githubProfile: profile.githubProfile,
      linkedinProfile: profile.linkedinProfile,
      portfolioUrl: profile.portfolioUrl
    });

    this.skills = [...profile.skills];
    this.languages = [...profile.languages];
    this.selectedChallenges = [...(profile.challengesOfInterest || [])];
    this.selectedInterestAreas = [...(profile.interestAreas || [])];

    // Populate work experience
    this.workExperienceArray.clear();
    profile.workExperience.forEach(exp => {
      this.workExperienceArray.push(this.createWorkExperienceGroup(exp));
    });

    // Trigger change detection to update the view
    this.cdr.detectChanges();
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
      this.profileForm.get('phoneNumber')?.value, // Telefone obrigatório
      this.profileForm.get('education')?.value,
      this.profileForm.get('expertiseLevel')?.value,
      this.profileForm.get('gender')?.value,
      this.profileForm.get('bio')?.value,
      this.skills.length > 0,
      this.languages.length > 0,
      this.selectedChallenges.length > 0,
      this.selectedInterestAreas.length > 0,
      this.workExperienceArray.length > 0,
      this.profileForm.get('preferences.teamSize')?.value,
      this.profileForm.get('preferences.communicationStyle')?.value,
      this.profileForm.get('preferences.workStyle')?.value,
      this.profileForm.get('githubProfile')?.value,
      this.profileForm.get('linkedinProfile')?.value,
      this.profileForm.get('portfolioUrl')?.value
    ];

    const completed = fields.filter(field => !!field).length;
    return Math.round((completed / fields.length) * 100);
  }

  validateRequiredFields(): string[] {
    const errors: string[] = [];

    // Required basic fields
    if (!this.profileForm.get('fullName')?.valid) {
      errors.push('Nome completo é obrigatório');
    }

    if (!this.profileForm.get('phoneNumber')?.valid) {
      const phoneValue = this.profileForm.get('phoneNumber')?.value;
      if (!phoneValue || !phoneValue.trim()) {
        errors.push('Telefone é obrigatório');
      } else {
        errors.push('Telefone deve conter apenas números, espaços e símbolos (+, -, (), )');
      }
    }

    if (!this.profileForm.get('education')?.valid) {
      errors.push('Educação é obrigatória');
    }

    if (!this.profileForm.get('expertiseLevel')?.valid) {
      errors.push('Nível de experiência é obrigatório');
    }

    if (!this.profileForm.get('age')?.valid) {
      const ageValue = this.profileForm.get('age')?.value;
      if (!ageValue) {
        errors.push('Idade é obrigatória');
      } else if (ageValue < 16 || ageValue > 100) {
        errors.push('Idade deve estar entre 16 e 100 anos');
      }
    }

    // Skills validation
    if (this.skills.length === 0) {
      errors.push('Pelo menos uma habilidade é obrigatória');
    }

    // Preferences validation
    const preferences = this.profileForm.get('preferences');
    if (!preferences?.get('teamSize')?.valid) {
      errors.push('Tamanho de equipe preferido é obrigatório');
    }

    if (!preferences?.get('communicationStyle')?.valid) {
      errors.push('Estilo de comunicação é obrigatório');
    }

    if (!preferences?.get('workStyle')?.valid) {
      errors.push('Estilo de trabalho é obrigatório');
    }

    return errors;
  }

  isFormValid(): boolean {
    return this.validateRequiredFields().length === 0 && this.profileForm.valid;
  }

  isProfileComplete(): boolean {
    return this.isFormValid();
  }

  onSubmit(): void {
    if (!this.currentUser) {
      Swal.fire({
        icon: 'error',
        title: 'Erro de Autenticação',
        text: 'Usuário não encontrado. Por favor, faça login novamente.',
        confirmButtonColor: '#ff4444'
      });
      return;
    }

    const validationErrors = this.validateRequiredFields();
    if (validationErrors.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos Obrigatórios',
        html: `<div style="text-align: left;"><ul style="margin: 0; padding-left: 20px;">${validationErrors.map(error => `<li>${error}</li>`).join('')}</ul></div>`,
        confirmButtonColor: '#ff4444',
        confirmButtonText: 'Entendi'
      });
      return;
    }

    this.isLoading = true;

    const profileData: ParticipantProfile = {
      email: this.currentUser.email,
      fullName: this.profileForm.get('fullName')?.value,
      phoneNumber: this.profileForm.get('phoneNumber')?.value,
      skills: this.skills,
      expertiseLevel: this.profileForm.get('expertiseLevel')?.value,
      workExperience: this.workExperienceArray.value,
      education: this.profileForm.get('education')?.value,
      age: parseInt(this.profileForm.get('age')?.value) || 18,
      gender: this.profileForm.get('gender')?.value,
      preferFemaleTeam: this.profileForm.get('preferFemaleTeam')?.value,
      challengesOfInterest: this.selectedChallenges,
      interestAreas: this.selectedInterestAreas,
      projects: [], // Can be added in future version
      preferences: {
        ...this.profileForm.get('preferences')?.value,
        projectType: this.selectedChallenges,
        interests: this.selectedInterestAreas
      },
      languages: this.languages,
      githubProfile: this.profileForm.get('githubProfile')?.value,
      linkedinProfile: this.profileForm.get('linkedinProfile')?.value,
      portfolioUrl: this.profileForm.get('portfolioUrl')?.value,
      bio: this.profileForm.get('bio')?.value,
      participationGoals: [] // Can be added in future version
    };

    const request = this.isEditing ?
      this.matchmakingService.updateProfile(this.currentUser.email, profileData) :
      this.matchmakingService.createProfile(profileData);

    request.subscribe({
      next: (response) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: `Perfil ${this.isEditing ? 'atualizado' : 'criado'} com sucesso!`,
          confirmButtonColor: '#4ecdc4',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error saving profile:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao Salvar',
          text: `Erro ao ${this.isEditing ? 'atualizar' : 'criar'} perfil. Tente novamente.`,
          confirmButtonColor: '#ff4444'
        });
      }
    });
  }

  onChallengeChange(event: any): void {
    const value = event.target.value;
    const checked = event.target.checked;

    if (checked) {
      if (!this.selectedChallenges.includes(value)) {
        this.selectedChallenges.push(value);
      }
    } else {
      const index = this.selectedChallenges.indexOf(value);
      if (index > -1) {
        this.selectedChallenges.splice(index, 1);
      }
    }
  }

  onInterestAreaChange(event: any): void {
    const value = event.target.value;
    const checked = event.target.checked;

    if (checked) {
      if (!this.selectedInterestAreas.includes(value)) {
        this.selectedInterestAreas.push(value);
      }
    } else {
      const index = this.selectedInterestAreas.indexOf(value);
      if (index > -1) {
        this.selectedInterestAreas.splice(index, 1);
      }
    }
  }

  showFemaleTeamOption(): boolean {
    const gender = this.profileForm.get('gender')?.value;
    return gender && gender !== 'masculine';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
