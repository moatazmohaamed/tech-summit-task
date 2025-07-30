import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Product } from '../../shared/interface/IProduct';
import { ProductsService } from '../../core/services/products/products.service';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SortProductsPipe } from '../../shared/pipes/sort-products.pipe';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-products',
  imports: [
    CurrencyPipe,
    RouterLink,
    HeaderComponent,
    SortProductsPipe,
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  sortPipe = new SortProductsPipe();
  productService = inject(ProductsService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  route = inject(ActivatedRoute);
  products: Product[] = [];
  filteredProducts: Product[] = [];
  currency = CurrencyPipe;
  private destroy = new Subject<void>();
  loading: boolean = false
  constructor(private toastr: HotToastService) { }

  getAllProducts() {
    this.loading = true;
    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (data) => {
          this.products = data;
          this.applyFilter();
        },
        error(err) {
          console.log(err);
        },
      });
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.route.queryParams.subscribe(() => {
      this.applyFilter();
    });
  }

  applyFilter() {
    const searchText =
      this.route.snapshot.queryParams['searchText']?.toLowerCase() || '';
    const sortOption = this.route.snapshot.queryParams['sort'] || '';
    const category = this.route.snapshot.queryParams['category'] || 'all';

    let filtered = this.products;
    if (category && category !== 'all') {
      filtered = filtered.filter(
        (product) => product.category?.toLowerCase() === category.toLowerCase()
      );
    }
    filtered = filtered.filter((product) =>
      product.title.toLowerCase().includes(searchText)
    );
    this.filteredProducts = this.sortPipe.transform(filtered, sortOption);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  addToCart(productId: number): void {
    this.cartService.addToCart(productId);
    this.toastr.success('Product added to Cart ✅', {
      duration: 1000,
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
