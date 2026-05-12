import type { Supplier } from "@/types/supplier";

export type { Supplier };

export interface Category {
  categoryId: string;
  categoryName: string;
}

export interface ProductDetail {
  productDetailId: string;
  color: string;
  size: number;
  stockQuantity: number;
}

export interface Product {
  id?: number; // For dummy data
  productId?: string; // From backend
  name?: string; // For dummy data
  productName?: string; // From backend
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: Category | string | any;
  brand: string;
  stock?: number;
  rating?: number;
  reviews?: number;
  origin?: string;
  material?: string;
  tax?: number;
  gender?: string;
  supplier?: Supplier | any;
  productDetails?: ProductDetail[];
}
