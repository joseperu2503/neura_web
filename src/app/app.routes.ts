import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest/guest.guard';
import { AuthGuard } from './core/guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'chats',
    loadComponent: () =>
      import('./features/chats/pages/chats-page/chats-page.component'),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page.component'),
    canActivate: [guestGuard],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
