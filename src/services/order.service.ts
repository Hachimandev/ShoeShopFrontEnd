import api from "@/lib/api";
import {
  OrderRequest,
  OrderResponseDTO,
  Order,
  Cart,
  CartSummary,
  OrderStatus
} from "@/types/order";

export const orderService = {
  // Checkout và tạo order từ cart
  checkout: async (request: OrderRequest): Promise<OrderResponseDTO> => {
    const response = await api.post("/orders/checkout", request);
    return response.data;
  },

  // Lấy tất cả orders
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get("/orders");
    return response.data;
  },

  // Lấy order theo ID
  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Cập nhật trạng thái order
  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const response = await api.put(`/orders/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  // Hủy order
  cancelOrder: async (id: string, customerId: string, approve: boolean): Promise<Order> => {
    const response = await api.post(`/orders/${id}/cancel`, null, {
      params: { customerId, approve }
    });
    return response.data;
  },

  // Tính toán giá cuối cùng cho cart
  calculateFinalPrice: async (cart: Cart): Promise<number> => {
    const response = await api.post("/orders/calculate-price", cart);
    return response.data;
  },

  // Lấy tóm tắt cart
  getCartSummary: async (cart: Cart): Promise<CartSummary> => {
    const response = await api.post("/orders/cart-summary", cart);
    return response.data;
  },

  // Lấy customer ID từ username
  getCustomerIdByUsername: async (username: string): Promise<string> => {
    const response = await api.get(`/orders/customer/${username}`);
    return response.data;
  },

  // Lấy recent orders
  getRecentOrders: async (limit: number = 10): Promise<Order[]> => {
    const response = await api.get(`/orders/recent?limit=${limit}`);
    return response.data;
  },

  // Export to Excel
  exportToExcel: async (): Promise<Blob> => {
    const response = await api.get("/orders/export", {
      responseType: 'blob'
    });
    return response.data;
  }
};