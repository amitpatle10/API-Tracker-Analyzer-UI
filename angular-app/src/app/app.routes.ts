import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ApiAnalyzerComponent } from './api-analyzer/api-analyzer.component';
import { ApiDashboardComponent } from './api-dashboard/api-dashboard.component';
import { ApiDocumentationComponent } from './api-documentation/api-documentation.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },                    // Default route (home page)
  { path: 'home', component: HomeComponent },               // /home route
  { path: 'dashboard', component: ApiDashboardComponent },  // /dashboard route
  { path: 'docs/:apiName', component: ApiDocumentationComponent }, // /docs/[apiName] route
  { path: 'analyze/:apiName', component: ApiAnalyzerComponent }, // /analyze/[apiName] route
  { path: '**', redirectTo: '' }                           // Wildcard route (404 redirect to home)
];
