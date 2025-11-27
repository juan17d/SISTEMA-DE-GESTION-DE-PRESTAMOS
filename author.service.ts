import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Autor {
  id: number;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class AuthorService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Autor[]> {
    return this.http.get<Autor[]>(`${this.baseUrl}/api/autores`);
  }

  getById(id: number): Observable<Autor> {
    return this.http.get<Autor>(`${this.baseUrl}/api/autores/${id}`);
  }

  create(nombre: string): Observable<Autor> {
    return this.http.post<Autor>(`${this.baseUrl}/api/autores`, { nombre });
  }

  update(id: number, nombre: string): Observable<Autor> {
    return this.http.put<Autor>(`${this.baseUrl}/api/autores/${id}`, { nombre });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/autores/${id}`);
  }
}

