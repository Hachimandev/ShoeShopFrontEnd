"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { orderService } from "@/services/order.service";
import { Order, OrderStatus } from "@/types/order";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Eye,
  Calendar,
  CreditCard,
  User,
  Upload
} from "lucide-react";

const PAGE_SIZE = 10;

const filterSelectClass =
  "h-11 min-w-[200px] shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20";

function formatVnd(n: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
}

const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: OrderStatus.PENDING, label: "Chờ xử lý" },
  { value: OrderStatus.PAID, label: "Đã thanh toán" },
  { value: OrderStatus.SHIPPING, label: "Đang giao hàng" },
  { value: OrderStatus.DELIVERED, label: "Đã giao hàng" },
  { value: OrderStatus.CANCELLED, label: "Đã hủy" },
  { value: OrderStatus.AWAITING_CANCELLATION, label: "Chờ hủy" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getAllOrders();
      const sortedData = data.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
      setOrders(sortedData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      await orderService.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Cập nhật trạng thái thất bại.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return { label: "Chờ xử lý", class: "bg-amber-100 text-amber-700 border-amber-200" };
      case OrderStatus.PAID:
        return { label: "Đã thanh toán", class: "bg-teal-100 text-teal-700 border-teal-200" };
      case OrderStatus.SHIPPING:
        return { label: "Đang giao", class: "bg-blue-100 text-blue-700 border-blue-200" };
      case OrderStatus.DELIVERED:
        return { label: "Đã giao", class: "bg-emerald-100 text-emerald-700 border-emerald-200" };
      case OrderStatus.CANCELLED:
      case OrderStatus.RETURNED:
        return { label: "Đã hủy/trả", class: "bg-rose-100 text-rose-700 border-rose-200" };
      case OrderStatus.AWAITING_CANCELLATION:
        return { label: "Chờ hủy", class: "bg-orange-100 text-orange-700 border-orange-200" };
      default:
        return { label: status, class: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.orderStatus === OrderStatus.PENDING).length,
      delivered: orders.filter(o => o.orderStatus === OrderStatus.DELIVERED).length,
      cancelled: orders.filter(o => o.orderStatus === OrderStatus.CANCELLED).length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = 
        o.orderId.toLowerCase().includes(search.toLowerCase()) ||
        o.customer?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        o.customer?.email?.toLowerCase().includes(search.toLowerCase());
      
      const matchStatus = statusFilter === "all" || o.orderStatus === statusFilter;
      
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, page]);

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Quản lý đơn hàng
            </h1>
            <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-0.5 text-sm font-medium text-sky-800">
              {stats.total} đơn hàng
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Theo dõi và quản lý trạng thái đơn hàng của khách hàng.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-10 rounded-lg border-emerald-600 text-emerald-700 hover:bg-emerald-50"
          onClick={() => {}}
          disabled={exporting}
        >
          <Upload className="mr-2 h-4 w-4" />
          Xuất Excel
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm transition hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Tổng đơn hàng</p>
              <p className="text-3xl font-bold tabular-nums text-slate-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm transition hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Chờ xử lý</p>
              <p className="text-3xl font-bold tabular-nums text-slate-900">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm transition hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Hoàn thành</p>
              <p className="text-3xl font-bold tabular-nums text-slate-900">{stats.delivered}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm transition hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Đã hủy</p>
              <p className="text-3xl font-bold tabular-nums text-slate-900">{stats.cancelled}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Tìm mã đơn, tên khách, email..."
                value={search}
                onChange={(e) => {
                   setSearch(e.target.value);
                   setPage(1);
                }}
                className="h-11 rounded-lg border-slate-200 bg-white pl-10 shadow-sm placeholder:text-slate-400 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className={filterSelectClass}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                className="h-11 shrink-0 rounded-lg border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                onClick={() => {}}
                disabled={exporting}
              >
                {exporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Xuất Excel
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Mã đơn hàng</th>
                  <th className="px-6 py-4 font-semibold">Khách hàng</th>
                  <th className="px-6 py-4 font-semibold">Ngày đặt</th>
                  <th className="px-6 py-4 font-semibold">Tổng tiền</th>
                  <th className="px-6 py-4 font-semibold">Trạng thái</th>
                  <th className="px-6 py-4 font-semibold text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Không tìm thấy đơn hàng nào.
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => {
                    const statusInfo = getStatusInfo(order.orderStatus);
                    return (
                      <tr key={order.orderId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                            #{order.orderId.substring(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                              <User className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-slate-900 truncate max-w-[150px]">
                                {order.customer?.fullName || "Khách lẻ"}
                              </div>
                              <div className="text-xs text-slate-500 truncate max-w-[150px]">
                                {order.customer?.email || "—"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              <span>{new Date(order.orderDate).toLocaleDateString("vi-VN")}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(order.orderDate).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{formatVnd(order.totalAmount)}</div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <CreditCard className="h-3 w-3" />
                            {order.paymentMethod}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <select
                            className={`text-xs font-bold py-1.5 pl-3 pr-8 rounded-full border-0 focus:ring-2 focus:ring-orange-500/20 shadow-sm appearance-none cursor-pointer ${statusInfo.class}`}
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order.orderId, e.target.value as OrderStatus)}
                            disabled={updatingId === order.orderId}
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
                          >
                            {Object.values(OrderStatus).map((status) => (
                              <option key={status} value={status} className="bg-white text-slate-900 font-normal">
                                {status.replace("_", " ")}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-400 hover:text-orange-500 hover:bg-orange-50">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 md:p-6 flex items-center justify-between border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Hiển thị <span className="font-medium text-slate-900">{paginatedOrders.length}</span> trên <span className="font-medium text-slate-900">{filteredOrders.length}</span> đơn hàng
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg"
              >
                Trước
              </Button>
              <div className="flex items-center px-4 text-sm font-medium">
                Trang {page} / {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="rounded-lg"
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}