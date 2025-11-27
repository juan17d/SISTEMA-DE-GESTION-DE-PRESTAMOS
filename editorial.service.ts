import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Editorial {
  id: number;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class EditorialService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Editorial[]> {
    return this.http.get<Editorial[]>(`${this.baseUrl}/api/editoriales`);
  }

  getById(id: number): Observable<Editorial> {
    return this.http.get<Editorial>(`${this.baseUrl}/api/editoriales/${id}`);
  }

  create(nombre: string): Observable<Editorial> {
    return this.http.post<Editorial>(`${this.baseUrl}/api/editoriales`, { nombre });
  }

  update(id: number, nombre: string): Observable<Editorial> {
    return this.http.put<Editorial>(`${this.baseUrl}/api/editoriales/${id}`, { nombre });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/editoriales/${id}`);
  }
}

