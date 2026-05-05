import { Product } from "./product";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size: number;
  color: string;
  price: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
