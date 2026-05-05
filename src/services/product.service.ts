import api from "@/lib/api";
import { Product } from "@/types/product";

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get("/products");
    return response.data;
  },

  getProductById: async (id: string | number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    const response = await api.get(`/products?category=${categoryId}`);
    return response.data;
  },
};
