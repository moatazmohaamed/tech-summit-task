import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/products/products.component').then(
        (m) => m.ProductsComponent
      ),
    title: 'Home',
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./pages/details/details.component').then(
        (m) => m.DetailsComponent
      ),
    title: 'details',
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then(
        (m) => m.CartComponent
      ),
    title: 'cart',
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./pages/wishlist/wishlist.component').then(
        (m) => m.WishlistComponent
      ),
    title: 'Wishlist',
  },
];
