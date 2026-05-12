import api from "@/lib/api";

export interface Category {
  categoryId: string;
  categoryName: string;
}

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    return response.data;
  },
};
