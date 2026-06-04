"use client";

import { Loader2, Package } from "lucide-react";
import { CustomerOrderCard } from "@/components/profile/customer-order-card";
import { Button } from "@/components/ui/button";
import type { CustomerOrderTab } from "@/lib/customer-order-utils";
import { useMyOrders } from "@/hooks/use-my-orders";

const TABS: { id: CustomerOrderTab; label: string }[] = [
  { id: "pending", label: "Đang chờ" },
  { id: "shipping", label: "Đang giao" },
  { id: "delivered", label: "Đã giao" },
  { id: "cancelled", label: "Đã hủy" },
];

export function MyOrdersPanel() {
  const {
    visibleOrders,
    counts,
    activeTab,
    setActiveTab,
    loading,
    error,
    reload,
    actionOrderId,
    cancelPendingOrder,
    confirmOrderReceived,
  } = useMyOrders();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-600">
        <Loader2 className="mb-3 h-10 w-10 animate-spin text-primary" />
        <p className="text-sm">Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
          Đơn hàng của tôi
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Theo dõi và quản lý đơn hàng theo trạng thái
        </p>
      </div>

      {error && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ml-3 border-red-300"
            onClick={() => reload()}
          >
            Thử lại
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={[
              "relative rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === t.id
                ? "bg-white dark:bg-slate-900 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-800"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100",
            ].join(" ")}
          >
            {t.label}
            <span
              className={[
                "ml-1.5 tabular-nums",
                activeTab === t.id ? "text-primary" : "text-slate-400",
              ].join(" ")}
            >
              ({counts[t.id]})
            </span>
          </button>
        ))}
      </div>

      {visibleOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/20 py-16 text-center">
          <Package className="mb-3 h-14 w-14 text-slate-300 dark:text-slate-600" />
          <p className="font-medium text-slate-700 dark:text-slate-300">Chưa có đơn hàng</p>
          <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Không có đơn nào ở mục này.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {visibleOrders.map((order) => (
            <li key={order.orderId}>
              <CustomerOrderCard
                order={order}
                tab={activeTab}
                busy={actionOrderId === order.orderId}
                onCancel={() => cancelPendingOrder(order.orderId)}
                onConfirmReceived={() => confirmOrderReceived(order.orderId)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
