import api from "@/lib/api";
import { Product } from "@/types/product";

export const productService = {
  getAllProducts: async (
    params?: {
      searchTerm?: string;
      category?: string;
      brand?: string;
      gender?: string;
      minPrice?: number;
      maxPrice?: number;
      sort?: string;
    },
    signal?: AbortSignal
  ): Promise<Product[]> => {
    const response = await api.get("/products", { params, signal });
    return response.data;
  },

  getProductById: async (id: string | number, signal?: AbortSignal): Promise<Product> => {
    const response = await api.get(`/products/${id}`, { signal });
    return response.data;
  },

  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    const response = await api.get(`/products?category=${categoryId}`);
    return response.data;
  },

  createProduct: async (data: Partial<Product>): Promise<Product> => {
    const response = await api.post("/products", data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<{ imageUrl: string }>("/products/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.imageUrl;
  },
};
