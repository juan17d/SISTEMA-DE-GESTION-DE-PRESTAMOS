import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthorService, Autor } from '../../../services/author.service';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {
  autores: Autor[] = [];
  editingAutor: Autor | null = null;
  showForm = false;
  autorNombre = '';
  loading = false;
  submitting = false;

  constructor(private authorService: AuthorService) {}

  ngOnInit() {
    this.loadAutores();
  }

  loadAutores() {
    this.loading = true;
    this.authorService.getAll().subscribe({
      next: (autores) => {
        this.autores = autores;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar autores:', err);
        this.loading = false;
      }
    });
  }

  createAutor() {
    this.editingAutor = null;
    this.autorNombre = '';
    this.showForm = true;
  }

  editAutor(autor: Autor) {
    this.editingAutor = autor;
    this.autorNombre = autor.nombre;
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.editingAutor = null;
    this.autorNombre = '';
  }

  saveAutor() {
    if (!this.autorNombre.trim()) {
      alert('Ingresa el nombre del autor.');
      return;
    }

    this.submitting = true;
    if (this.editingAutor) {
      this.authorService
        .update(this.editingAutor.id, this.autorNombre.trim())
        .pipe(finalize(() => (this.submitting = false)))
        .subscribe({
          next: () => {
            this.loadAutores();
            this.cancelForm();
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
        .pipe(finalize(() => (this.submitting = false)))
        .subscribe({
          next: () => {
            this.loadAutores();
            this.cancelForm();
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
}
