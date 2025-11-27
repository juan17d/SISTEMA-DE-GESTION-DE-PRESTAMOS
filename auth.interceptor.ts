import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  // Agregar token de autorización si existe
  const cloned = token
    ? req.clone({ 
        setHeaders: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      })
    : req.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });

  // Log para depuración (solo en desarrollo)
  if (req.url.includes('localhost')) {
    console.log(`🌐 ${req.method} ${req.url}`, token ? '🔐 Con token' : '⚠️ Sin token');
  }

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      // Ignorar errores 404 en la raíz (es normal que no exista un endpoint GET /)
      if (error.status === 404 && error.url?.endsWith('localhost:8080/')) {
        console.warn('⚠️ El backend no tiene un endpoint para la ruta raíz. Esto es normal.');
        return throwError(() => error);
      }

      // Log detallado de otros errores
      if (error.status === 0) {
        console.error('❌ Error de conexión: No se pudo conectar al backend en http://localhost:8080');
        console.error('💡 Verifica que el backend esté corriendo y accesible');
      } else if (error.status >= 500) {
        console.error(`❌ Error del servidor (${error.status}):`, error.message);
      } else if (error.status === 401 || error.status === 403) {
        console.warn(`🔒 Error de autenticación/autorización (${error.status})`);
      }

      return throwError(() => error);
    })
  );
};
