import { CurrencyPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../../core/services/products/products.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-details',
  imports: [CurrencyPipe, RouterLink, MatProgressSpinnerModule, CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  id: string | null;
  productService = inject(ProductsService);
  product: any = '';
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  loading!: boolean;

  private destroy = new Subject<void>();

  currency = CurrencyPipe;
  constructor(private route: ActivatedRoute, private toastr: HotToastService) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  getSingleProduct() {
    this.loading = true;
    this.productService
      .getSpecificProduct(this.id)
      .pipe(takeUntil(this.destroy),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (data) => {
          this.product = data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnInit(): void {
    this.getSingleProduct();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  addToCart(productId: number): void {
    this.cartService.addToCart(productId);
    this.toastr.success('Product added to Cart ✅', {
      duration: 1000
    });
  }

  toggleWishlist(productId: number): void {
    this.wishlistService.addToWishlist(productId);
    if (this.isInWishlist(productId)) {
      this.toastr.success('Product removed from Wishlist', {
        duration: 1000,
      });
    } else {
      this.toastr.success('Product added to Wishlist ❤️', {
        duration: 1000,
      });
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
}
