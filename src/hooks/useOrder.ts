import { useState, useCallback } from "react";
import { orderService } from "@/services/order.service";
import {
  OrderRequest,
  OrderResponseDTO,
  Order,
  Cart,
  CartSummary,
  OrderStatus,
  PaymentMethod,
} from "@/types/order";

interface UseOrderReturn {
  // State
  loading: boolean;
  error: string | null;

  // Checkout functions
  checkout: (request: OrderRequest) => Promise<OrderResponseDTO | null>;
  calculatePrice: (cart: Cart) => Promise<number | null>;
  getCartSummary: (cart: Cart) => Promise<CartSummary | null>;

  // Order management
  getAllOrders: () => Promise<Order[] | null>;
  getOrderById: (id: string) => Promise<Order | null>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<Order | null>;
  cancelOrder: (
    id: string,
    customerId: string,
    approve: boolean,
  ) => Promise<Order | null>;

  // Utility functions
  getCustomerIdByUsername: (username: string) => Promise<string | null>;
  getRecentOrders: (limit?: number) => Promise<Order[] | null>;
  exportToExcel: () => Promise<Blob | null>;

  // Helper functions
  clearError: () => void;
}

export function useOrder(): UseOrderReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: any) => {
    console.error("Order service error:", err);
    if (err?.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err?.message) {
      setError(err.message);
    } else {
      setError("An unexpected error occurred");
    }
    return null;
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkout = useCallback(
    async (request: OrderRequest): Promise<OrderResponseDTO | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await orderService.checkout(request);
        return result;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const calculatePrice = useCallback(
    async (cart: Cart): Promise<number | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await orderService.calculateFinalPrice(cart);
        return result;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getCartSummary = useCallback(
    async (cart: Cart): Promise<CartSummary | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await orderService.getCartSummary(cart);
        return result;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getAllOrders = useCallback(async (): Promise<Order[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await orderService.getAllOrders();
      return result;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderById = useCallback(
    async (id: string): Promise<Order | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await orderService.getOrderById(id);
        return result;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateOrderStatus = useCallback(
    async (id: string, status: OrderStatus): Promise<Order | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await orderService.updateOrderStatus(id, status);
        return result;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const cancelOrder = useCallback(
    async (
      id: string,
      customerId: string,
      approve: boolean,
    ): Promise<Order | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await orderService.cancelOrder(id, customerId, approve);
        return result;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getCustomerIdByUsername = useCallback(
    async (username: string): Promise<string | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await orderService.getCustomerIdByUsername(username);
        return result;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getRecentOrders = useCallback(
    async (limit: number = 10): Promise<Order[] | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await orderService.getRecentOrders(limit);
        return result;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const exportToExcel = useCallback(async (): Promise<Blob | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await orderService.exportToExcel();
      return result;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    checkout,
    calculatePrice,
    getCartSummary,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getCustomerIdByUsername,
    getRecentOrders,
    exportToExcel,
    clearError,
  };
}
