import { Injectable } from '@angular/core';
import { IForData, IForDataList } from '../models/formulamodel';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ConfigService } from '../services/config.service';


@Injectable({
  providedIn: 'root'
})
export class formulaserviceService {
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

  get apiBaseComponent() : string{
    return  this.configService.apiBaseComponent;
  }

  get apiformulacomponent() : string{
    return  this.configService.apiformulacomponent;
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

  // // Fetch the token using configuration details and store it
  // fetchToken(): Observable<any> {
  //   return this.configService.getConfig().pipe(
  //     switchMap(config => {
  //       const url = `${config.apiUrl}?sCompanyCode=${config.sCompanyCode}&sUserName=${config.sUserName}&sPassword=${config.sPassword}`;
       
  //       return this.http.get<any>(url).pipe(
  //         map(response => {
  //           if (response && response.token) {
  //             this.setToken(response.token);
  //             return response.token;
  //           } else {
  //             throw new Error('Token not found in response');
  //           }
  //         }),
  //         catchError(this.handleError)
  //       );
  //     })
  //   );
  // }

  // fetchToken(): Observable<any> {
  //   const config = this.configService.getConfig();
  //   const url = `${config.authUrl}?sCompanyCode=${config.companyCode}&sUserName=${config.username}&sPassword=${config.password}`;
  //   this.apiSalaryGroup=config.apiSalaryGroup;
  //   this.apiOrgAttributeHeader = config.apiOrgAttributeHeader;
  //   this.apiOrgAttributeDetails = config.apiOrgAttributeDetails;
  //   return this.http.get(url).pipe(
  //     map((response: any) => {
  //       localStorage.setItem('authToken', response.token);
  //       return response.token;
  //     }),
  //     catchError(this.handleError)
  //   );
  // }
  // Get Org Data (GET with Token)
  getForData(): Observable<IForData[]> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<IForData[]>(`${this.apiformulacomponent}GetAllRecord`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Get Org Data by Code (GET with Token)
  getForDataByCode(code: number): Observable<IForData> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<IForData>(`${this.apiformulacomponent}GetById/${code}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new salary group (POST with Token)
  addForData(forData: IForData): Observable<IForData> {
    const headers = this.createAuthorizationHeader();
    return this.http.post<IForData>(`${this.apiformulacomponent}Add/`, forData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing salary group (PUT with Token)
  updateForData(forData: IForData): Observable<IForData> {
    const headers = this.createAuthorizationHeader();
    const url = `${this.apiformulacomponent}Update/${forData.id}`;
    return this.http.put<IForData>(url, forData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a salary group by ID (DELETE with Token)
  deleteForData(id: number): Observable<void> {
    const headers = this.createAuthorizationHeader();
    const url = `${this.apiformulacomponent}Delete/${id}`;
    return this.http.delete<void>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createForData(data: IForData): Observable<IForData> {
      const headers = this.createAuthorizationHeader();
      return this.http.post<IForData>(`${this.apiformulacomponent}Add`, data, { headers }).pipe(catchError(this.handleError));
    }
  
    

  // Get Org Headers
  /*getOrgHeaders(): Observable<OrgHeader[]> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<OrgHeader[]>(`${this.apiBaseComponent}GetAllRecord`, { headers }).pipe(
      catchError(this.handleError)
    );
  } 

    getOrgHeaderById(id: number): Observable<OrgHeader> {
        const headers = this.createAuthorizationHeader();
        const url = `${this.apiBaseComponent}GetHeadById/${id}`;
        return this.http.get<OrgHeader>(url, { headers }).pipe(
          catchError(this.handleError)
        );
      }*/

  
     getForcomponentlist(
        pageNumber: number,
        pageSize: number,
        searchValue: string,
        sortColumn: string,
        sortDirection: string
      ): Observable<IForDataList> {
        const headers = this.createAuthorizationHeader();
        const url = `${this.apiformulacomponent}Pagination?PageNumber=${pageNumber}&PageSize=${pageSize}&SearchValue=${searchValue || 'ALL'}&SortColumn=${sortColumn}&SortDirection=${sortDirection}`;
        return this.http.get<IForDataList>(url, { headers }).pipe(
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

