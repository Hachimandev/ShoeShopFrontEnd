import { useCallback, useState } from "react";
import { customerService } from "@/services/customer.service";
import {
  Customer,
  CustomerDTO,
  UpdateCustomerDTO,
  CustomerSearchParams,
  PaginatedResponse,
} from "@/types/customer";

interface UseCustomerReturn {
  loading: boolean;
  error: string | null;
  clearError: () => void;
  getLoyaltyPoints: (username: string) => Promise<number | null>;
  getCustomer: (username: string) => Promise<Customer | null>;
  getCustomerInfo: (username: string) => Promise<CustomerDTO | null>;
  updateCustomerInfo: (
    username: string,
    dto: UpdateCustomerDTO,
  ) => Promise<Customer | null>;
  getAllCustomers: () => Promise<Customer[] | null>;
  searchCustomers: (
    params: CustomerSearchParams,
  ) => Promise<PaginatedResponse<Customer> | null>;
  getNewCustomersThisMonth: () => Promise<number | null>;
  getTotalCustomerCount: () => Promise<number | null>;
  exportCustomersToExcel: () => Promise<Blob | null>;
}

export function useCustomer(): UseCustomerReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleError = (err: any) => {
    console.error("Customer service error:", err);
    if (err?.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err?.message) {
      setError(err.message);
    } else {
      setError("An unexpected error occurred.");
    }
    return null;
  };

  const getLoyaltyPoints = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      return await customerService.getLoyaltyPoints(username);
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCustomer = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      return await customerService.getCustomer(username);
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCustomerInfo = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      return await customerService.getCustomerInfo(username);
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCustomerInfo = useCallback(
    async (username: string, dto: UpdateCustomerDTO) => {
      setLoading(true);
      setError(null);
      try {
        return await customerService.updateCustomerInfo(username, dto);
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getAllCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await customerService.getAllCustomers();
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCustomers = useCallback(async (params: CustomerSearchParams) => {
    setLoading(true);
    setError(null);
    try {
      return await customerService.searchCustomers(params);
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getNewCustomersThisMonth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await customerService.getNewCustomersThisMonth();
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTotalCustomerCount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await customerService.getTotalCustomerCount();
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportCustomersToExcel = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await customerService.exportCustomersToExcel();
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    clearError,
    getLoyaltyPoints,
    getCustomer,
    getCustomerInfo,
    updateCustomerInfo,
    getAllCustomers,
    searchCustomers,
    getNewCustomersThisMonth,
    getTotalCustomerCount,
    exportCustomersToExcel,
  };
}
