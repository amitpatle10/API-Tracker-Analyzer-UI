import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ApiRequest {
  apiName: string;
  apiUrl: string;
  apiRequestBody: string;
  apiRequestMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_BASE_URL = environment.apiUrl;
  private readonly ENDPOINTS = environment.endpoints;

  constructor(private http: HttpClient) {}

  /**
   * Execute an API request through the backend
   */
  runApi(request: ApiRequest): Observable<HttpResponse<any>> {
    const url = `${this.API_BASE_URL}${this.ENDPOINTS.runApi}`;
    console.log('API Service - Making request to:', url);
    console.log('API Service - Request payload:', request);
    return this.http.post<any>(url, request, { observe: 'response' });
  }

  /**
   * Log the error to backend
   */
  logError(): Observable<string> {
    const url = `${this.API_BASE_URL}${this.ENDPOINTS.logError}`;
    console.log('API Service - Logging error to:', url);
    return this.http.get(url, { responseType: 'text' });
  }

  /**
   * Get the current environment info
   */
  getEnvironmentInfo() {
    return {
      production: environment.production,
      apiUrl: this.API_BASE_URL,
      endpoints: this.ENDPOINTS
    };
  }
}
