import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../../../shared/interface/IProduct';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private baseUrl = 'https://fakestoreapi.com/products';
  private wishlist: Product[] = [];
  wishlistCountSubject = new BehaviorSubject<number>(0);
  id = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {
    this.loadWishlistFromStorage();
  }

  loadWishlistFromStorage(): void {
    if (isPlatformBrowser(this.id)) {
      const stored = localStorage.getItem('wishlistItems');
      this.wishlist = stored ? JSON.parse(stored) : [];
      this.updateWishlistCount();
    }
  }

  saveWishlistToStorage(): void {
    if (isPlatformBrowser(this.id)) {
      localStorage.setItem('wishlistItems', JSON.stringify(this.wishlist));
    }
  }

  getWishlist(): Product[] {
    return this.wishlist;
  }

  addToWishlist(productId: number): void {
    const existing = this.wishlist.find(p => p.id === productId);
    if (existing) {
      this.removeFromWishlist(productId);
    } else {
      this.http.get<Product>(`${this.baseUrl}/${productId}`).subscribe(product => {
        this.wishlist.push(product);
        this.saveWishlistToStorage();
        this.updateWishlistCount();
      });
    }
  }

  removeFromWishlist(productId: number): void {
    this.wishlist = this.wishlist.filter(item => item.id !== productId);
    this.saveWishlistToStorage();
    this.updateWishlistCount();
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist.some(item => item.id === productId);
  }

  clearWishlist(): void {
    this.wishlist = [];
    localStorage.removeItem('wishlistItems');
    this.updateWishlistCount();
  }

  updateWishlistCount(): void {
    const wishlist = this.getWishlist();
    this.wishlistCountSubject.next(wishlist.length);
  }
}