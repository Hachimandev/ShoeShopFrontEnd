"use client";

import Link from "next/link";
import { Calendar, CreditCard, Package, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Order } from "@/types/order";
import { OrderStatus } from "@/types/order";
import { formatOrderVnd, orderStatusLabelVi } from "@/lib/customer-order-utils";

function lineTitle(detail: {
  product?: { productName?: string };
  quantity?: number;
}): string {
  const name = detail.product?.productName ?? "Sản phẩm";
  const q = detail.quantity ?? 0;
  return q > 1 ? `${name} × ${q}` : name;
}

interface CustomerOrderCardProps {
  order: Order;
  tab: "pending" | "shipping" | "delivered" | "cancelled";
  busy: boolean;
  onCancel?: () => void;
  onConfirmReceived?: () => void;
}

export function CustomerOrderCard({
  order,
  tab,
  busy,
  onCancel,
  onConfirmReceived,
}: CustomerOrderCardProps) {
  const details = (order.orderDetails ?? []) as Array<{
    product?: { productName?: string };
    quantity?: number;
  }>;

  const statusBadge = (() => {
    const s = order.orderStatus;
    if (s === OrderStatus.PENDING)
      return "bg-amber-100 text-amber-900 border-0";
    if (s === OrderStatus.PAID)
      return "bg-teal-100 text-teal-900 border-0";
    if (s === OrderStatus.AWAITING_CANCELLATION)
      return "bg-orange-100 text-orange-900 border-0";
    if (s === OrderStatus.SHIPPING) return "bg-sky-100 text-sky-800 border-0";
    if (s === OrderStatus.DELIVERED)
      return "bg-emerald-100 text-emerald-800 border-0";
    if (s === OrderStatus.CANCELLED || s === OrderStatus.RETURNED)
      return "bg-red-100 text-red-800 border-0";
    return "bg-slate-100 text-slate-800 border-0";
  })();

  return (
    <Card className="overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900/60">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-850 shadow-sm">
              <Package className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
                #{order.orderId.slice(0, 12)}
                {order.orderId.length > 12 ? "…" : ""}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(order.orderDate as string).toLocaleString("vi-VN")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5" />
                  {order.paymentMethod}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Badge className={`rounded-full font-normal ${statusBadge}`}>
              {orderStatusLabelVi(order.orderStatus)}
            </Badge>
            <p className="text-xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
              {formatOrderVnd(order.totalAmount)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Sản phẩm
          </p>
          <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
            {details.length === 0 ? (
              <li className="text-slate-500 dark:text-slate-400">—</li>
            ) : (
              details.slice(0, 5).map((d, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span className="min-w-0 truncate">{lineTitle(d)}</span>
                </li>
              ))
            )}
            {details.length > 5 && (
              <li className="text-xs text-slate-500 dark:text-slate-450">
                +{details.length - 5} mục khác
              </li>
            )}
          </ul>
        </div>

        {tab === "pending" && order.orderStatus === OrderStatus.PENDING && (
          <div className="flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <Button
              asChild
              className="flex-1 bg-primary text-white hover:bg-primary/90"
            >
              <Link href={`/profile/orders/${order.orderId}`}>
                Xem chi tiết
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
              disabled={busy}
              onClick={onCancel}
            >
              {busy ? "Đang xử lý…" : "Hủy đơn hàng"}
            </Button>
          </div>
        )}

        {tab === "pending" &&
          order.orderStatus === OrderStatus.AWAITING_CANCELLATION && (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <Button asChild variant="outline">
                <Link href={`/profile/orders/${order.orderId}`}>
                  Xem chi tiết
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-sm text-orange-800 dark:text-orange-300 py-2 px-4 bg-orange-50 dark:bg-orange-950/20 rounded border border-orange-200 dark:border-orange-900/50 flex-1">
                Yêu cầu hủy đã được gửi. Vui lòng chờ cửa hàng xác nhận.
              </p>
            </div>
          )}

        {tab === "pending" && order.orderStatus === OrderStatus.PAID && (
          <div className="flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <Button
              asChild
              className="flex-1 bg-primary text-white hover:bg-primary/90"
            >
              <Link href={`/profile/orders/${order.orderId}`}>
                Xem chi tiết
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        {tab === "shipping" && (
          <div className="flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <Button asChild variant="outline">
              <Link href={`/profile/orders/${order.orderId}`}>
                Xem chi tiết
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              type="button"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={busy}
              onClick={onConfirmReceived}
            >
              {busy ? "Đang xử lý…" : "Đã nhận hàng"}
            </Button>
          </div>
        )}

        {(tab === "delivered" || tab === "cancelled") && (
          <div className="flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <Button asChild className="flex-1">
              <Link href={`/profile/orders/${order.orderId}`}>
                Xem chi tiết
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
