import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, CreateCart } from '../../../shared/interface/ICart';
import { isPlatformBrowser } from '@angular/common';
import { FullCartItem } from '../../../shared/interface/IProduct';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'https://fakestoreapi.com/products';

  private cart: FullCartItem[] = [];
  cartCountSubject = new BehaviorSubject<number>(0);
  id = inject(PLATFORM_ID)



  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
  }

  loadCartFromStorage(): void {
    if (isPlatformBrowser(this.id)) {
      const stored = localStorage.getItem('cartItems');
      this.cart = stored ? JSON.parse(stored) : [];
    }
  }

  saveCartToStorage(): void {
    if (isPlatformBrowser(this.id)) {
      localStorage.setItem('cartItems', JSON.stringify(this.cart));
    }
  }

  createCart(cart: CreateCart): Observable<any> {
    return this.http.post(this.baseUrl, cart);
  }

  getCart(): FullCartItem[] {
    return this.cart;
  }

  addToCart(productId: number): void {
    const existing = this.cart.find(p => p.id === productId);
    if (existing) {
      existing.quantity++;
      this.saveCartToStorage();
      this.updateCartCount();

    } else {
      this.http.get<any>(`${this.baseUrl}/${productId}`).subscribe(product => {
        const newItem: FullCartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        };
        this.cart.push(newItem);
        this.saveCartToStorage();
        this.updateCartCount();
      });

    }
  }

  clearCart(): void {
    this.cart = [];
    localStorage.removeItem('cartItems');
    this.updateCartCount();
  }


  updateCartCount(): void {
    const cart = this.getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCountSubject.next(totalCount);
  }
}
