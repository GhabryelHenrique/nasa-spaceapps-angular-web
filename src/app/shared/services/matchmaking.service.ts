import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface MatchmakingUser {
  id: string;
  email: string;
  name?: string;
  area: string;
  skills: string;
  lookingForTeam: boolean;
  createdAt: Date;
}

export interface TeamPreferences {
  area: string;
  skills: string;
}

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
  isRegistered: boolean;
}

export interface CodeVerificationResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: MatchmakingUser;
}

@Injectable({
  providedIn: 'root'
})
export class MatchmakingService {
  private readonly apiUrl = '/api/matchmaking';
  private currentUserSubject = new BehaviorSubject<MatchmakingUser | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('matchmaking_token');
      const user = localStorage.getItem('matchmaking_user');
      
      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          this.currentUserSubject.next(parsedUser);
          this.isAuthenticatedSubject.next(true);
        } catch (error) {
          this.clearStoredAuth();
        }
      }
    }
  }

  private saveUserToStorage(token: string, user: MatchmakingUser): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('matchmaking_token', token);
      localStorage.setItem('matchmaking_user', JSON.stringify(user));
    }
  }

  private clearStoredAuth(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('matchmaking_token');
      localStorage.removeItem('matchmaking_user');
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = typeof window !== 'undefined' ? localStorage.getItem('matchmaking_token') : null;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  verifyEmail(email: string): Observable<EmailVerificationResponse> {
    return this.http.post<EmailVerificationResponse>(`${this.apiUrl}/verify-email`, { email })
      .pipe(
        catchError(error => {
          console.error('Email verification error:', error);
          return throwError(() => error);
        })
      );
  }

  verifyCode(email: string, code: string): Observable<CodeVerificationResponse> {
    return this.http.post<CodeVerificationResponse>(`${this.apiUrl}/verify-code`, { email, code })
      .pipe(
        map(response => {
          if (response.success && response.token && response.user) {
            this.saveUserToStorage(response.token, response.user);
            this.currentUserSubject.next(response.user);
            this.isAuthenticatedSubject.next(true);
          }
          return response;
        }),
        catchError(error => {
          console.error('Code verification error:', error);
          return throwError(() => error);
        })
      );
  }

  updateUserPreferences(preferences: TeamPreferences): Observable<MatchmakingUser> {
    return this.http.put<MatchmakingUser>(`${this.apiUrl}/preferences`, preferences, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(updatedUser => {
        this.saveUserToStorage(localStorage.getItem('matchmaking_token') || '', updatedUser);
        this.currentUserSubject.next(updatedUser);
        return updatedUser;
      }),
      catchError(error => {
        console.error('Update preferences error:', error);
        return throwError(() => error);
      })
    );
  }

  toggleLookingForTeam(): Observable<MatchmakingUser> {
    return this.http.put<MatchmakingUser>(`${this.apiUrl}/toggle-looking`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(updatedUser => {
        this.saveUserToStorage(localStorage.getItem('matchmaking_token') || '', updatedUser);
        this.currentUserSubject.next(updatedUser);
        return updatedUser;
      }),
      catchError(error => {
        console.error('Toggle looking for team error:', error);
        return throwError(() => error);
      })
    );
  }

  getMatchingUsers(): Observable<MatchmakingUser[]> {
    return this.http.get<MatchmakingUser[]>(`${this.apiUrl}/matches`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Get matching users error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.clearStoredAuth();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): MatchmakingUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}