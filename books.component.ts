import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { BookService, Libro, LibroPayload } from '../../../services/book.service';
import { AuthorService, Autor } from '../../../services/author.service';
import { EditorialService, Editorial } from '../../../services/editorial.service';
import { GeneroService, Genero } from '../../../services/genero.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  books: Libro[] = [];
  authors: Autor[] = [];
  editorials: Editorial[] = [];
  generos: Genero[] = [];
  loading = true;
  error: string | null = null;
  editingBook: Libro | null = null;
  showEditForm = false;
  showCreateForm = false;
  selectedAuthorIds: number[] = [];
  selectedEditorialId: number | null = null;
  selectedGeneroId: number | null = null;
  newAuthorName = '';
  newEditorialName = '';
  newGeneroName = '';
  addingAuthor = false;
  addingEditorial = false;
  addingGenero = false;
  submitting = false;
  authorsExpanded = false;
  selectedAuthorDropdown: number | null = null;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private editorialService: EditorialService,
    private generoService: GeneroService
  ) {}

  ngOnInit() {
    this.loadBooks();
    this.loadMetadata();
  }

  loadBooks() {
    this.loading = true;
    this.error = null;
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar libros:', err);
        this.error = 'No se pudieron cargar los libros. Verifica que el backend esté corriendo.';
        this.loading = false;
      }
    });
  }

  loadMetadata() {
    this.authorService.getAll().subscribe({
      next: (authors) => (this.authors = authors),
      error: (err) => console.error('Error al cargar autores:', err)
    });

    this.editorialService.getAll().subscribe({
      next: (editorials) => {
        console.log('Editoriales cargadas:', editorials);
        this.editorials = editorials;
      },
      error: (err) => {
        console.error('Error al cargar editoriales:', err);
        alert('Error al cargar editoriales. Verifica la consola para más detalles.');
      }
    });

    this.generoService.getAll().subscribe({
      next: (generos) => (this.generos = generos),
      error: (err) => console.error('Error al cargar géneros:', err)
    });
  }

  editBook(book: Libro) {
    this.editingBook = { ...book };
    this.selectedAuthorIds = book.autores?.map((a) => a.id) ?? [];
    this.selectedEditorialId = book.editorial?.id ?? null;
    this.selectedGeneroId = book.genero?.id ?? null;
    this.showEditForm = true;
    this.showCreateForm = false;
  }

  createBook() {
    this.editingBook = {
      id: 0,
      titulo: '',
      stockDisponible: 0,
      autores: [],
      editorial: undefined,
      genero: undefined
    };
    this.selectedAuthorIds = [];
    this.selectedEditorialId = null;
    this.selectedGeneroId = null;
    this.showCreateForm = true;
    this.showEditForm = false;
  }

  cancelEdit() {
    this.editingBook = null;
    this.showEditForm = false;
    this.showCreateForm = false;
    this.selectedAuthorIds = [];
    this.selectedEditorialId = null;
    this.selectedGeneroId = null;
    this.newAuthorName = '';
    this.newEditorialName = '';
    this.newGeneroName = '';
    this.authorsExpanded = false;
  }

  toggleAuthors() {
    this.authorsExpanded = !this.authorsExpanded;
  }

  saveBook() {
    if (!this.editingBook) return;
    if (!this.selectedEditorialId) {
      alert('Selecciona una editorial.');
      return;
    }
    if (!this.selectedGeneroId) {
      alert('Selecciona un género.');
      return;
    }
    if (this.selectedAuthorIds.length === 0) {
      alert('Selecciona al menos un autor.');
      return;
    }

    this.submitting = true;
    const payload: LibroPayload = {
      titulo: this.editingBook.titulo,
      autores: this.selectedAuthorIds.map((id) => ({ id })),
      editorial: this.selectedEditorialId ? { id: this.selectedEditorialId } : null,
      genero: this.selectedGeneroId ? { id: this.selectedGeneroId } : null
    };

    if (this.showCreateForm) {
      this.bookService
        .createBook(payload)
        .pipe(finalize(() => (this.submitting = false)))
        .subscribe({
        next: () => {
          this.loadBooks();
          this.cancelEdit();
          alert('Libro creado correctamente');
        },
        error: (err) => {
          console.error('Error al crear libro:', err);
          const errorMessage = err?.error?.message || err?.message || 'Error desconocido';
          const errorDetails = err?.error?.error || '';
          alert(`Error al crear el libro: ${errorMessage}${errorDetails ? '\n' + errorDetails : ''}`);
          }
        });
    } else {
      this.bookService
        .updateBook(this.editingBook.id, payload)
        .pipe(finalize(() => (this.submitting = false)))
        .subscribe({
        next: () => {
          this.loadBooks();
          this.cancelEdit();
          alert('Libro actualizado correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar libro:', err);
          alert('Error al actualizar el libro');
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
        alert('Libro eliminado correctamente');
      },
      error: (err) => {
        console.error('Error al eliminar libro:', err);
        alert('Error al eliminar el libro');
      }
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

  getSelectedAuthorsNames(): string {
    return this.selectedAuthorIds
      .map(id => this.authors.find(a => a.id === id)?.nombre)
      .filter(Boolean)
      .join(', ');
  }

  addAuthorFromDropdown() {
    if (this.selectedAuthorDropdown && !this.selectedAuthorIds.includes(this.selectedAuthorDropdown)) {
      this.selectedAuthorIds = [...this.selectedAuthorIds, this.selectedAuthorDropdown];
      this.selectedAuthorDropdown = null;
    }
  }

  removeAuthor(id: number) {
    this.selectedAuthorIds = this.selectedAuthorIds.filter(aid => aid !== id);
  }

  getAuthorName(id: number): string {
    return this.authors.find(a => a.id === id)?.nombre || 'Autor desconocido';
  }

  getAvailableAuthors(): Autor[] {
    return this.authors.filter(a => !this.selectedAuthorIds.includes(a.id));
  }

  addNewAuthor() {
    const nombre = this.newAuthorName.trim();
    if (!nombre) {
      alert('Ingresa el nombre del autor.');
      return;
    }
    this.addingAuthor = true;
    this.authorService.create(nombre).subscribe({
      next: (autor) => {
        this.authors.push(autor);
        this.selectedAuthorIds = [...this.selectedAuthorIds, autor.id];
        this.newAuthorName = '';
        this.authorsExpanded = false;
      },
      error: (err) => {
        console.error('Error al crear autor:', err);
        alert('No se pudo crear el autor.');
      },
      complete: () => (this.addingAuthor = false)
    });
  }

  addNewEditorial() {
    const nombre = this.newEditorialName.trim();
    if (!nombre) {
      alert('Ingresa el nombre de la editorial.');
      return;
    }
    this.addingEditorial = true;
    this.editorialService.create(nombre).subscribe({
      next: (editorial) => {
        this.editorials.push(editorial);
        this.selectedEditorialId = editorial.id;
        this.newEditorialName = '';
      },
      error: (err) => {
        console.error('Error al crear editorial:', err);
        alert('No se pudo crear la editorial.');
      },
      complete: () => (this.addingEditorial = false)
    });
  }

  addNewGenero() {
    const nombre = this.newGeneroName.trim();
    if (!nombre) {
      alert('Ingresa el nombre del género.');
      return;
    }
    this.addingGenero = true;
    this.generoService.create(nombre).subscribe({
      next: (genero) => {
        this.generos.push(genero);
        this.selectedGeneroId = genero.id;
        this.newGeneroName = '';
      },
      error: (err) => {
        console.error('Error al crear género:', err);
        alert('No se pudo crear el género.');
      },
      complete: () => (this.addingGenero = false)
    });
  }
}
