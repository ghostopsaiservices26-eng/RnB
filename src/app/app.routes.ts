import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomePageComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent),
  },
  {
    path: 'trips',
    loadComponent: () => import('./pages/trips/trips').then(m => m.TripsPageComponent),
  },
  {
    path: 'trips/:id',
    loadComponent: () => import('./pages/trip-detail/trip-detail').then(m => m.TripDetailComponent),
  },
  {
    path: 'booking/:id',
    loadComponent: () => import('./pages/booking/booking').then(m => m.BookingComponent),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
