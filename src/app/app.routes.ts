import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/posts', pathMatch: 'full' },
  {
    path: 'posts',
    loadComponent: () =>
      import('./features/posts/post-feed/post-feed.component').then(
        (m) => m.PostFeedComponent
      ),
  },
  {
    path: 'posts/:id',
    loadComponent: () =>
      import('./features/posts/post-details/post-details.component').then(
        (m) => m.PostDetailComponent
      ),
  },
];
