import { Injectable } from '@angular/core';
import { IOrgData, OrgHeader, OrgValue } from '../models/orgmodel';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class OrgserviceService {
  private tokenKey = 'bearer_token';

  constructor(private http: HttpClient, private configService: ConfigService) {   
  }

  get apiUrl(): string {
    return this.configService.apiUrl;
  }

  get apiSalaryGroup() : string{
    return  this.configService.apiSalaryGroup;
  }


  get apiOrgAttributeHeader() : string{
    return  this.configService.apiOrgAttributeHeader;
  }


  get apiOrgAttributeDetails() : string{
    return  this.configService.apiOrgAttributeDetails;
  }
  // Store token in localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Retrieve token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Get Org Data (GET with Token)
  getOrgData(): Observable<IOrgData[]> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<IOrgData[]>(`${this.apiSalaryGroup}GetAllRecord`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Get Org Data by Code (GET with Token)
  getOrgDataByCode(code: number): Observable<IOrgData> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<IOrgData>(`${this.apiSalaryGroup}GetById/${code}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new salary group (POST with Token)
  addOrgData(orgData: IOrgData): Observable<IOrgData> {
    const headers = this.createAuthorizationHeader();
    return this.http.post<IOrgData>(`${this.apiSalaryGroup}Add/`, orgData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing salary group (PUT with Token)
  updateOrgData(orgData: IOrgData): Observable<IOrgData> {
    const headers = this.createAuthorizationHeader();
    const url = `${this.apiSalaryGroup}Update/${orgData.id}`;
    return this.http.put<IOrgData>(url, orgData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a salary group by ID (DELETE with Token)
  deleteOrgData(id: number): Observable<void> {
    const headers = this.createAuthorizationHeader();
    const url = `${this.apiSalaryGroup}Delete/${id}`;
    return this.http.delete<void>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Get Org Headers
  getOrgHeaders(): Observable<OrgHeader[]> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<OrgHeader[]>(`${this.apiOrgAttributeHeader}GetAllRecord`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch OrgValue options
  getOrgValues(): Observable<OrgValue[]> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<OrgValue[]>(`${this.apiOrgAttributeDetails}GetAllRecord`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  

  getOrgValueById(id: number): Observable<OrgValue[]> {
    const headers = this.createAuthorizationHeader();
    const url = `${this.apiOrgAttributeDetails}GetHeadById/${id}`;
    return this.http.get<OrgValue[]>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Handle errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error(error.message || 'An error occurred'));
  }

  // Create authorization header with Bearer token
  private createAuthorizationHeader(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }
}