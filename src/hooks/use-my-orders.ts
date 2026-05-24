"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "@/services/auth.service";
import { orderService } from "@/services/order.service";
import { OrderStatus, type Order } from "@/types/order";
import {
  type CustomerOrderTab,
  filterOrdersByTab,
} from "@/lib/customer-order-utils";

export function useMyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CustomerOrderTab>("pending");
  const [actionOrderId, setActionOrderId] = useState<string | null>(null);

  const resolveCustomerId = useCallback(async (): Promise<string | null> => {
    const username =
      typeof window !== "undefined" ? localStorage.getItem("username") : null;
    if (!username) return null;
    try {
      const info = await authService.getCurrentUser(username);
      return info.customer?.customerId ?? null;
    } catch {
      return null;
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cid = await resolveCustomerId();
      if (!cid) {
        setError(
          "Không tìm thấy tài khoản khách hàng. Vui lòng đăng nhập lại.",
        );
        setOrders([]);
        setCustomerId(null);
        return;
      }
      setCustomerId(cid);
      const all = await orderService.getAllOrders();
      const mine = all.filter(
        (o) =>
          o.customer &&
          typeof o.customer === "object" &&
          (o.customer as { customerId?: string }).customerId === cid,
      );
      mine.sort((a, b) => {
        const ta = new Date(a.orderDate as string).getTime();
        const tb = new Date(b.orderDate as string).getTime();
        return tb - ta;
      });
      setOrders(mine);
    } catch (e) {
      console.error(e);
      setError("Không tải được đơn hàng.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [resolveCustomerId]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const tabs: CustomerOrderTab[] = [
      "pending",
      "shipping",
      "delivered",
      "cancelled",
    ];
    return Object.fromEntries(
      tabs.map((t) => [t, filterOrdersByTab(orders, t).length]),
    ) as Record<CustomerOrderTab, number>;
  }, [orders]);

  const visibleOrders = useMemo(
    () => filterOrdersByTab(orders, activeTab),
    [orders, activeTab],
  );

  const cancelPendingOrder = useCallback(
    async (orderId: string) => {
      if (!customerId) return;
      if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
      setActionOrderId(orderId);
      setError(null);
      try {
        await orderService.updateOrderStatus(orderId, OrderStatus.CANCELLED);
        await load();
      } catch (e: unknown) {
        console.error(e);
        const msg =
          e &&
          typeof e === "object" &&
          "response" in e &&
          (e as { response?: { data?: { message?: string } } }).response?.data
            ?.message;
        setError(
          typeof msg === "string" ? msg : "Không hủy được đơn. Thử lại sau.",
        );
      } finally {
        setActionOrderId(null);
      }
    },
    [customerId, load],
  );

  const confirmOrderReceived = useCallback(
    async (orderId: string) => {
      if (!customerId) return;
      if (!confirm("Xác nhận bạn đã nhận được hàng?")) return;
      setActionOrderId(orderId);
      setError(null);
      try {
        await orderService.confirmReceived(orderId, customerId);
        await load();
      } catch (e: unknown) {
        console.error(e);
        const msg =
          e &&
          typeof e === "object" &&
          "response" in e &&
          (e as { response?: { data?: { message?: string } } }).response?.data
            ?.message;
        setError(
          typeof msg === "string"
            ? msg
            : "Không cập nhật được trạng thái. Thử lại sau.",
        );
      } finally {
        setActionOrderId(null);
      }
    },
    [customerId, load],
  );

  return {
    orders,
    visibleOrders,
    counts,
    activeTab,
    setActiveTab,
    loading,
    error,
    setError,
    reload: load,
    customerId,
    actionOrderId,
    cancelPendingOrder,
    confirmOrderReceived,
  };
}
