import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, Usuario } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: Usuario[] = [];
  loading = true;
  error: string | null = null;
  editingUser: Usuario | null = null;
  showEditForm = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = 'No se pudieron cargar los usuarios. Verifica que el backend esté corriendo.';
        this.loading = false;
      }
    });
  }

  editUser(user: Usuario) {
    this.editingUser = { ...user };
    this.showEditForm = true;
  }

  cancelEdit() {
    this.editingUser = null;
    this.showEditForm = false;
  }

  saveUser() {
    if (!this.editingUser) return;

    this.userService.updateUser(this.editingUser.id, this.editingUser).subscribe({
      next: () => {
        this.loadUsers();
        this.cancelEdit();
        alert('Usuario actualizado correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        alert('Error al actualizar el usuario');
      }
    });
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

}
