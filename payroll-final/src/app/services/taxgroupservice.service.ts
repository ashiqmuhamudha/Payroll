import { Injectable } from '@angular/core';
import { ITaxData, ITaxDataList } from '../models/taxmodel';
import { ITaxinfoData, ITaxinfoDataList } from '../models/taxinfomodel';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class taxgroupserviceService {
  private tokenKey = 'bearer_token';

  constructor(private http: HttpClient, private configService: ConfigService) {   
  }

  get apiUrl(): string {
    return this.configService.apiUrl;
  }

  get apiTaxInfo() : string{
    return  this.configService.apiTaxInfo;
  }

  get apiTaxData() : string{
    return  this.configService.apiTaxData;
  }




  //get apiOrgAttributeHeader() : string{
    //return  this.configService.apiOrgAttributeHeader;
  //}


  //get apiOrgAttributeDetails() : string{
    //return  this.configService.apiOrgAttributeDetails;
  //}
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
  // getOrgData(): Observable<ISalaryData[]> {
  //   const headers = this.createAuthorizationHeader();
  //   return this.http.get<ISalaryData[]>(`${this.apiSalaryGroup}GetAllRecord`, { headers }).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  getTaxInfoData(
    pageNumber: number,
    pageSize: number,
    searchValue: string,
    sortColumn: string,
    sortDirection: string
  ): Observable<ITaxinfoDataList> {
    const headers = this.createAuthorizationHeader();
    const url = `${this.apiTaxInfo}Pagination?PageNumber=${pageNumber}&PageSize=${pageSize}&SearchValue=${searchValue || 'ALL'}&SortColumn=${sortColumn}&SortDirection=${sortDirection}`;
    return this.http.get<ITaxinfoDataList>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }


  //getOrgDetails(
    //pageNumber: number,
    //pageSize: number,
    //searchValue: string,
    //sortColumn: string,
    //sortDirection: string
  //): Observable<IOrgDetail> {
    //const headers = this.createAuthorizationHeader();
    //const url = `${this.apiOrgAttributeDetails}Pagination?PageNumber=${pageNumber}&PageSize=${pageSize}&SearchValue=${searchValue || 'ALL'}&SortColumn=${sortColumn}&SortDirection=${sortDirection}`;
    //return this.http.get<IOrgDetail>(url, { headers }).pipe(
      //catchError(this.handleError)
    //);
  //}

    // Get Org Data by Code (GET with Token)
    //getOrgDetailAttributeByCode(code: number): Observable<OrgDetail> {
      //const headers = this.createAuthorizationHeader();
      //return this.http.get<OrgDetail>(`${this.apiOrgAttributeDetails}GetById/${code}`, { headers }).pipe(
        //catchError(this.handleError)
      //);
    //}
  
    // Add a new salary group (POST with Token)
    //addOrgDetailAttribute(orgData: OrgDetail): Observable<OrgDetail> {
      //const headers = this.createAuthorizationHeader();
      //return this.http.post<OrgDetail>(`${this.apiOrgAttributeDetails}Add/`, orgData, { headers }).pipe(
        //catchError(this.handleError)
      //);
    //}
  
    // Update an existing salary group (PUT with Token)
    //updateOrgDetailAttribute(orgData: OrgDetail): Observable<OrgDetail> {
      //const headers = this.createAuthorizationHeader();
      //const url = `${this.apiOrgAttributeDetails}Update/${orgData.id}`;
      //return this.http.put<OrgDetail>(url, orgData, { headers }).pipe(
        //catchError(this.handleError)
      //);
    //}

    // Delete a salary group by ID (DELETE with Token)
    //deleteOrgDetailAttributeById(id: number): Observable<void> {
      //const headers = this.createAuthorizationHeader();
      //const url = `${this.apiOrgAttributeDetails}Delete/${id}`;
      //return this.http.delete<void>(url, { headers }).pipe(
        //catchError(this.handleError)
      //);
    //}

  // Get Org Data by Code (GET with Token)
  getTaxInfoDataByCode(code: number): Observable<ITaxinfoData> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<ITaxinfoData>(`${this.apiTaxInfo}GetById/${code}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  

  // Add a new salary group (POST with Token)
  addTaxInfoData(taxData: ITaxinfoData): Observable<ITaxinfoData> {
    const headers = this.createAuthorizationHeader();
    return this.http.post<ITaxinfoData>(`${this.apiTaxInfo}Add/`, taxData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing salary group (PUT with Token)
  updateTaxInfoData(taxData: ITaxinfoData): Observable<ITaxinfoData> {
    const headers = this.createAuthorizationHeader();
    const url = `${this.apiTaxInfo}Update/${taxData.id}`;
    return this.http.put<ITaxinfoData>(url, taxData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a salary group by ID (DELETE with Token)
  deleteTaxInfoData(id: number): Observable<void> {
    const headers = this.createAuthorizationHeader();
    const url = `${this.apiTaxInfo}Delete/${id}`;
    return this.http.delete<void>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createTaxInfoData(data: ITaxinfoData): Observable<ITaxinfoData> {
        const headers = this.createAuthorizationHeader();
        return this.http.post<ITaxinfoData>(`${this.apiTaxInfo}Add`, data, { headers }).pipe(catchError(this.handleError));
      }

  // Get Org Headers
  //getTaxData(): Observable<ITaxinfoData[]> {
    //const headers = this.createAuthorizationHeader();
    //return this.http.get<ITaxinfoData[]>(`${this.apiTaxInfo}GetAllRecord`, { headers }).pipe(
      //catchError(this.handleError)
    //);
  //}

  getApiData(): Observable<ITaxData[]> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<ITaxData[]>(`${this.apiTaxData}GetAPIData`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  //getSalaryGroupByDes(description : string): Observable<ISalaryData> {
    //const headers = this.createAuthorizationHeader();
    //return this.http.get<ISalaryData>(`${this.apiSalaryGroup}GetById/${description}`, { headers }).pipe(
      //catchError(this.handleError)
    //);
  //}

  // Fetch OrgDetail options
  //getOrgValues(): Observable<OrgDetail[]> {
    //const headers = this.createAuthorizationHeader();
    //return this.http.get<OrgDetail[]>(`${this.apiOrgAttributeDetails}GetAllRecord`, { headers }).pipe(
      //catchError(this.handleError)
    //);
  //}
  
  //getOrgHeaderById(id: number): Observable<OrgHeader> {
    //const headers = this.createAuthorizationHeader();
    //const url = `${this.apiOrgAttributeHeader}GetHeadById/${id}`;
    //return this.http.get<OrgHeader>(url, { headers }).pipe(
      //catchError(this.handleError)
    //);
  //}

  //getOrgValueById(id: number): Observable<OrgDetail> {
    //const headers = this.createAuthorizationHeader();
    //const url = `${this.apiOrgAttributeDetails}GetById/${id}`;
    //return this.http.get<OrgDetail>(url, { headers }).pipe(
      //catchError(this.handleError)
    //);
  //}

  //getOrgValueHeadById(id: number): Observable<OrgDetail[]> {
    //const headers = this.createAuthorizationHeader();
    //const url = `${this.apiOrgAttributeDetails}GetHeadById/${id}`;
    //return this.http.get<OrgDetail[]>(url, { headers }).pipe(
      //catchError(this.handleError)
    //);
  //}

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
