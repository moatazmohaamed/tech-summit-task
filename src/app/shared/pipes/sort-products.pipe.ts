import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../interface/IProduct';

@Pipe({
  name: 'sortProducts',
})
export class SortProductsPipe implements PipeTransform {
  transform(products: Product[], sortOption: string): Product[] {
    if (!products || !sortOption) return products;
    switch (sortOption) {
      case 'priceAsc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...products].sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return [...products].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return products;
    }
  }
}
