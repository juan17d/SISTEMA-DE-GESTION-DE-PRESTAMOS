import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {

  menu = [
    { name: 'Configuración', path: '/admin/settings' },
    { name: 'Libros', path: '/admin/books' },
    { name: 'Autores', path: '/admin/authors' },
    { name: 'Editoriales', path: '/admin/editorials' },
    { name: 'Géneros', path: '/admin/genres' },
    { name: 'Ejemplares', path: '/admin/ejemplares' }
  ];

  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}
