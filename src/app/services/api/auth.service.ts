import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  CheckEmailRequest, 
  CheckEmailResponse, 
  VerifyCodeRequest, 
  VerifyCodeResponse,
  UserRegistration 
} from '../../models/auth.models';

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