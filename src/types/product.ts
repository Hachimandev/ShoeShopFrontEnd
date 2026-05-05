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
  id?: number;
  productId?: string;
  name?: string;
  productName?: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: string | Category;
  brand: string;
  stock: number;
  rating: number;
  reviews: number;
  productDetails?: ProductDetail[];
}
