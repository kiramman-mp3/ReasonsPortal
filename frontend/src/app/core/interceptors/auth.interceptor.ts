import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Interceptor funcional moderno para inyectar cabeceras JWT y controlar expiración
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  let cloned = req;

  // Clonar la solicitud e inyectar el header de autorización si el token existe
  if (token) {
    cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(cloned).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse) {
        // Capturar errores de autenticación expirada o inválida (401 o 403)
        if ((error.status === 401 || error.status === 403) && req.url.includes('/api/')) {
          authService.logout();
          router.navigate(['/admin/login'], { queryParams: { expired: 'true' } });
        }
      }
      return throwError(() => error);
    })
  );
};
