import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showModal = false;    // Controls modal visibility
  apiName = '';         // Stores the API name input

  constructor(private router: Router) {}

  /**
   * Opens the modal dialog for API name input
   */
  openApiNameDialog(): void {
    this.showModal = true;
    this.apiName = '';   // Reset input field
  }

  /**
   * Opens the API Dashboard
   */
  openApiDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Closes the modal dialog
   */
  closeModal(): void {
    this.showModal = false;
    this.apiName = '';
  }

  /**
   * Navigates to API analyzer page with the entered API name
   */
  analyzeApi(): void {
    if (this.apiName.trim()) {
      // Navigate to analyze route with API name as parameter
      this.router.navigate(['/analyze', this.apiName.trim()]);
    }
  }
}
