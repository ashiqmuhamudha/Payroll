import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IWagePeriod } from '../models/wageperiodmodel';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class WagePeriodService {  
  private tokenKey = 'bearer_token';

  constructor(private http: HttpClient, private configService: ConfigService) {}

  get apiWagePeriod() : string{
    return  this.configService.apiWagePeriod;
  }

  private createAuthorizationHeader(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  getWagePeriods(): Observable<IWagePeriod[]> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<IWagePeriod[]>(`${this.apiWagePeriod}GetAllRecord`, { headers }).pipe(catchError(this.handleError));
  }

  getWagePeriodById(id: number): Observable<IWagePeriod> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<IWagePeriod>(`${this.apiWagePeriod}GetById/${id}`, { headers }).pipe(catchError(this.handleError));
  }

  createWagePeriod(data: IWagePeriod): Observable<IWagePeriod> {
    const headers = this.createAuthorizationHeader();
    return this.http.post<IWagePeriod>(`${this.apiWagePeriod}Add`, data, { headers }).pipe(catchError(this.handleError));
  }

  updateWagePeriod(data: IWagePeriod): Observable<IWagePeriod> {
    const headers = this.createAuthorizationHeader();
    return this.http.put<IWagePeriod>(`${this.apiWagePeriod}Update/${data.id}`, data, { headers }).pipe(catchError(this.handleError));
  }

  deleteWagePeriod(id: number): Observable<void> {
    const headers = this.createAuthorizationHeader();
    return this.http.delete<void>(`${this.apiWagePeriod}/Delete/${id}`, { headers }).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
