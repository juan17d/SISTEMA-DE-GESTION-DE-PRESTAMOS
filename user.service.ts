import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  password?: string;
  rol?: {
    id: number;
    nombre: string;
  };
}

// Interfaz para crear usuario (sin ID)
export interface UsuarioCreatePayload {
  nombre: string;
  correo: string;
  password: string;
  rol?: { id: number };
}

// Interfaz para actualizar usuario (ID va en la URL)
export interface UsuarioUpdatePayload {
  nombre: string;
  correo: string;
  password?: string;
  rol?: { id: number };
}

@Injectable({ providedIn: 'root' })
export class UserService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/api/usuarios`);
  }

  getUserById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/api/usuarios/${id}`);
  }

  updateUser(id: number, usuario: UsuarioUpdatePayload): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/api/usuarios/${id}`, usuario);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/usuarios/${id}`);
  }

  createUser(usuario: UsuarioCreatePayload): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/api/usuarios`, usuario);
  }
}
