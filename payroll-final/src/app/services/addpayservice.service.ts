import { Injectable } from '@angular/core';
import { IAddPayData, IAddPayDataList } from '../models/addpaymodel';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from '../services/config.service';


@Injectable({
  providedIn: 'root'
})
export class addpayserviceService {
  //private apiUrl = "http://localhost:3002/";
  private tokenKey = 'bearer_token';
  // private apiSalaryGroup : string | undefined;
  // private apiOrgAttributeDetails : string | undefined;
  // private apiOrgAttributeHeader : string | undefined;


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

    get apiadditionalpaysalarycomponent() : string{
    return  this.configService.apiadditionalpaysalarycomponent;
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

  // Get Org Data by Code (GET with Token)
  getAddpaysalarylistByCode(code: number): Observable<IAddPayData> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<IAddPayData>(`${this.apiadditionalpaysalarycomponent}GetById/${code}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new salary group (POST with Token)
  addAddpaysalarylist(addpayData: IAddPayData): Observable<IAddPayData> {
    const headers = this.createAuthorizationHeader();
    return this.http.post<IAddPayData>(`${this.apiadditionalpaysalarycomponent}Add/`, addpayData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing salary group (PUT with Token)
  updateAddpaysalarylist(addpayData: IAddPayData): Observable<IAddPayData> {
    const headers = this.createAuthorizationHeader();
    const url = `${this.apiadditionalpaysalarycomponent}Update/${addpayData.id}`;
    return this.http.put<IAddPayData>(url, addpayData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a salary group by ID (DELETE with Token)
  deleteAddpaysalarylist(id: number): Observable<void> {
    const headers = this.createAuthorizationHeader();
    const url = `${this.apiadditionalpaysalarycomponent}Delete/${id}`;
    return this.http.delete<void>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createAddpaysalarylist(data: IAddPayData): Observable<IAddPayData> {
      const headers = this.createAuthorizationHeader();
      return this.http.post<IAddPayData>(`${this.apiadditionalpaysalarycomponent}Add`, data, { headers }).pipe(catchError(this.handleError));
    }
  
  
     getAddpaysalarylist(
        pageNumber: number,
        pageSize: number,
        searchValue: string,
        sortColumn: string,
        sortDirection: string
      ): Observable<IAddPayDataList> {
        const headers = this.createAuthorizationHeader();
        const url = `${this.apiadditionalpaysalarycomponent}Pagination?PageNumber=${pageNumber}&PageSize=${pageSize}&SearchValue=${searchValue || 'ALL'}&SortColumn=${sortColumn}&SortDirection=${sortDirection}`;
        return this.http.get<IAddPayDataList>(url, { headers }).pipe(
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

