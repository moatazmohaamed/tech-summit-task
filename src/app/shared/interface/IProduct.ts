export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export interface Rating {
  rate: number;
  count: number;
}

export interface FullCartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}
