import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { UserService, Usuario, UsuarioCreatePayload, UsuarioUpdatePayload } from '../../../services/user.service';
import { EjemplarService, Ejemplar, EjemplarPayload } from '../../../services/ejemplar.service';
import { LoanService, Prestamo, PrestamoPayload } from '../../../services/loan.service';
import { AuthorService, Autor } from '../../../services/author.service';
import { EditorialService, Editorial } from '../../../services/editorial.service';
import { GeneroService, Genero } from '../../../services/genero.service';
import { BookService, Libro, LibroPayload } from '../../../services/book.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  // Exponer Math para uso en templates
  Math = Math;

  // Configuración del sistema
  systemName = 'Sistema de Biblioteca';
  loanDays = 15;

  // Préstamos
  users: Usuario[] = [];
  loadingUsers = false;
  usersError: string | null = null;
  editingUser: Usuario | null = null;
  showUserForm = false;
  submittingUser = false;
  ejemplares: Ejemplar[] = [];
  prestamos: Prestamo[] = [];
  selectedUserId: number | null = null;
  selectedEjemplarId: number | null = null;
  loadingLoans = false;
  errorLoans: string | null = null;
  creatingLoan = false;
  returningLoanId: number | null = null;

  
  autores: Autor[] = [];
  editingAutor: Autor | null = null;
  showAutorForm = false;
  autorNombre = '';
  loadingAutores = false;
  submittingAutor = false;

  
  editoriales: Editorial[] = [];
  editingEditorial: Editorial | null = null;
  showEditorialForm = false;
  editorialNombre = '';
  loadingEditoriales = false;
  submittingEditorial = false;


  generos: Genero[] = [];
  editingGenero: Genero | null = null;
  showGeneroForm = false;
  generoNombre = '';
  loadingGeneros = false;
  submittingGenero = false;


  ejemplaresList: Ejemplar[] = [];
  editingEjemplar: Ejemplar | null = null;
  showEjemplarForm = false;
  ejemplarCodigo = '';
  ejemplarDisponible = true;
  selectedLibroId: number | null = null;
  libros: Libro[] = [];
  loadingEjemplares = false;
  submittingEjemplar = false;


  editingBook: Libro | null = null;
  showBookForm = false;
  bookTitulo = '';
  selectedBookAuthorIds: number[] = [];
  selectedBookEditorialId: number | null = null;
  selectedBookGeneroId: number | null = null;
  newBookAuthorName = '';
  newBookEditorialName = '';
  newBookGeneroName = '';
  addingBookAuthor = false;
  addingBookEditorial = false;
  addingBookGenero = false;
  loadingBooks = false;
  submittingBook = false;


  activeTab: 'usuarios' | 'prestamos' | 'autores' | 'editoriales' | 'generos' | 'ejemplares' | 'libros' = 'prestamos';

  constructor(
    private userService: UserService,
    private ejemplarService: EjemplarService,
    private loanService: LoanService,
    private authorService: AuthorService,
    private editorialService: EditorialService,
    private generoService: GeneroService,
    private bookService: BookService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadEjemplares();
    this.loadAutores();
    this.loadEditoriales();
    this.loadGeneros();
    this.loadLibros();
    this.loadEjemplaresList();
    this.loadBooks();

    // Cargar todos los préstamos en el servicio (BehaviorSubject compartido)
    this.loanService.loadAll();

    // Suscribirse al estado reactivo de préstamos del servicio
    this.loanService.loans$.subscribe((list) => {
      if (list === null) return;
      this.prestamos = list;
      this.loadingLoans = false;
    });

    // Forzar carga inicial
    this.loanService.loadAll();
  }


  get availableEjemplares(): Ejemplar[] {
    return this.ejemplares.filter((e) => e.disponible);
  }

  private loadUsers() {
    this.loadingUsers = true;
    this.usersError = null;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('✅ Usuarios cargados:', users.length, 'usuarios');
        this.users = users;
        this.loadingUsers = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar usuarios:', err);
        this.usersError = 'No se pudieron cargar los usuarios. Verifica que el backend esté disponible.';
        this.loadingUsers = false;
      }
    });
  }

  private loadEjemplares() {
    this.ejemplarService.getAll().subscribe({
      next: (ejemplares) => {
        console.log('✅ Ejemplares cargados:', ejemplares.length, 'ejemplares');
        console.log('✅ Ejemplares disponibles:', ejemplares.filter(e => e.disponible).length);
        this.ejemplares = ejemplares;
      },
      error: (err) => {
        console.error('❌ Error al cargar ejemplares:', err);
      }
    });
  }

  private loadPrestamos() {
    this.loadingLoans = true;
    this.errorLoans = null;
    this.loanService.getAll().subscribe({
      next: (prestamos) => {
        this.prestamos = prestamos;
        this.loadingLoans = false;
      },
      error: (err) => {
        console.error('Error al cargar préstamos:', err);
        this.errorLoans = 'No se pudieron cargar los préstamos.';
        this.loadingLoans = false;
      }
    });
  }

  createLoan() {
    console.log('🔍 Iniciando creación de préstamo...');
    console.log('🔍 selectedUserId:', this.selectedUserId, 'tipo:', typeof this.selectedUserId);
    console.log('🔍 selectedEjemplarId:', this.selectedEjemplarId, 'tipo:', typeof this.selectedEjemplarId);
    console.log('🔍 users disponibles:', this.users.length);
    console.log('🔍 ejemplares disponibles:', this.ejemplares.length);
    console.log('🔍 availableEjemplares:', this.availableEjemplares.length);
    
    if (!this.selectedUserId || !this.selectedEjemplarId) {
      alert('Selecciona usuario y ejemplar.');
      return;
    }

    // Validar que el usuario existe
    const usuario = this.users.find(u => u.id === this.selectedUserId);
    if (!usuario) {
      console.error('❌ Usuario no encontrado en la lista local');
      alert('El usuario seleccionado no existe. Por favor, recarga la página.');
      this.loadUsers();
      return;
    }
    console.log('✅ Usuario encontrado:', usuario);

    // Validar que el ejemplar existe y está disponible
    const ejemplar = this.ejemplares.find(e => e.id === this.selectedEjemplarId);
    if (!ejemplar) {
      console.error('❌ Ejemplar no encontrado en la lista local');
      alert('El ejemplar seleccionado no existe. Por favor, recarga la página.');
      this.loadEjemplares();
      return;
    }
    console.log('✅ Ejemplar encontrado:', ejemplar);
    
    if (!ejemplar.disponible) {
      console.error('❌ Ejemplar no disponible:', ejemplar);
      alert('El ejemplar seleccionado ya no está disponible. Por favor, selecciona otro ejemplar.');
      this.loadEjemplares();
      this.selectedEjemplarId = null;
      return;
    }
    console.log('✅ Ejemplar está disponible');

    // Validar que los IDs sean números válidos
    const userId = Number(this.selectedUserId);
    const ejemplarId = Number(this.selectedEjemplarId);
    
    console.log('🔍 IDs convertidos - userId:', userId, 'ejemplarId:', ejemplarId);
    
    if (isNaN(userId) || userId <= 0) {
      console.error('❌ userId inválido:', userId);
      alert('El ID del usuario no es válido. Por favor, selecciona un usuario.');
      return;
    }
    
    if (isNaN(ejemplarId) || ejemplarId <= 0) {
      console.error('❌ ejemplarId inválido:', ejemplarId);
      alert('El ID del ejemplar no es válido. Por favor, selecciona un ejemplar.');
      return;
    }

    const today = this.formatDate(new Date());
    const dueDate = this.formatDate(this.addDays(new Date(), this.loanDays));
    
    console.log('🔍 Fechas - hoy:', today, 'vencimiento:', dueDate);
    
    const payload: PrestamoPayload = {
      usuario: { id: userId },
      ejemplar: { id: ejemplarId },
      fechaPrestamo: today,
      fechaDevolucion: dueDate,
      devuelto: false
    };
    
    console.log('📤 Creando préstamo con payload completo:', JSON.stringify(payload, null, 2));
    console.log('📤 Usuario ID:', userId, 'Ejemplar ID:', ejemplarId);
    console.log('📤 URL del servicio:', 'http://localhost:8080/api/prestamos');
    
    this.creatingLoan = true;
    this.loanService
      .create(payload)
      .pipe(finalize(() => (this.creatingLoan = false)))
      .subscribe({
        next: (created) => {
          // Si el backend devuelve el préstamo creado, la lista reactiva ya se actualizó en el servicio.
          this.selectedUserId = null;
          this.selectedEjemplarId = null;
          this.updateEjemplarAvailability(created.ejemplar.id, false);
          this.loadEjemplares(); // Recargar ejemplares para actualizar disponibilidad
          alert('Préstamo registrado correctamente');
        },
        error: (err) => {
          console.error('❌ ========== ERROR AL CREAR PRÉSTAMO ==========');
          console.error('❌ Error completo:', err);
          console.error('❌ Status HTTP:', err?.status);
          console.error('❌ Status Text:', err?.statusText);
          console.error('❌ Error body completo:', err?.error);
          console.error('❌ Error body JSON:', JSON.stringify(err?.error, null, 2));
          console.error('❌ URL:', err?.url);
          console.error('❌ Payload enviado:', payload);
          console.error('❌ ============================================');
          
          // Recargar datos para asegurar que estén actualizados
          this.loadEjemplares();
          this.loadUsers();
          
          // Determinar el mensaje de error más específico
          let errorMsg = 'No se pudo registrar el préstamo';
          
          if (err?.status === 0) {
            errorMsg = 'Error de conexión. Verifica que el backend esté corriendo en http://localhost:8080';
          } else if (err?.status === 500) {
            errorMsg = 'Error interno del servidor. Revisa los logs del backend.';
          } else if (err?.status === 400) {
            // Error de validación - mostrar mensaje detallado del backend
            console.log('🔍 Procesando error 400 - detalles:', {
              message: err?.error?.message,
              error: err?.error?.error,
              errors: err?.error?.errors
            });
            
            if (err?.error?.message) {
              errorMsg = err.error.message;
            } else if (err?.error?.error) {
              errorMsg = err.error.error;
            } else if (Array.isArray(err?.error?.errors) && err.error.errors.length > 0) {
              // Si hay múltiples errores de validación
              const errorMessages = err.error.errors.map((e: any) => {
                return e.message || e.defaultMessage || JSON.stringify(e);
              });
              errorMsg = errorMessages.join(', ');
            } else {
              // Mensaje genérico con información adicional
              errorMsg = `Error de validación (400). Verifica que:
- El usuario ID ${userId} existe en el sistema
- El ejemplar ID ${ejemplarId} existe y está disponible
- Las fechas son válidas`;
            }
          } else if (err?.status === 404) {
            errorMsg = `No se encontró el recurso. Verifica que el usuario (ID: ${userId}) y ejemplar (ID: ${ejemplarId}) existan.`;
          } else if (err?.status === 409) {
            errorMsg = err?.error?.message || 'El ejemplar ya está prestado o hay un conflicto. Por favor, selecciona otro ejemplar.';
          } else if (err?.error?.message) {
            errorMsg = err.error.message;
          } else if (err?.error?.error) {
            errorMsg = err.error.error;
          } else if (err?.message) {
            errorMsg = err.message;
          }
          
          console.error('❌ Mensaje de error final:', errorMsg);
          alert(`Error: ${errorMsg}`);
        }
      });
  }

  deleteLoan(prestamo: Prestamo) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el préstamo del libro "${prestamo.ejemplar.libro.titulo}"?`)) {
      return;
    }
    this.loanService.delete(prestamo.id).subscribe({
      next: () => {
        if (!prestamo.devuelto) {
          this.updateEjemplarAvailability(prestamo.ejemplar.id, true);
        }
        this.loadPrestamos();
        this.loadEjemplares();
        alert('Préstamo eliminado correctamente');
      },
      error: (err) => {
        console.error('Error al eliminar préstamo:', err);
        alert('Error al eliminar el préstamo');
      }
    });
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

  markAsReturned(prestamo: Prestamo) {
    this.returningLoanId = prestamo.id;
    const payload: PrestamoPayload = {
      usuario: { id: prestamo.usuario.id },
      ejemplar: { id: prestamo.ejemplar.id },
      fechaPrestamo: prestamo.fechaPrestamo,
      fechaDevolucion: this.formatDate(new Date()),
      devuelto: true
    };
    this.loanService
      .update(prestamo.id, payload)
      .pipe(finalize(() => (this.returningLoanId = null)))
      .subscribe({
      next: () => {
        this.updateEjemplarAvailability(prestamo.ejemplar.id, true);
        this.loadPrestamos();
        alert('Préstamo marcado como devuelto');
      },
      error: (err) => {
        console.error('Error al actualizar préstamo:', err);
        alert('No se pudo actualizar el préstamo');
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

  
  loadAutores() {
    this.loadingAutores = true;
    this.authorService.getAll().subscribe({
      next: (autores) => {
        this.autores = autores;
        this.loadingAutores = false;
      },
      error: (err) => {
        console.error('Error al cargar autores:', err);
        this.loadingAutores = false;
      }
    });
  }

  createAutor() {
    this.editingAutor = null;
    this.autorNombre = '';
    this.showAutorForm = true;
  }

  editAutor(autor: Autor) {
    this.editingAutor = { ...autor };
    this.autorNombre = autor.nombre;
    this.showAutorForm = true;
  }

  cancelAutorForm() {
    this.showAutorForm = false;
    this.editingAutor = null;
    this.autorNombre = '';
  }

  saveAutor() {
    if (!this.autorNombre.trim()) {
      alert('Ingresa el nombre del autor.');
      return;
    }

    this.submittingAutor = true;
    if (this.editingAutor) {
      this.authorService
        .update(this.editingAutor.id, this.autorNombre.trim())
        .pipe(finalize(() => (this.submittingAutor = false)))
        .subscribe({
          next: () => {
            this.loadAutores();
            this.cancelAutorForm();
            alert('Autor actualizado correctamente');
          },
          error: (err) => {
            console.error('Error al actualizar autor:', err);
            alert('Error al actualizar el autor');
          }
        });
    } else {
      this.authorService
        .create(this.autorNombre.trim())
        .pipe(finalize(() => (this.submittingAutor = false)))
        .subscribe({
          next: () => {
            this.loadAutores();
            this.cancelAutorForm();
            alert('Autor creado correctamente');
          },
          error: (err) => {
            console.error('Error al crear autor:', err);
            alert('Error al crear el autor');
          }
        });
    }
  }

  deleteAutor(autor: Autor) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el autor "${autor.nombre}"?`)) {
      return;
    }

    this.authorService.delete(autor.id).subscribe({
      next: () => {
        this.loadAutores();
        alert('Autor eliminado correctamente');
      },
      error: (err) => {
        console.error('Error al eliminar autor:', err);
        alert('Error al eliminar el autor');
      }
    });
  }

  
  loadEditoriales() {
    this.loadingEditoriales = true;
    this.editorialService.getAll().subscribe({
      next: (editoriales) => {
        this.editoriales = editoriales;
        this.loadingEditoriales = false;
      },
      error: (err) => {
        console.error('Error al cargar editoriales:', err);
        this.loadingEditoriales = false;
      }
    });
  }

  createEditorial() {
    this.editingEditorial = null;
    this.editorialNombre = '';
    this.showEditorialForm = true;
  }

  editEditorial(editorial: Editorial) {
    this.editingEditorial = { ...editorial };
    this.editorialNombre = editorial.nombre;
    this.showEditorialForm = true;
  }

  cancelEditorialForm() {
    this.showEditorialForm = false;
    this.editingEditorial = null;
    this.editorialNombre = '';
  }

  saveEditorial() {
    if (!this.editorialNombre.trim()) {
      alert('Ingresa el nombre de la editorial.');
      return;
    }

    this.submittingEditorial = true;
    if (this.editingEditorial) {
      this.editorialService
        .update(this.editingEditorial.id, this.editorialNombre.trim())
        .pipe(finalize(() => (this.submittingEditorial = false)))
        .subscribe({
          next: () => {
            this.loadEditoriales();
            this.cancelEditorialForm();
            alert('Editorial actualizada correctamente');
          },
          error: (err) => {
            console.error('Error al actualizar editorial:', err);
            alert('Error al actualizar la editorial');
          }
        });
    } else {
      this.editorialService
        .create(this.editorialNombre.trim())
        .pipe(finalize(() => (this.submittingEditorial = false)))
        .subscribe({
          next: () => {
            this.loadEditoriales();
            this.cancelEditorialForm();
            alert('Editorial creada correctamente');
          },
          error: (err) => {
            console.error('Error al crear editorial:', err);
            alert('Error al crear la editorial');
          }
        });
    }
  }

  deleteEditorial(editorial: Editorial) {
    if (!confirm(`¿Estás seguro de que deseas eliminar la editorial "${editorial.nombre}"?`)) {
      return;
    }

    this.editorialService.delete(editorial.id).subscribe({
      next: () => {
        this.loadEditoriales();
        alert('Editorial eliminada correctamente');
      },
      error: (err) => {
        console.error('Error al eliminar editorial:', err);
        alert('Error al eliminar la editorial');
      }
    });
  }


  loadGeneros() {
    this.loadingGeneros = true;
    this.generoService.getAll().subscribe({
      next: (generos) => {
        this.generos = generos;
        this.loadingGeneros = false;
      },
      error: (err) => {
        console.error('Error al cargar géneros:', err);
        this.loadingGeneros = false;
      }
    });
  }

  createGenero() {
    this.editingGenero = null;
    this.generoNombre = '';
    this.showGeneroForm = true;
  }

  editGenero(genero: Genero) {
    this.editingGenero = { ...genero };
    this.generoNombre = genero.nombre;
    this.showGeneroForm = true;
  }

  cancelGeneroForm() {
    this.showGeneroForm = false;
    this.editingGenero = null;
    this.generoNombre = '';
  }

  saveGenero() {
    if (!this.generoNombre.trim()) {
      alert('Ingresa el nombre del género.');
      return;
    }

    this.submittingGenero = true;
    if (this.editingGenero) {
      this.generoService
        .update(this.editingGenero.id, this.generoNombre.trim())
        .pipe(finalize(() => (this.submittingGenero = false)))
        .subscribe({
          next: () => {
            this.loadGeneros();
            this.cancelGeneroForm();
            alert('Género actualizado correctamente');
          },
          error: (err) => {
            console.error('Error al actualizar género:', err);
            alert('Error al actualizar el género');
          }
        });
    } else {
      this.generoService
        .create(this.generoNombre.trim())
        .pipe(finalize(() => (this.submittingGenero = false)))
        .subscribe({
          next: () => {
            this.loadGeneros();
            this.cancelGeneroForm();
            alert('Género creado correctamente');
          },
          error: (err) => {
            console.error('Error al crear género:', err);
            alert('Error al crear el género');
          }
        });
    }
  }

  deleteGenero(genero: Genero) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el género "${genero.nombre}"?`)) {
      return;
    }

    this.generoService.delete(genero.id).subscribe({
      next: () => {
        this.loadGeneros();
        alert('Género eliminado correctamente');
      },
      error: (err) => {
        console.error('Error al eliminar género:', err);
        alert('Error al eliminar el género');
      }
    });
  }

  
  loadLibros() {
    this.bookService.getAllBooks().subscribe({
      next: (libros) => (this.libros = libros),
      error: (err) => console.error('Error al cargar libros:', err)
    });
  }

  loadEjemplaresList() {
    this.loadingEjemplares = true;
    this.ejemplarService.getAll().subscribe({
      next: (ejemplares) => {
        this.ejemplaresList = ejemplares;
        this.loadingEjemplares = false;
      },
      error: (err) => {
        console.error('Error al cargar ejemplares:', err);
        this.loadingEjemplares = false;
      }
    });
  }

  createEjemplar() {
    this.editingEjemplar = null;
    this.ejemplarCodigo = '';
    this.ejemplarDisponible = true;
    this.selectedLibroId = null;
    this.showEjemplarForm = true;
  }

  editEjemplar(ejemplar: Ejemplar) {
    this.editingEjemplar = { ...ejemplar };
    this.ejemplarCodigo = ejemplar.codigo;
    this.ejemplarDisponible = ejemplar.disponible;
    this.selectedLibroId = ejemplar.libro.id;
    this.showEjemplarForm = true;
  }

  cancelEjemplarForm() {
    this.showEjemplarForm = false;
    this.editingEjemplar = null;
    this.ejemplarCodigo = '';
    this.ejemplarDisponible = true;
    this.selectedLibroId = null;
  }

  saveEjemplar() {
    if (!this.ejemplarCodigo.trim()) {
      alert('Ingresa el código del ejemplar.');
      return;
    }
    if (!this.selectedLibroId) {
      alert('Selecciona un libro.');
      return;
    }

    this.submittingEjemplar = true;
    const payload: EjemplarPayload = {
      codigo: this.ejemplarCodigo.trim(),
      disponible: this.ejemplarDisponible,
      libro: { id: this.selectedLibroId! }
    };

    if (this.editingEjemplar) {
      const updatedEjemplar: Ejemplar = {
        ...this.editingEjemplar,
        codigo: payload.codigo,
        disponible: payload.disponible,
        libro: this.libros.find(l => l.id === payload.libro.id)!
      };
      this.ejemplarService
        .update(updatedEjemplar)
        .pipe(finalize(() => (this.submittingEjemplar = false)))
        .subscribe({
          next: () => {
            this.loadEjemplaresList();
            this.loadEjemplares();
            this.cancelEjemplarForm();
            alert('Ejemplar actualizado correctamente');
          },
          error: (err) => {
            console.error('Error al actualizar ejemplar:', err);
            alert('Error al actualizar el ejemplar');
          }
        });
    } else {
      this.ejemplarService
        .create(payload)
        .pipe(finalize(() => (this.submittingEjemplar = false)))
        .subscribe({
          next: () => {
            this.loadEjemplaresList();
            this.loadEjemplares();
            this.cancelEjemplarForm();
            alert('Ejemplar creado correctamente');
          },
          error: (err) => {
            console.error('Error al crear ejemplar:', err);
            alert('Error al crear el ejemplar');
          }
        });
    }
  }

  deleteEjemplar(ejemplar: Ejemplar) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el ejemplar "${ejemplar.codigo}"?`)) {
      return;
    }

    this.ejemplarService.delete(ejemplar.id).subscribe({
      next: () => {
        this.loadEjemplaresList();
        this.loadEjemplares();
        alert('Ejemplar eliminado correctamente');
      },
      error: (err) => {
        console.error('Error al eliminar ejemplar:', err);
        alert('Error al eliminar el ejemplar');
      }
    });
  }


  createUser() {
    this.editingUser = {
      id: 0,
      nombre: '',
      correo: '',
      password: '',
      rol: undefined
    };
    this.showUserForm = true;
  }

  editUser(user: Usuario) {
    this.editingUser = { ...user, password: '' };
    this.showUserForm = true;
  }

  cancelUserForm() {
    this.editingUser = null;
    this.showUserForm = false;
  }

  saveUser() {
    if (!this.editingUser) {
      return;
    }

    if (!this.editingUser.nombre?.trim() || !this.editingUser.correo?.trim()) {
      alert('Nombre y correo son obligatorios.');
      return;
    }

    this.submittingUser = true;
    
    if (this.editingUser.id === 0) {
      // Crear nuevo usuario - NO incluir el ID en el payload
      if (!this.editingUser.password?.trim()) {
        alert('La contraseña es obligatoria para crear un nuevo usuario.');
        this.submittingUser = false;
        return;
      }
      
      // Crear payload sin ID (el backend lo asignará)
      const createPayload: UsuarioCreatePayload = {
        nombre: this.editingUser.nombre.trim(),
        correo: this.editingUser.correo.trim(),
        password: this.editingUser.password.trim()
      };
      
      // Solo incluir rol si está definido y tiene ID
      if (this.editingUser.rol?.id) {
        createPayload.rol = { id: this.editingUser.rol.id };
      }
      
      console.log('📤 Creando usuario con payload:', createPayload);
      
      this.userService
        .createUser(createPayload)
        .pipe(finalize(() => (this.submittingUser = false)))
        .subscribe({
          next: () => {
            this.loadUsers();
            this.cancelUserForm();
            alert('Usuario creado correctamente');
          },
          error: (err) => {
            console.error('❌ Error al crear usuario:', err);
            console.error('❌ Error completo:', JSON.stringify(err, null, 2));
            
            let errorMsg = 'Error al crear el usuario';
            if (err?.error?.message) {
              errorMsg = err.error.message;
            } else if (err?.error?.error) {
              errorMsg = err.error.error;
            } else if (err?.message) {
              errorMsg = err.message;
            }
            
            alert(`Error: ${errorMsg}`);
          }
        });
    } else {
      // Actualizar usuario existente
      const updatePayload: UsuarioUpdatePayload = {
        nombre: this.editingUser.nombre.trim(),
        correo: this.editingUser.correo.trim()
      };
      
      // Solo incluir password si se proporcionó uno nuevo
      if (this.editingUser.password?.trim()) {
        updatePayload.password = this.editingUser.password.trim();
      }
      
      // Incluir rol si está definido
      if (this.editingUser.rol?.id) {
        updatePayload.rol = { id: this.editingUser.rol.id };
      }
      
      console.log('📤 Actualizando usuario ID:', this.editingUser.id, 'con payload:', updatePayload);
      
      this.userService
        .updateUser(this.editingUser.id, updatePayload)
        .pipe(finalize(() => (this.submittingUser = false)))
        .subscribe({
          next: () => {
            this.loadUsers();
            this.cancelUserForm();
            alert('Usuario actualizado correctamente');
          },
          error: (err) => {
            console.error('❌ Error al actualizar usuario:', err);
            const errorMsg = err?.error?.message || err?.error?.error || 'Error al actualizar el usuario';
            alert(`Error: ${errorMsg}`);
          }
        });
    }
  }

  deleteUser(user: Usuario) {
    if (!confirm(`¿Estás seguro de que deseas eliminar al usuario ${user.nombre}?`)) {
      return;
    }

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.loadUsers();
        alert('Usuario eliminado correctamente');
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        alert('Error al eliminar el usuario');
      }
    });
  }

  getRoleName(user: Usuario): string {
    return user.rol?.nombre || 'Sin rol';
  }


  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }


  loadBooks() {
    this.loadingBooks = true;
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.libros = books;
        this.loadingBooks = false;
      },
      error: (err) => {
        console.error('Error al cargar libros:', err);
        this.loadingBooks = false;
      }
    });
  }

  createBook() {
    this.editingBook = null;
    this.bookTitulo = '';
    this.selectedBookAuthorIds = [];
    this.selectedBookEditorialId = null;
    this.selectedBookGeneroId = null;
    this.showBookForm = true;
  }

  editBook(book: Libro) {
    this.editingBook = { ...book };
    this.bookTitulo = book.titulo;
    this.selectedBookAuthorIds = book.autores?.map((a) => a.id) ?? [];
    this.selectedBookEditorialId = book.editorial?.id ?? null;
    this.selectedBookGeneroId = book.genero?.id ?? null;
    this.showBookForm = true;
  }

  cancelBookForm() {
    this.showBookForm = false;
    this.editingBook = null;
    this.bookTitulo = '';
    this.selectedBookAuthorIds = [];
    this.selectedBookEditorialId = null;
    this.selectedBookGeneroId = null;
    this.newBookAuthorName = '';
    this.newBookEditorialName = '';
    this.newBookGeneroName = '';
  }

  saveBook() {
    if (!this.bookTitulo.trim()) {
      alert('Ingresa el título del libro.');
      return;
    }
    if (!this.selectedBookEditorialId) {
      alert('Selecciona una editorial.');
      return;
    }
    if (!this.selectedBookGeneroId) {
      alert('Selecciona un género.');
      return;
    }
    if (this.selectedBookAuthorIds.length === 0) {
      alert('Selecciona al menos un autor.');
      return;
    }

    this.submittingBook = true;
    
    const payload: LibroPayload = {
      titulo: this.bookTitulo.trim(),
      autores: this.selectedBookAuthorIds.map((id) => ({ id })),
      editorial: this.selectedBookEditorialId ? { id: this.selectedBookEditorialId } : null,
      genero: this.selectedBookGeneroId ? { id: this.selectedBookGeneroId } : null
    };

    if (this.editingBook) {
      this.bookService
        .updateBook(this.editingBook.id, payload)
        .pipe(finalize(() => (this.submittingBook = false)))
        .subscribe({
          next: () => {
            this.loadBooks();
            this.loadLibros(); 
            this.cancelBookForm();
            alert('Libro actualizado correctamente');
          },
          error: (err) => {
            console.error('Error al actualizar libro:', err);
            const errorMessage = err?.error?.message || err?.message || 'Error desconocido';
            alert(`Error al actualizar el libro: ${errorMessage}`);
          }
        });
    } else {
      this.bookService
        .createBook(payload)
        .pipe(finalize(() => (this.submittingBook = false)))
        .subscribe({
          next: () => {
            this.loadBooks();
            this.loadLibros(); 
            this.cancelBookForm();
            alert('Libro creado correctamente');
          },
          error: (err) => {
            console.error('Error al crear libro:', err);
            const errorMessage = err?.error?.message || err?.error?.error || err?.message || 'Error desconocido';
            alert(`Error al crear el libro: ${errorMessage}`);
          }
        });
    }
  }

  deleteBook(book: Libro) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el libro "${book.titulo}"?`)) {
      return;
    }

    this.bookService.deleteBook(book.id).subscribe({
      next: () => {
        this.loadBooks();
        this.loadLibros(); 
        alert('Libro eliminado correctamente');
      },
      error: (err) => {
        console.error('Error al eliminar libro:', err);
        alert('Error al eliminar el libro');
      }
    });
  }

  addNewBookAuthor() {
    const nombre = this.newBookAuthorName.trim();
    if (!nombre) {
      alert('Ingresa el nombre del autor.');
      return;
    }
    this.addingBookAuthor = true;
    this.authorService.create(nombre).subscribe({
      next: (autor) => {
        this.autores.push(autor);
        this.selectedBookAuthorIds = [...this.selectedBookAuthorIds, autor.id];
        this.newBookAuthorName = '';
      },
      error: (err) => {
        console.error('Error al crear autor:', err);
        alert('No se pudo crear el autor.');
      },
      complete: () => (this.addingBookAuthor = false)
    });
  }

  addNewBookEditorial() {
    const nombre = this.newBookEditorialName.trim();
    if (!nombre) {
      alert('Ingresa el nombre de la editorial.');
      return;
    }
    this.addingBookEditorial = true;
    this.editorialService.create(nombre).subscribe({
      next: (editorial) => {
        this.editoriales.push(editorial);
        this.selectedBookEditorialId = editorial.id;
        this.newBookEditorialName = '';
      },
      error: (err) => {
        console.error('Error al crear editorial:', err);
        alert('No se pudo crear la editorial.');
      },
      complete: () => (this.addingBookEditorial = false)
    });
  }

  addNewBookGenero() {
    const nombre = this.newBookGeneroName.trim();
    if (!nombre) {
      alert('Ingresa el nombre del género.');
      return;
    }
    this.addingBookGenero = true;
    this.generoService.create(nombre).subscribe({
      next: (genero) => {
        this.generos.push(genero);
        this.selectedBookGeneroId = genero.id;
        this.newBookGeneroName = '';
      },
      error: (err) => {
        console.error('Error al crear género:', err);
        alert('No se pudo crear el género.');
      },
      complete: () => (this.addingBookGenero = false)
    });
  }

  getAuthorsString(book: Libro): string {
    if (!book.autores || book.autores.length === 0) {
      return 'Sin autor';
    }
    return book.autores.map(a => a.nombre).join(', ');
  }

  getEditorialName(book: Libro): string {
    return book.editorial?.nombre || 'Sin editorial';
  }

  getGeneroName(book: Libro): string {
    return book.genero?.nombre || 'Sin género';
  }

  setActiveTab(tab: 'usuarios' | 'prestamos' | 'autores' | 'editoriales' | 'generos' | 'ejemplares' | 'libros') {
    this.activeTab = tab;
  }
}
