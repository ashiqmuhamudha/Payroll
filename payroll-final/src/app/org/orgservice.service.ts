import { Injectable, } from '@angular/core';
import { IOrgData, OrgHeader, OrgValue } from './orgmodel';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, delay, of, scan, switchMap, takeWhile, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrgserviceService {

  apiUrl = "http://localhost:3002/";
  constructor(private http: HttpClient) { }
  getOrgData(): Observable<IOrgData[]> {
    return this.http.get<IOrgData[]>(`${this.apiUrl}orgdatas`).pipe(
      catchError(this.handleError)
    );
  };



  getOrgDataByCode(code: number): Observable<IOrgData> {
    return this.http.get<IOrgData>(`${this.apiUrl}orgdatas?id=` + code).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new salary group
  addOrgData(orgData: IOrgData): Observable<IOrgData> {
    return this.http.post<IOrgData>(`${this.apiUrl}orgdatas/`, orgData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Update an existing salary group
  updateOrgData(orgData: IOrgData): Observable<IOrgData> {
    const url = `${this.apiUrl}orgdatas?id=${orgData.id}`;
    return this.http.put<IOrgData>(url, orgData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Delete a salary group by ID
  deleteOrgData(id: number): Observable<void> {
    const url = `${this.apiUrl}orgdatas?id=${id}`;
    return this.http.delete<void>(url);
  }

  getOrgHeaders(): Observable<OrgHeader[]> {
    return this.http.get<OrgHeader[]>(`${this.apiUrl}orgHeader`);
  }

  // Fetch OrgValue options
  getOrgValues(): Observable<OrgValue[]> {
    return this.http.get<OrgValue[]>(`${this.apiUrl}orgValue`);
  }

  handleError(err: HttpErrorResponse) {
    return throwError(() => err);

  }
}
