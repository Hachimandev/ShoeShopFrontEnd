import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order } from "@/types/order";
import { OrderStatus } from "@/types/order";
import { firstProductName, parseOrderDate } from "@/lib/dashboard-stats";

function statusLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.DELIVERED:
      return "Hoàn thành";
    case OrderStatus.PENDING:
    case OrderStatus.AWAITING_CANCELLATION:
      return "Đang xử lý";
    case OrderStatus.SHIPPING:
      return "Đang giao";
    case OrderStatus.CANCELLED:
    case OrderStatus.RETURNED:
      return "Đã hủy / trả";
    default:
      return String(status).replace(/_/g, " ");
  }
}

function statusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.DELIVERED:
      return "border-0 bg-emerald-100 font-normal text-emerald-800 hover:bg-emerald-100";
    case OrderStatus.SHIPPING:
      return "border-0 bg-sky-100 font-normal text-sky-800 hover:bg-sky-100";
    case OrderStatus.PENDING:
    case OrderStatus.AWAITING_CANCELLATION:
      return "border-0 bg-amber-100 font-normal text-amber-900 hover:bg-amber-100";
    case OrderStatus.CANCELLED:
    case OrderStatus.RETURNED:
      return "border-0 bg-red-100 font-normal text-red-800 hover:bg-red-100";
    default:
      return "border-0 bg-slate-100 font-normal text-slate-800";
  }
}

interface DashboardRecentOrdersProps {
  orders: Order[];
  formatCurrency: (n: number) => string;
}

export function DashboardRecentOrders({
  orders,
  formatCurrency,
}: DashboardRecentOrdersProps) {
  return (
    <Card className="rounded-xl border border-slate-200/90 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-slate-900">
          Đơn hàng gần đây
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-8 gap-0.5 text-blue-600" asChild>
          <Link href="/admin">
            Xem tất cả
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Mã đơn</th>
                <th className="px-4 py-3 font-medium">Khách hàng</th>
                <th className="px-4 py-3 font-medium">Sản phẩm</th>
                <th className="px-4 py-3 font-medium">Tổng tiền</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    Chưa có đơn hàng.
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const d = parseOrderDate(o);
                  const cust = o.customer as { fullName?: string } | undefined;
                  return (
                    <tr
                      key={o.orderId}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-slate-800">
                        #{o.orderId.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {cust?.fullName ?? "—"}
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-slate-600">
                        {firstProductName(o)}
                      </td>
                      <td className="px-4 py-3 tabular-nums font-semibold text-slate-900">
                        {formatCurrency(o.totalAmount ?? 0)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`rounded-full ${statusBadgeClass(o.orderStatus)}`}
                        >
                          {statusLabel(o.orderStatus)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                        {d
                          ? d.toLocaleDateString("vi-VN")
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
