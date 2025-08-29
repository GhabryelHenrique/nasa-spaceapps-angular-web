import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatchmakingService, TeamPreferences } from '../../services/matchmaking.service';

interface AreaOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-team-preferences-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './team-preferences-modal.component.html',
  styleUrl: './team-preferences-modal.component.scss'
})
export class TeamPreferencesModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() preferencesSet = new EventEmitter<void>();

  selectedArea = '';
  skills = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  areaOptions: AreaOption[] = [
    {
      id: 'development',
      name: 'Desenvolvimento',
      icon: 'fa-solid fa-code',
      description: 'Frontend, Backend, Mobile, Full-Stack'
    },
    {
      id: 'design',
      name: 'Design & UX/UI',
      icon: 'fa-solid fa-palette',
      description: 'Design Gráfico, UX/UI, Prototipagem'
    },
    {
      id: 'data-science',
      name: 'Ciência de Dados',
      icon: 'fa-solid fa-chart-line',
      description: 'Data Science, Machine Learning, IA'
    },
    {
      id: 'engineering',
      name: 'Engenharia',
      icon: 'fa-solid fa-cogs',
      description: 'Engenharia de Software, Sistemas, Hardware'
    },
    {
      id: 'business',
      name: 'Negócios & Gestão',
      icon: 'fa-solid fa-briefcase',
      description: 'Business, Marketing, Produto, Vendas'
    },
    {
      id: 'research',
      name: 'Pesquisa & Ciência',
      icon: 'fa-solid fa-flask',
      description: 'Pesquisa Científica, Análise, Documentação'
    },
    {
      id: 'communication',
      name: 'Comunicação',
      icon: 'fa-solid fa-bullhorn',
      description: 'Marketing, Comunicação, Redação, Apresentação'
    },
    {
      id: 'other',
      name: 'Outras Áreas',
      icon: 'fa-solid fa-plus',
      description: 'Outras habilidades e conhecimentos'
    }
  ];

  constructor(private matchmakingService: MatchmakingService) {}

  onSubmit(): void {
    if (!this.selectedArea) {
      this.errorMessage = 'Por favor, selecione uma área de atuação.';
      return;
    }

    if (!this.skills.trim()) {
      this.errorMessage = 'Por favor, descreva suas habilidades.';
      return;
    }

    if (this.skills.length < 10) {
      this.errorMessage = 'Descreva suas habilidades com pelo menos 10 caracteres.';
      return;
    }

    const preferences: TeamPreferences = {
      area: this.selectedArea,
      skills: this.skills.trim()
    };

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.matchmakingService.updateUserPreferences(preferences).subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.successMessage = 'Preferências salvas com sucesso! Redirecionando para o matchmaking...';
        setTimeout(() => {
          this.preferencesSet.emit();
          this.closeModal();
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao salvar preferências. Tente novamente.';
        console.error('Update preferences error:', error);
      }
    });
  }

  selectArea(areaId: string): void {
    this.selectedArea = areaId;
    this.errorMessage = '';
  }

  getSelectedAreaName(): string {
    const area = this.areaOptions.find(a => a.id === this.selectedArea);
    return area ? area.name : '';
  }

  closeModal(): void {
    this.selectedArea = '';
    this.skills = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = false;
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}