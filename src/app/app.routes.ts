import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
  },
  { 
    path: 'vote', 
    loadComponent: () => import('./pages/vote/vote').then(m => m.VoteComponent)
  },
  { path: '**', redirectTo: '/home' }
];
