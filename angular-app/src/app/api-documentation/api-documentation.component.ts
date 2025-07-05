import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

interface ApiHistoryItem {
  apiName: string;
  apiUrl: string;
  apiStatusCode: number;
  responseMessage: string;
  createdAt: string;
}

@Component({
  selector: 'app-api-documentation',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './api-documentation.component.html',
  styleUrl: './api-documentation.component.css'
})
export class ApiDocumentationComponent implements OnInit {
  apiName: string = '';
  apiHistory: ApiHistoryItem[] = [];
  isLoading: boolean = true;
  error: string = '';
  expandedResponses: Set<number> = new Set();
  activePreviewTabs: Set<number> = new Set(); // Track which responses have preview tab active

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.apiName = params['apiName'];
      if (this.apiName) {
        this.fetchApiHistory();
      }
    });
  }

  /**
   * Fetch API history from the backend
   */
  fetchApiHistory(): void {
    this.isLoading = true;
    this.error = '';

    const apiUrl = `${environment.apiUrl}/getAPIHistory?apiName=${encodeURIComponent(this.apiName)}`;
    
    this.http.get<ApiHistoryItem[]>(apiUrl).subscribe({
      next: (data: ApiHistoryItem[]) => {
        // Limit to maximum 5 responses
        this.apiHistory = data.slice(0, 5);
        this.isLoading = false;
        console.log('API History fetched:', data);
      },
      error: (error) => {
        this.error = 'Failed to load API history';
        this.isLoading = false;
        console.error('Error fetching API history:', error);
      }
    });
  }

  /**
   * Navigate back to dashboard
   */
  goBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Get status display text
   */
  getStatusText(statusCode: number): string {
    return statusCode >= 200 && statusCode < 300 ? 'Success' : 'Failed';
  }

  /**
   * Get status CSS class
   */
  getStatusClass(statusCode: number): string {
    return statusCode >= 200 && statusCode < 300 ? 'status-success' : 'status-failed';
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Invalid date';
    }
  }

  /**
   * Toggle response message visibility
   */
  toggleResponse(index: number): void {
    if (this.expandedResponses.has(index)) {
      this.expandedResponses.delete(index);
    } else {
      this.expandedResponses.add(index);
    }
  }

  /**
   * Check if response is expanded
   */
  isResponseExpanded(index: number): boolean {
    return this.expandedResponses.has(index);
  }

  /**
   * Check if response is HTML content
   */
  isHtmlResponse(responseMessage: string): boolean {
    return responseMessage.trim().toLowerCase().startsWith('<!doctype html') || 
           responseMessage.trim().toLowerCase().startsWith('<html');
  }

  /**
   * Get preview of response message
   */
  getResponsePreview(responseMessage: string): string {
    if (this.isHtmlResponse(responseMessage)) {
      return 'HTML Document';
    }
    return responseMessage.length > 100 ? responseMessage.substring(0, 100) + '...' : responseMessage;
  }

  /**
   * Refresh the history data
   */
  refreshHistory(): void {
    this.fetchApiHistory();
  }

  /**
   * Set active tab for response (raw or preview)
   */
  setActiveTab(index: number, isPreview: boolean): void {
    if (isPreview) {
      this.activePreviewTabs.add(index);
    } else {
      this.activePreviewTabs.delete(index);
    }
  }

  /**
   * Check if preview tab is active for response
   */
  isPreviewTabActive(index: number): boolean {
    return this.activePreviewTabs.has(index);
  }

  /**
   * Get sanitized HTML for preview - returns string for innerHTML binding
   */
  getSafeHtml(html: string): string {
    // Basic sanitization - remove dangerous elements and attributes
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:/gi, '');
  }

  /**
   * Get sanitized HTML for preview (basic sanitization) - deprecated, use getSafeHtml instead
   */
  getSanitizedHtml(html: string): string {
    // Basic sanitization - remove script tags and dangerous attributes
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '')
      .replace(/javascript:/gi, '');
  }
}
