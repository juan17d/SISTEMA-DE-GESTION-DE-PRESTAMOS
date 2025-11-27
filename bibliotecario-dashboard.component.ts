import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { LoanService, Prestamo, PrestamoPayload } from '../../services/loan.service';
import { UserService, Usuario } from '../../services/user.service';
import { EjemplarService, Ejemplar } from '../../services/ejemplar.service';

@Component({
  selector: 'app-bibliotecario-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bibliotecario-dashboard.component.html',
  styleUrls: ['./bibliotecario-dashboard.component.scss']
})
export class BibliotecarioDashboardComponent implements OnInit {
  users: Usuario[] = [];
  ejemplares: Ejemplar[] = [];
  prestamos: Prestamo[] = [];
  selectedUserId: number | null = null;
  selectedEjemplarId: number | null = null;
  loanDays = 15;
  loadingUsers = false;
  loadingEjemplares = false;
  loadingLoans = false;
  creatingLoan = false;
  error: string | null = null;

  constructor(
    private loanService: LoanService,
    private userService: UserService,
    private ejemplarService: EjemplarService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadEjemplares();
    this.loadPrestamos();
  }

  loadUsers() {
    this.loadingUsers = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        // Filtrar solo clientes
        this.users = users.filter(u => {
          const rol = u.rol?.nombre?.toUpperCase() || '';
          return rol === 'CLIENTE' || rol === 'USER' || !rol;
        });
        this.loadingUsers = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = 'No se pudieron cargar los usuarios';
        this.loadingUsers = false;
      }
    });
  }

  loadEjemplares() {
    this.loadingEjemplares = true;
    this.ejemplarService.getAll().subscribe({
      next: (ejemplares) => {
        this.ejemplares = ejemplares;
        this.loadingEjemplares = false;
      },
      error: (err) => {
        console.error('Error al cargar ejemplares:', err);
        this.loadingEjemplares = false;
      }
    });
  }

  loadPrestamos() {
    this.loadingLoans = true;
    this.loanService.getAll().subscribe({
      next: (prestamos) => {
        this.prestamos = prestamos;
        this.loadingLoans = false;
      },
      error: (err) => {
        console.error('Error al cargar préstamos:', err);
        this.loadingLoans = false;
      }
    });
  }

  get availableEjemplares(): Ejemplar[] {
    return this.ejemplares.filter((e) => e.disponible);
  }

  createLoan() {
    if (!this.selectedUserId || !this.selectedEjemplarId) {
      alert('Selecciona usuario y ejemplar.');
      return;
    }

    // Validar que el ejemplar siga disponible
    const ejemplar = this.ejemplares.find(e => e.id === this.selectedEjemplarId);
    if (!ejemplar) {
      alert('El ejemplar seleccionado no existe. Por favor, recarga la página.');
      this.loadEjemplares();
      return;
    }
    if (!ejemplar.disponible) {
      alert('El ejemplar seleccionado ya no está disponible. Por favor, selecciona otro ejemplar.');
      this.loadEjemplares();
      this.selectedEjemplarId = null;
      return;
    }

    // Validar que los IDs sean números válidos
    const userId = Number(this.selectedUserId);
    const ejemplarId = Number(this.selectedEjemplarId);
    
    if (isNaN(userId) || userId <= 0) {
      alert('El ID del usuario no es válido. Por favor, selecciona un usuario.');
      return;
    }
    
    if (isNaN(ejemplarId) || ejemplarId <= 0) {
      alert('El ID del ejemplar no es válido. Por favor, selecciona un ejemplar.');
      return;
    }

    const today = this.formatDate(new Date());
    const dueDate = this.formatDate(this.addDays(new Date(), this.loanDays));
    
    const payload: PrestamoPayload = {
      usuario: { id: userId },
      ejemplar: { id: ejemplarId },
      fechaPrestamo: today,
      fechaDevolucion: dueDate,
      devuelto: false
    };
    
    console.log('📤 Creando préstamo con payload:', payload);
    console.log('📤 Usuario ID:', userId, 'Ejemplar ID:', ejemplarId);
    
    this.creatingLoan = true;
    this.loanService
      .create(payload)
      .pipe(finalize(() => (this.creatingLoan = false)))
      .subscribe({
      next: () => {
        this.updateEjemplarAvailability(this.selectedEjemplarId!, false);
        this.selectedUserId = null;
        this.selectedEjemplarId = null;
        this.loadEjemplares();
        this.loadPrestamos();
        alert('Préstamo registrado correctamente');
      },
      error: (err) => {
        console.error('❌ Error al crear préstamo:', err);
        console.error('❌ Error completo:', JSON.stringify(err, null, 2));
        console.error('❌ Status:', err?.status);
        console.error('❌ Error body:', err?.error);
        
        // Recargar ejemplares para actualizar disponibilidad
        this.loadEjemplares();
        
        // Determinar el mensaje de error más específico
        let errorMsg = 'No se pudo registrar el préstamo';
        
        if (err?.status === 0 || err?.status === 500) {
          errorMsg = 'Error de conexión con el servidor. Verifica que el backend esté disponible.';
        } else if (err?.status === 400) {
          // Error de validación - mostrar mensaje detallado del backend
          if (err?.error?.message) {
            errorMsg = err.error.message;
          } else if (err?.error?.error) {
            errorMsg = err.error.error;
          } else if (Array.isArray(err?.error?.errors)) {
            // Si hay múltiples errores de validación
            errorMsg = err.error.errors.map((e: any) => e.message || e.defaultMessage).join(', ');
          } else {
            errorMsg = 'Datos inválidos. Verifica que el usuario y ejemplar sean válidos y que el ejemplar esté disponible.';
          }
        } else if (err?.status === 404) {
          errorMsg = 'El usuario o ejemplar no existe. Por favor, recarga la página.';
        } else if (err?.status === 409) {
          errorMsg = err?.error?.message || 'El ejemplar ya está prestado. Por favor, selecciona otro ejemplar.';
        } else if (err?.error?.message) {
          errorMsg = err.error.message;
        } else if (err?.error?.error) {
          errorMsg = err.error.error;
        } else if (err?.message) {
          errorMsg = err.message;
        }
        
        alert(`Error: ${errorMsg}`);
        }
      });
  }

  private updateEjemplarAvailability(ejemplarId: number, disponible: boolean) {
    const ejemplar = this.ejemplares.find((e) => e.id === ejemplarId);
    if (!ejemplar) {
      this.loadEjemplares();
      return;
    }
    const payload = { ...ejemplar, disponible };
    this.ejemplarService.update(payload).subscribe({
      next: () => this.loadEjemplares(),
      error: (err) => console.error('Error al actualizar ejemplar:', err)
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }
}
