export interface CartItem {
  productId: number;
  quantity: number;
}

export interface CreateCart {
  userId: number;
  date: string;
  products: CartItem[];
}
