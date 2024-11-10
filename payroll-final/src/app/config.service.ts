// src/app/config.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig() {
    // Load configuration from `assets/config.json`
    return lastValueFrom(this.http.get('/assets/config.json')).then(config => {
      this.config = config;
    });
  }

  get apiUrl(): string {
    return this.config ? this.config.apiUrl : '';
  }

  get apiSalaryGroup(): string {
    return this.config ? this.config.apiSalaryGroup : '';
  }

  get apiOrgAttributeHeader(): string {
    return this.config ? this.config.apiOrgAttributeHeader : '';
  }

  get apiOrgAttributeDetails(): string {
    return this.config ? this.config.apiOrgAttributeDetails : '';
  }

  setConfig(config: any): void {
    this.config = config;
  }
}
