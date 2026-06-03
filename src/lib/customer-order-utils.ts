import type { Order } from "@/types/order";
import { OrderStatus } from "@/types/order";

export type CustomerOrderTab = "pending" | "shipping" | "delivered" | "cancelled";

export function filterOrdersByTab(
  orders: Order[],
  tab: CustomerOrderTab,
): Order[] {
  return orders.filter((o) => {
    const s = o.orderStatus;
    switch (tab) {
      case "pending":
        return (
          s === OrderStatus.PENDING ||
          s === OrderStatus.AWAITING_CANCELLATION ||
          s === OrderStatus.PAID
        );
      case "shipping":
        return s === OrderStatus.SHIPPING;
      case "delivered":
        return s === OrderStatus.DELIVERED;
      case "cancelled":
        return s === OrderStatus.CANCELLED || s === OrderStatus.RETURNED;
      default:
        return false;
    }
  });
}

export function orderStatusLabelVi(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return "Chờ xác nhận";
    case OrderStatus.PAID:
      return "Đã thanh toán";
    case OrderStatus.AWAITING_CANCELLATION:
      return "Chờ xác nhận hủy";
    case OrderStatus.SHIPPING:
      return "Đang giao hàng";
    case OrderStatus.DELIVERED:
      return "Đã giao";
    case OrderStatus.CANCELLED:
      return "Đã hủy";
    case OrderStatus.RETURNED:
      return "Đã trả hàng";
    default:
      return String(status);
  }
}

export function formatOrderVnd(n: number | undefined): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n ?? 0);
}
