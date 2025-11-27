import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  /**
   * Verifica si el backend está disponible
   * Intenta acceder a un endpoint conocido para verificar la conexión
   */
  checkBackendHealth(): Observable<{ available: boolean; message: string }> {
    // Intentar acceder a un endpoint que debería existir (por ejemplo, el endpoint de login o una API)
    // Usamos OPTIONS para no requerir autenticación
    return this.http.options(`${this.baseUrl}/auth/login`, { observe: 'response' }).pipe(
      map(() => ({
        available: true,
        message: 'Backend disponible y funcionando correctamente'
      })),
      catchError((err) => {
        // Si el endpoint existe pero requiere autenticación, el backend está funcionando
        if (err.status === 401 || err.status === 403 || err.status === 405) {
          return of({
            available: true,
            message: 'Backend disponible (el endpoint requiere autenticación)'
          });
        }
        // Si es un 404, intentamos con otro endpoint
        if (err.status === 404) {
          return this.http.options(`${this.baseUrl}/api/prestamos`, { observe: 'response' }).pipe(
            map(() => ({
              available: true,
              message: 'Backend disponible y funcionando correctamente'
            })),
            catchError(() => of({
              available: false,
              message: 'No se pudo conectar al backend. Verifica que esté corriendo en http://localhost:8080'
            }))
          );
        }
        // Otros errores
        return of({
          available: false,
          message: `Error de conexión: ${err.message || 'No se pudo conectar al backend'}`
        });
      })
    );
  }

  /**
   * Verifica si el backend está disponible de forma simple
   */
  isBackendAvailable(): Observable<boolean> {
    return this.checkBackendHealth().pipe(
      map(result => result.available)
    );
  }
}

