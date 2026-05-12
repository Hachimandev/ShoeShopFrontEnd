import api from "@/lib/api";
import type { Supplier } from "@/types/supplier";

export type { Supplier } from "@/types/supplier";

export const supplierService = {
  getAllSuppliers: async (): Promise<Supplier[]> => {
    const response = await api.get<Supplier[]>("/suppliers");
    return response.data;
  },

  getSupplierById: async (id: string): Promise<Supplier> => {
    const response = await api.get<Supplier>(
      `/suppliers/${encodeURIComponent(id)}`,
    );
    return response.data;
  },

  searchSuppliers: async (keyword: string): Promise<Supplier[]> => {
    const response = await api.get<Supplier[]>("/suppliers/search", {
      params: { keyword },
    });
    return response.data;
  },

  createSupplier: async (data: Supplier): Promise<Supplier> => {
    const response = await api.post<Supplier>("/suppliers", data);
    return response.data;
  },

  updateSupplier: async (id: string, data: Supplier): Promise<Supplier> => {
    const response = await api.put<Supplier>(
      `/suppliers/${encodeURIComponent(id)}`,
      data,
    );
    return response.data;
  },

  deleteSupplier: async (id: string): Promise<void> => {
    await api.delete(`/suppliers/${encodeURIComponent(id)}`);
  },

  exportToExcel: async (): Promise<Blob> => {
    const response = await api.get("/suppliers/export/excel", {
      responseType: "blob",
    });
    return response.data;
  },
};
