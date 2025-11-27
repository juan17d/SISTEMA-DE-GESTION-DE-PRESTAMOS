import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

// Login
import { LoginComponent } from './auth/login/login.component';

// Dashboards
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { BibliotecarioDashboardComponent } from './dashboard/bibliotecario-dashboard/bibliotecario-dashboard.component';
import { ClienteDashboardComponent } from './dashboard/cliente-dashboard/cliente-dashboard.component';

import { SettingsComponent } from './dashboard/admin-dashboard/settings/settings.component';
import { BooksComponent } from './dashboard/admin-dashboard/books/books.component';
import { AuthorsComponent } from './dashboard/admin-dashboard/catalog/authors.component';
import { EditorialsComponent } from './dashboard/admin-dashboard/catalog/editorials.component';
import { GenresComponent } from './dashboard/admin-dashboard/catalog/genres.component';
import { EjemplaresComponent } from './dashboard/admin-dashboard/ejemplares/ejemplares.component';

// Not Authorized
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: 'settings', component: SettingsComponent },
      { path: 'books', component: BooksComponent },
      { path: 'authors', component: AuthorsComponent },
      { path: 'editorials', component: EditorialsComponent },
      { path: 'genres', component: GenresComponent },
      { path: 'ejemplares', component: EjemplaresComponent },
      { path: '', redirectTo: 'settings', pathMatch: 'full' }
    ]
  },

  {
    path: 'bibliotecario',
    component: BibliotecarioDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['BIBLIOTECARIO'] }
  },

  {
    path: 'cliente',
    component: ClienteDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CLIENTE'] }
  },

  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
