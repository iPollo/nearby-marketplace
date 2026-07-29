import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
      },

      {
        path: 'listings/new',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/listings/pages/create-listing/create-listing/create-listing').then(m => m.CreateListing)
      },

      {
        path: 'listings/mine',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/listings/pages/my-listings/my-listings').then(m => m.MyListings)
      },

      {
        path: 'listings/:id',
        loadComponent: () =>
          import('./features/listings/pages/listing-detail/listing-detail').then(m => m.ListingDetail)
      },

      {
        path: 'listings/:id/edit',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/listings/pages/edit-listing/edit-listing').then(m => m.EditListing)
      }

    ]
  },

  // fallback
  {
    path: '**',
    redirectTo: 'home'
  }

];
