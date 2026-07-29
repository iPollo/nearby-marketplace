import { Routes } from '@angular/router';

export const routes: Routes = [

  // auth
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login').then(m => m.Login)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register').then(m => m.Register)
  },

  // app
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },

      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/pages/home/home').then(m => m.Home)
      }


    ]
  },

  // fallback
  {
    path: '**',
    redirectTo: 'login'
  }

];
