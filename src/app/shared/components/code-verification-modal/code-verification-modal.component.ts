import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatchmakingService, CodeVerificationResponse } from '../../services/matchmaking.service';

@Component({
  selector: 'app-code-verification-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './code-verification-modal.component.html',
  styleUrl: './code-verification-modal.component.scss'
})
export class CodeVerificationModalComponent {
  @Input() isOpen = false;
  @Input() email = '';
  @Output() close = new EventEmitter<void>();
  @Output() codeVerified = new EventEmitter<void>();

  code = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private matchmakingService: MatchmakingService) {}

  onSubmit(): void {
    if (!this.code || this.code.length !== 6) {
      this.errorMessage = 'Por favor, insira o código de 6 dígitos.';
      return;
    }

    if (!/^\d{6}$/.test(this.code)) {
      this.errorMessage = 'O código deve conter apenas números.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.matchmakingService.verifyCode(this.email, this.code).subscribe({
      next: (response: CodeVerificationResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = 'Login realizado com sucesso! Redirecionando...';
          setTimeout(() => {
            this.codeVerified.emit();
            this.closeModal();
          }, 1500);
        } else {
          this.errorMessage = response.message || 'Código inválido. Tente novamente.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao verificar código. Tente novamente.';
        console.error('Code verification error:', error);
      }
    });
  }

  onCodeInput(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    this.code = value.substring(0, 6);
    this.errorMessage = '';
  }

  resendCode(): void {
    this.matchmakingService.verifyEmail(this.email).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Código reenviado para seu email!';
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = 'Erro ao reenviar código. Tente novamente.';
        }
      },
      error: () => {
        this.errorMessage = 'Erro ao reenviar código. Tente novamente.';
      }
    });
  }

  closeModal(): void {
    this.code = '';
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

  goBack(): void {
    this.closeModal();
  }
}