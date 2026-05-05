import api from "@/lib/api";
import {
  Customer,
  CustomerDTO,
  UpdateCustomerDTO,
  CustomerSearchParams,
  PaginatedResponse,
} from "@/types/customer";

export const customerService = {
  getLoyaltyPoints: async (username: string): Promise<number> => {
    const response = await api.get(`/customers/points/${username}`);
    return response.data;
  },

  getCustomer: async (username: string): Promise<Customer> => {
    const response = await api.get(`/customers/${username}`);
    return response.data;
  },

  getCustomerInfo: async (username: string): Promise<CustomerDTO> => {
    const response = await api.get(`/customers/info/${username}`);
    return response.data;
  },

  updateCustomerInfo: async (
    username: string,
    dto: UpdateCustomerDTO,
  ): Promise<Customer> => {
    const response = await api.put(`/customers/update/${username}`, dto);
    return response.data;
  },

  getAllCustomers: async (): Promise<Customer[]> => {
    const response = await api.get(`/customers/list/all`);
    return response.data;
  },

  searchCustomers: async (
    params: CustomerSearchParams,
  ): Promise<PaginatedResponse<Customer>> => {
    const response = await api.get(`/customers/search`, { params });
    return response.data;
  },

  getNewCustomersThisMonth: async (): Promise<number> => {
    const response = await api.get(`/customers/stats/new-this-month`);
    return response.data;
  },

  getTotalCustomerCount: async (): Promise<number> => {
    const response = await api.get(`/customers/stats/total-count`);
    return response.data;
  },

  exportCustomersToExcel: async (): Promise<Blob> => {
    const response = await api.get(`/customers/export/excel`, {
      responseType: "blob",
    });
    return response.data;
  },
};
