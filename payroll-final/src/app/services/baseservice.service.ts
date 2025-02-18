import { Injectable } from '@angular/core';
import { IBaseData, IBaseDataList } from '../models/basemodel';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ConfigService } from '../services/config.service';


@Injectable({
  providedIn: 'root'
})
export class baseserviceService {
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
  getBaseData(): Observable<IBaseData[]> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<IBaseData[]>(`${this.apiBaseComponent}GetAllRecord`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Get Org Data by Code (GET with Token)
  getBaseDataByCode(code: number): Observable<IBaseData> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<IBaseData>(`${this.apiBaseComponent}GetById/${code}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new salary group (POST with Token)
  addBaseData(baseData: IBaseData): Observable<IBaseData> {
    const headers = this.createAuthorizationHeader();
    return this.http.post<IBaseData>(`${this.apiBaseComponent}Add/`, baseData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing salary group (PUT with Token)
  updateBaseData(baseData: IBaseData): Observable<IBaseData> {
    const headers = this.createAuthorizationHeader();
    const url = `${this.apiBaseComponent}Update/${baseData.id}`;
    return this.http.put<IBaseData>(url, baseData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a salary group by ID (DELETE with Token)
  deleteBaseData(id: number): Observable<void> {
    const headers = this.createAuthorizationHeader();
    const url = `${this.apiBaseComponent}Delete/${id}`;
    return this.http.delete<void>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createBaseForm(data: IBaseData): Observable<IBaseData> {
      const headers = this.createAuthorizationHeader();
      return this.http.post<IBaseData>(`${this.apiBaseComponent}Add`, data, { headers }).pipe(catchError(this.handleError));
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

  
     getBasecomponentlist(
        pageNumber: number,
        pageSize: number,
        searchValue: string,
        sortColumn: string,
        sortDirection: string
      ): Observable<IBaseDataList> {
        const headers = this.createAuthorizationHeader();
        const url = `${this.apiBaseComponent}Pagination?PageNumber=${pageNumber}&PageSize=${pageSize}&SearchValue=${searchValue || 'ALL'}&SortColumn=${sortColumn}&SortDirection=${sortDirection}`;
        return this.http.get<IBaseDataList>(url, { headers }).pipe(
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

