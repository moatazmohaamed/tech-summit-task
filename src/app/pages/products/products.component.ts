import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../shared/interface/IProduct';
import { ProductsService } from '../../core/services/products/products.service';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SortProductsPipe } from '../../shared/pipes/sort-products.pipe';
import { CartService } from '../../core/services/cart/cart.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-products',
  imports: [
    CurrencyPipe,
    RouterLink,
    HeaderComponent,
    SortProductsPipe,
    CommonModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  sortPipe = new SortProductsPipe();
  productService = inject(ProductsService);
  cartService = inject(CartService);
  route = inject(ActivatedRoute);
  products: Product[] = [];
  filteredProducts: Product[] = [];
  currency = CurrencyPipe;
  private destroy = new Subject<void>();
  constructor(private toastr: HotToastService) {}

  getAllProducts() {
    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy))
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
}
