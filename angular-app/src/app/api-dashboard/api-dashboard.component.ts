import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface ApiData {
  apiName: string;
  apiUrl: string | null;
  apiStatusCode: number | null;
  responseMessage: string | null;
  createdAt: string | null;
}

@Component({
  selector: 'app-api-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './api-dashboard.component.html',
  styleUrl: './api-dashboard.component.css'
})
export class ApiDashboardComponent implements OnInit {
  apis: ApiData[] = [];
  isLoading: boolean = true;
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchApiData();
  }

  /**
   * Fetch all API data from the backend
   */
  fetchApiData(): void {
    this.isLoading = true;
    this.error = '';

    const apiUrl = `${environment.apiUrl}${environment.endpoints.getAllAPIData}`;
    
    this.http.get<ApiData[]>(apiUrl).subscribe({
      next: (data: ApiData[]) => {
        this.apis = data;
        this.isLoading = false;
        console.log('API Data fetched:', data);
      },
      error: (error) => {
        this.error = 'Failed to load API data';
        this.isLoading = false;
        console.error('Error fetching API data:', error);
      }
    });
  }

  /**
   * Navigate back to home page
   */
  goBackHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Analyze a specific API
   */
  analyzeApi(apiName: string): void {
    this.router.navigate(['/analyze', apiName]);
  }

  /**
   * Navigate to API documentation
   */
  viewApiDocumentation(apiName: string): void {
    this.router.navigate(['/docs', apiName]);
  }

  /**
   * Get status display text based on status code
   */
  getStatusText(statusCode: number | null): string {
    if (statusCode === null) return 'Not tested';
    return statusCode >= 200 && statusCode < 300 ? 'Success' : 'Failed';
  }

  /**
   * Get status CSS class based on status code
   */
  getStatusClass(statusCode: number | null): string {
    if (statusCode === null) return 'status-untested';
    return statusCode >= 200 && statusCode < 300 ? 'status-success' : 'status-failed';
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string | null): string {
    if (!dateString) return 'Never tested';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Invalid date';
    }
  }

  /**
   * Refresh the dashboard data
   */
  refreshData(): void {
    this.fetchApiData();
  }

  /**
   * Get count of successful APIs
   */
  getSuccessCount(): number {
    return this.apis.filter(api => 
      api.apiStatusCode !== null && 
      api.apiStatusCode >= 200 && 
      api.apiStatusCode < 300
    ).length;
  }

  /**
   * Get count of failed APIs
   */
  getFailedCount(): number {
    return this.apis.filter(api => 
      api.apiStatusCode !== null && 
      (api.apiStatusCode < 200 || api.apiStatusCode >= 300)
    ).length;
  }
}
