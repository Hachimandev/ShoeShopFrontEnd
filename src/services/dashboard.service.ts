import { customerService } from "@/services/customer.service";
import { orderService } from "@/services/order.service";
import { productService } from "@/services/product.service";
import type { DashboardRawData } from "@/types/dashboard";

export const dashboardService = {
  fetchDashboardData: async (): Promise<DashboardRawData> => {
    const [orders, products, customers, customerTotal] = await Promise.all([
      orderService.getAllOrders(),
      productService.getAllProducts(),
      customerService.getAllCustomers(),
      customerService.getTotalCustomerCount(),
    ]);
    return {
      orders,
      products,
      customers,
      customerTotal: Number(customerTotal),
    };
  },
};
