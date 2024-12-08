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

  async loadConfig(): Promise<void> {
    try {
      // Load configuration from `assets/config.json`
      const configData = await lastValueFrom(this.http.get('/assets/config.json'));
      this.config = configData;
      
      // if (this.config?.apiUrl && !localStorage.getItem('bearer_token')) {
      //   const tokenData = await lastValueFrom(this.http.get<any>(this.config.apiUrl));
      //   const token = tokenData?.token || null;
        
      //   if (token) {
      //     localStorage.setItem('bearer_token', token);
      //   } else {
      //     console.error("Failed to retrieve token.");
      //   }
      // }
    } catch (error) {
      console.error("Error loading configuration or fetching token:", error);
    }
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

  get apiWagePeriod(): string {
    return this.config ? this.config.apiWagePeriod : '';
  }

  setConfig(config: any): void {
    this.config = config;
  }
}
