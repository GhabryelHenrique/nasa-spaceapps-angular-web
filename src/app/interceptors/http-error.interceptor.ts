import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/api/auth.service';

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
        return throwError(() => errorMessage);
      })
    );
  }
}