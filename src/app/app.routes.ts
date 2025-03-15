import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest/guest.guard';
import { authGuard } from './core/guards/auth/auth.guard';
import { ChatsLayoutComponent } from './features/chats/components/chats-layout/chats-layout.component';
import { ExternalLayoutComponent } from './shared/layouts/external-layout/external-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: ExternalLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/chats/pages/chat-page/chat-page.component'),
        pathMatch: 'full',
        canActivate: [guestGuard],
      },
      {
        path: 'privacy-policy',
        loadComponent: () =>
          import(
            './features/privacy-policy/pages/privacy-policy-page/privacy-policy-page.component'
          ),
      },
    ],
  },
  {
    path: '',
    component: ChatsLayoutComponent,
    children: [
      {
        path: 'chats',
        loadComponent: () =>
          import('./features/chats/pages/chat-page/chat-page.component'),
        canActivate: [authGuard],
      },
      {
        path: 'chats/:chatId',
        loadComponent: () =>
          import('./features/chats/pages/chat-page/chat-page.component'),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page.component'),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register-page/register-page.component'),
    canActivate: [guestGuard],
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
