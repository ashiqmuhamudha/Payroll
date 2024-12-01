import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectionmodelService {
  private tokenKey = 'bearer_token';
  constructor(private http: HttpClient) {}

  getData(url: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<any>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private createAuthorizationHeader(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private handleError(error: any) {
    console.error('Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
