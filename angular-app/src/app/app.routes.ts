import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ApiAnalyzerComponent } from './api-analyzer/api-analyzer.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },                    // Default route (home page)
  { path: 'home', component: HomeComponent },               // /home route
  { path: 'analyze/:apiName', component: ApiAnalyzerComponent }, // /analyze/[apiName] route
  { path: '**', redirectTo: '' }                           // Wildcard route (404 redirect to home)
];
