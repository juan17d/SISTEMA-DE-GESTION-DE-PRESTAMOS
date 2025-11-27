import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { EditorialService, Editorial } from '../../../services/editorial.service';

@Component({
  selector: 'app-editorials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editorials.component.html',
  styleUrls: ['./editorials.component.scss']
})
export class EditorialsComponent implements OnInit {
  editoriales: Editorial[] = [];
  editingEditorial: Editorial | null = null;
  showForm = false;
  editorialNombre = '';
  loading = false;
  submitting = false;

  constructor(private editorialService: EditorialService) {}

  ngOnInit() {
    this.loadEditoriales();
  }

  loadEditoriales() {
    this.loading = true;
    this.editorialService.getAll().subscribe({
      next: (editoriales) => {
        this.editoriales = editoriales;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar editoriales:', err);
        this.loading = false;
      }
    });
  }

  createEditorial() {
    this.editingEditorial = null;
    this.editorialNombre = '';
    this.showForm = true;
  }

  editEditorial(editorial: Editorial) {
    this.editingEditorial = editorial;
    this.editorialNombre = editorial.nombre;
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.editingEditorial = null;
    this.editorialNombre = '';
  }

  saveEditorial() {
    if (!this.editorialNombre.trim()) {
      alert('Ingresa el nombre de la editorial.');
      return;
    }

    this.submitting = true;
    if (this.editingEditorial) {
      this.editorialService
        .update(this.editingEditorial.id, this.editorialNombre.trim())
        .pipe(finalize(() => (this.submitting = false)))
        .subscribe({
          next: () => {
            this.loadEditoriales();
            this.cancelForm();
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
        .pipe(finalize(() => (this.submitting = false)))
        .subscribe({
          next: () => {
            this.loadEditoriales();
            this.cancelForm();
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
}
