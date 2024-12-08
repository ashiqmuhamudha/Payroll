import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //private apiUrl = 'https://your-api-endpoint.com/api/login'; 
  private tokenKey = 'bearer_token';

  constructor(private http: HttpClient, private configService : ConfigService, private router : Router) {}

  login(username: string, password: string): Observable<{ token: string }> {
    // Build the URL with query parameters
    const url = `${this.configService.apiUrl}?sCompanyCode=cli&sUserName=${encodeURIComponent(username)}&sPassword=${encodeURIComponent(password)}`;

    return this.http.get<{ token: string }>(url, {}).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('rememberMe');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
   return !!localStorage.getItem(this.tokenKey);
    // return true;
  }

  isRemembered(): boolean {
    return localStorage.getItem('rememberMe') === 'true';
  }
}
