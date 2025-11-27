import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { GeneroService, Genero } from '../../../services/genero.service';

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss']
})
export class GenresComponent implements OnInit {
  generos: Genero[] = [];
  editingGenero: Genero | null = null;
  showForm = false;
  generoNombre = '';
  loading = false;
  submitting = false;

  constructor(private generoService: GeneroService) {}

  ngOnInit() {
    this.loadGeneros();
  }

  loadGeneros() {
    this.loading = true;
    this.generoService.getAll().subscribe({
      next: (generos) => {
        this.generos = generos;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar géneros:', err);
        this.loading = false;
      }
    });
  }

  createGenero() {
    this.editingGenero = null;
    this.generoNombre = '';
    this.showForm = true;
  }

  editGenero(genero: Genero) {
    this.editingGenero = genero;
    this.generoNombre = genero.nombre;
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.editingGenero = null;
    this.generoNombre = '';
  }

  saveGenero() {
    if (!this.generoNombre.trim()) {
      alert('Ingresa el nombre del género.');
      return;
    }

    this.submitting = true;
    if (this.editingGenero) {
      this.generoService
        .update(this.editingGenero.id, this.generoNombre.trim())
        .pipe(finalize(() => (this.submitting = false)))
        .subscribe({
          next: () => {
            this.loadGeneros();
            this.cancelForm();
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
        .pipe(finalize(() => (this.submitting = false)))
        .subscribe({
          next: () => {
            this.loadGeneros();
            this.cancelForm();
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
}
