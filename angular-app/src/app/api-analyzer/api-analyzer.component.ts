import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService, ApiRequest } from '../services/api.service';

@Component({
  selector: 'app-api-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './api-analyzer.component.html',
  styleUrl: './api-analyzer.component.css'
})
export class ApiAnalyzerComponent implements OnInit {
  // API Details
  apiName: string = '';
  
  // Request Configuration
  requestMethod: string = 'GET';
  apiUrl: string = '';
  requestBody: string = '';
  
  // Response Data
  response: any = null;
  isLoading: boolean = false;
  responseTime: number = 0;
  statusCode: number = 0;
  
  // Error Handling
  hasError: boolean = false;
  errorMessage: string = '';
  
  // Log Error Control
  isErrorLogged: boolean = false;
  isLoggingError: boolean = false;
  
  // Animation Control
  isRocketFlying: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    // Log environment info for debugging
    console.log('Environment info:', this.apiService.getEnvironmentInfo());
  }

  ngOnInit(): void {
    // Get the API name from the route parameter
    this.route.params.subscribe(params => {
      this.apiName = params['apiName'] || 'Unknown API';
    });
  }

  /**
   * Navigate back to home page
   */
  goBackHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Execute the API request
   */
  runApi(): void {
    if (!this.apiUrl.trim()) {
      alert('Please enter an API URL');
      return;
    }

    // Trigger rocket animation
    this.isRocketFlying = true;
    
    // Reset rocket animation after 2 seconds
    setTimeout(() => {
      this.isRocketFlying = false;
    }, 2000);

    this.isLoading = true;
    this.hasError = false;
    this.response = null;
    this.statusCode = 0;
    this.isErrorLogged = false; // Reset error logged flag for new request
    const startTime = Date.now();

    const requestPayload: ApiRequest = {
      apiName: this.apiName,
      apiUrl: this.apiUrl.trim(),
      apiRequestBody: this.requestMethod === 'POST' ? this.requestBody : '',
      apiRequestMethod: this.requestMethod
    };

    this.apiService.runApi(requestPayload)
      .subscribe({
        next: (httpResponse: any) => {
          this.response = httpResponse.body;
          this.statusCode = httpResponse.status;
          this.responseTime = Date.now() - startTime;
          this.isLoading = false;
          this.hasError = !this.isSuccessStatus(httpResponse.status);
          console.log('API Response:', httpResponse);
        },
        error: (error: any) => {
          this.response = error.error || error;
          this.statusCode = error.status || 0;
          this.responseTime = Date.now() - startTime;
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage = error.message || 'An error occurred';
          console.error('API Error:', error);
        }
      });
  }

  /**
   * Log the error to backend
   */
  logError(): void {
    if (!this.response) {
      alert('No response to log');
      return;
    }

    if (this.isErrorLogged) {
      alert('This response has already been logged. Run a new API request to log again.');
      return;
    }

    this.isLoggingError = true;

    this.apiService.logError()
      .subscribe({
        next: (response: string) => {
          this.isErrorLogged = true; // Mark as logged
          this.isLoggingError = false;
          alert('Error logged successfully!');
          console.log('Error logged:', response);
        },
        error: (error: any) => {
          this.isLoggingError = false;
          alert('Failed to log error');
          console.error('Log error failed:', error);
        }
      });
  }

  /**
   * Format JSON for display
   */
  formatJson(obj: any): string {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  }

  /**
   * Check if request body should be shown (POST method)
   */
  shouldShowRequestBody(): boolean {
    return this.requestMethod === 'POST';
  }

  /**
   * Check if status code indicates success (2xx)
   */
  isSuccessStatus(statusCode: number): boolean {
    return statusCode >= 200 && statusCode < 300;
  }

  /**
   * Get status text based on status code
   */
  getStatusText(): string {
    if (this.statusCode === 0) return '';
    
    if (this.isSuccessStatus(this.statusCode)) {
      return `✅ ${this.statusCode} Success`;
    } else {
      return `❌ ${this.statusCode} Error`;
    }
  }

  /**
   * Get CSS class for status display
   */
  getStatusClass(): string {
    if (this.statusCode === 0) return '';
    return this.isSuccessStatus(this.statusCode) ? 'success' : 'error';
  }

  /**
   * Check if log error button should be disabled
   */
  isLogErrorDisabled(): boolean {
    return !this.response || this.isErrorLogged || this.isLoggingError;
  }

  /**
   * Get log error button text based on state
   */
  getLogErrorButtonText(): string {
    if (this.isLoggingError) {
      return '⏳ Logging...';
    }
    if (this.isErrorLogged) {
      return '✅ Already Logged';
    }
    return '📝 Log Error';
  }
}
