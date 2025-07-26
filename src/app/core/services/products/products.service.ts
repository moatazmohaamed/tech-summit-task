import { Injectable } from '@angular/core';
import { Product } from '../../../shared/interface/IProduct';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('https://fakestoreapi.com/products');
  }

  getSpecificProduct(id: any): Observable<any> {
    return this.http.get(`https://fakestoreapi.com/products/${id}`);
  }
}
