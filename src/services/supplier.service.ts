import api from "@/lib/api";

export interface Supplier {
  supplierId: string;
  supplierName: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
}

export const supplierService = {
  getAllSuppliers: async (): Promise<Supplier[]> => {
    const response = await api.get("/suppliers");
    return response.data;
  },
};
