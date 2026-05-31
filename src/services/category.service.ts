import api from "@/lib/api";

export interface Category {
  categoryId: string;
  categoryName: string;
}

export const categoryService = {
  getAllCategories: async (signal?: AbortSignal): Promise<Category[]> => {
    const response = await api.get("/categories", { signal });
    return response.data;
  },
};
