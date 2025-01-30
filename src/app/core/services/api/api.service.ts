import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.baseUrl}`;

  get<T>(query: string, options?: { params?: HttpParams }) {
    const url = `${this.apiUrl}${query}`;
    return this.http.get<T>(url, options);
  }

  post<T>(query: string, body: any, options?: { params?: HttpParams }) {
    const url = `${this.apiUrl}${query}`;
    return this.http.post<T>(url, body, options);
  }

  postStream(query: string, body: any) {
    const url = `${this.apiUrl}${query}`;
    return this.http.post(url, body, {
      observe: 'events',
      responseType: 'text',
      reportProgress: true,
    });
  }
}
