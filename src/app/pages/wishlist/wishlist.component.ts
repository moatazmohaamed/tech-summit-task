import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { Product } from '../../shared/interface/IProduct';
import { CartService } from '../../core/services/cart/cart.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    RouterLink,
    HeaderComponent
  ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);
  wishlistItems: Product[] = [];

  constructor(private toastr: HotToastService) { }

  ngOnInit(): void {
    this.loadWishlistItems();
  }

  loadWishlistItems(): void {
    this.wishlistItems = this.wishlistService.getWishlist();
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
    this.loadWishlistItems();
    this.toastr.success('Product removed from wishlist', {
      duration: 1000,
    });
  }

  addToCart(productId: number): void {
    this.cartService.addToCart(productId);
    this.toastr.success('Product added to Cart ✅', {
      duration: 1000,
    });
  }
}