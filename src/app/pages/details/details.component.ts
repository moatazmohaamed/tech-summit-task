import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../../core/services/products/products.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-details',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  id: string | null;
  productService = inject(ProductsService);
  product: any = '';
  cartService = inject(CartService);
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
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
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
}
