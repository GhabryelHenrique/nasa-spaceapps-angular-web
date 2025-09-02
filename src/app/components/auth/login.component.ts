import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/api/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
  `,
  styles: [`
    .card {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .card-header {
      background: linear-gradient(135deg, #4ecdc4 0%, #45b7d1 100%);
      color: white;
    }
    .btn-primary {
      background: linear-gradient(135deg, #4ecdc4 0%, #45b7d1 100%);
      border: none;
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #45b7d1 0%, #4ecdc4 100%);
    }
  `]
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