import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FullCartItem } from '../../shared/interface/IProduct';
import { Router, RouterLink } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cart!: FullCartItem[];
  router = inject(Router)
  constructor(private cartService: CartService, private toastr: HotToastService) { }


  ngOnInit(): void {
    this.cart = this.cartService.getCart()
  }

  clear() {
    this.cartService.clearCart();
    this.toastr.warning('The Cart is cleared')
    this.cart = [];
  }

  getTotal(): number {
    return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  checkout() {
    this.cartService.clearCart();
    this.cart = [];
    this.toastr.success('Thank you for your purchase, Checkout Complete ✅', {
      duration: 2000
    });
    this.router.navigate(['/']);
  }
}
