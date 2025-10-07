import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/api/auth.service';

@Component({
  selector: 'app-email-verification-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './email-verification-modal.component.html',
  styleUrl: './email-verification-modal.component.scss'
})
export class EmailVerificationModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() emailVerified = new EventEmitter<{ email: string; isRegistered: boolean }>();

  email = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (!this.email || !this.isValidEmail(this.email)) {
      this.errorMessage = 'Por favor, insira um email válido.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.checkEmail(this.email).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isRegistered) {
          this.successMessage = 'Email encontrado! Código de 6 dígitos enviado para seu email.';
          setTimeout(() => {
            this.emailVerified.emit({ email: this.email, isRegistered: true });
            this.closeModal();
          }, 1500);
        } else {
          this.errorMessage = response.message || 'Email não encontrado. Por favor, inscreva-se primeiro no formulário Google e na NASA Space Apps.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erro de conexão. Tente novamente mais tarde.';
        console.error('Email verification error:', error);
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  openRegistrationForms(): void {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfXZyu0PCuyIGgC_33jCLaOk-dmB1SugvrIt2eUK7EaWvq6mg/viewform', '_blank');
    window.open('https://www.spaceappschallenge.org/', '_blank');
  }

  closeModal(): void {
    this.email = '';
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