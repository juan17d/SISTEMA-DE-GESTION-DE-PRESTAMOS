import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService, Prestamo } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cliente-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.scss']
})
export class ClienteDashboardComponent implements OnInit {
  // Exponer Math para uso en templates
  Math = Math;
  
  prestamos: Prestamo[] = [];
  loading = false;
  error: string | null = null;
  totalMulta = 0;

  constructor(
    private loanService: LoanService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Cargar todos los préstamos en el servicio (BehaviorSubject compartido)
    this.loanService.loadAll();
    
    // Suscribirse al feed reactivo de préstamos y filtrar para el usuario actual
    this.loadMyLoans();
    this.loanService.loans$.subscribe(() => this.loadMyLoans());
  }

  loadMyLoans() {
    const payload = this.authService.getPayload();
    if (!payload || (!payload.sub && !payload.id)) {
      this.error = 'No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente.';
      this.loading = false;
      return;
    }

    const userId = payload.sub || payload.id;
    const userIdNumber = Number(userId);
    console.log('Cargando préstamos para usuario ID:', userId, '(número:', userIdNumber, ')');
    
    this.loading = true;
    this.error = null;

    // Intentar usar el endpoint específico del usuario primero
    if (userIdNumber && !isNaN(userIdNumber)) {
      this.loanService.getByUserId(userIdNumber).subscribe({
        next: (prestamos) => {
          console.log('📚 Préstamos recibidos del endpoint específico:', prestamos);
          this.processPrestamos(prestamos);
        },
        error: (err) => {
          console.warn('⚠️ Error al obtener préstamos por usuario, intentando obtener todos:', err);
          // Fallback: obtener todos y filtrar
          this.loadAllAndFilter(userId, userIdNumber);
        }
      });
    } else {
      // Si no hay userId válido, obtener todos y filtrar
      this.loadAllAndFilter(userId, userIdNumber);
    }
  }

  private loadAllAndFilter(userId: string | number, userIdNumber: number) {
    // Request all and filter locally (ensures latest from server)
    this.loanService.getAll().subscribe({
      next: (allPrestamos) => {
        console.log('📚 Préstamos recibidos del backend (todos):', allPrestamos);
        this.processPrestamos(allPrestamos.filter(p => {
          const prestamoUserId = p.usuario?.id;
          return (
            prestamoUserId === userId ||
            prestamoUserId === userIdNumber ||
            prestamoUserId === Number(userId) ||
            String(prestamoUserId) === String(userId)
          );
        }));
      },
      error: (err) => {
        console.error('Error al cargar préstamos:', err);
        
        // Determinar el mensaje de error más específico
        if (err?.status === 0 || err?.status === 500) {
          this.error = 'Error de conexión con el servidor. Verifica que el backend esté disponible en http://localhost:8080';
        } else if (err?.status === 401 || err?.status === 403) {
          this.error = 'No tienes permisos para ver los préstamos. Por favor, inicia sesión nuevamente.';
        } else if (err?.status === 404) {
          this.error = 'No se encontraron préstamos.';
        } else if (err?.error?.message) {
          this.error = err.error.message;
        } else if (err?.message) {
          this.error = err.message;
        } else {
          this.error = 'No se pudieron cargar tus préstamos. Verifica tu conexión a internet y que el servidor esté disponible.';
        }
        
        this.loading = false;
      }
    });
  }

  private processPrestamos(prestamos: Prestamo[]) {
    console.log('📋 Procesando préstamos:', prestamos);
    
    // Validar y loggear cada préstamo
    prestamos.forEach(p => {
      if (!p.ejemplar) {
        console.error('❌ Préstamo sin ejemplar:', p);
      } else if (!p.ejemplar.libro) {
        console.error('❌ Ejemplar sin libro:', p.ejemplar);
      } else {
        console.log('✅ Préstamo válido:', {
          id: p.id,
          titulo: p.ejemplar.libro.titulo,
          codigo: p.ejemplar.codigo
        });
      }
    });
    
    this.prestamos = prestamos;
    this.totalMulta = this.prestamos
      .filter(p => !p.devuelto)
      .reduce((sum, p) => sum + this.getFine(p), 0);
    this.loading = false;
  }

  calculateDaysRemaining(fechaDevolucion: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const devolucion = new Date(fechaDevolucion);
    devolucion.setHours(0, 0, 0, 0);
    const diffTime = devolucion.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  calculateFine(fechaDevolucion: string): number {
    const diasRetraso = this.calculateDaysRemaining(fechaDevolucion);
    if (diasRetraso < 0) {
      return Math.abs(diasRetraso) * 1000; // 1000 por cada día de retraso
    }
    return 0;
  }

  getDaysRemaining(prestamo: Prestamo): number {
    if (prestamo.devuelto) return 0;
    return this.calculateDaysRemaining(prestamo.fechaDevolucion);
  }

  getFine(prestamo: Prestamo): number {
    if (prestamo.devuelto) return 0;
    return this.calculateFine(prestamo.fechaDevolucion);
  }

  hasOverdue(prestamo: Prestamo): boolean {
    if (prestamo.devuelto) return false;
    return this.calculateDaysRemaining(prestamo.fechaDevolucion) < 0;
  }

  getActiveLoans(): Prestamo[] {
    return this.prestamos.filter(p => !p.devuelto);
  }

  getReturnedLoans(): Prestamo[] {
    return this.prestamos.filter(p => p.devuelto);
  }

  /**
   * Obtiene el título del libro de forma segura
   */
  getLibroTitulo(prestamo: Prestamo): string {
    if (!prestamo?.ejemplar) {
      console.warn('Préstamo sin ejemplar:', prestamo);
      return 'Libro no disponible';
    }
    
    if (!prestamo.ejemplar.libro) {
      console.warn('Ejemplar sin libro:', prestamo.ejemplar);
      return 'Libro no disponible';
    }
    
    return prestamo.ejemplar.libro.titulo || 'Sin título';
  }

  /**
   * Obtiene el código del ejemplar de forma segura
   */
  getEjemplarCodigo(prestamo: Prestamo): string {
    if (!prestamo?.ejemplar) {
      return 'N/A';
    }
    return prestamo.ejemplar.codigo || 'Sin código';
  }
}
