import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Libro } from './book.service';

export interface Ejemplar {
  id: number;
  codigo: string;
  disponible: boolean;
  libro: Libro;
}

export interface EjemplarPayload {
  codigo: string;
  disponible: boolean;
  libro: { id: number };
}

@Injectable({ providedIn: 'root' })
export class EjemplarService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ejemplar[]> {
    return this.http.get<Ejemplar[]>(`${this.baseUrl}/api/ejemplares`);
  }

  getById(id: number): Observable<Ejemplar> {
    return this.http.get<Ejemplar>(`${this.baseUrl}/api/ejemplares/${id}`);
  }

  create(ejemplar: EjemplarPayload): Observable<Ejemplar> {
    return this.http.post<Ejemplar>(`${this.baseUrl}/api/ejemplares`, ejemplar);
  }

  update(ejemplar: Ejemplar): Observable<Ejemplar> {
    return this.http.put<Ejemplar>(`${this.baseUrl}/api/ejemplares/${ejemplar.id}`, ejemplar);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/ejemplares/${id}`);
  }
}

