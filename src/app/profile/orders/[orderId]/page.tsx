"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Package,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderDetailProduct } from "@/components/profile/order-detail-product";
import type { Order } from "@/types/order";
import { OrderStatus } from "@/types/order";
import { formatOrderVnd, orderStatusLabelVi } from "@/lib/customer-order-utils";
import { orderService } from "@/services/order.service";

interface PageParams {
  orderId: string;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [user, setUser] = useState<{ username?: string } | null>(null);

  useEffect(() => {
    const fetchUser = () => {
      try {
        const raw = localStorage.getItem("user");
        const parsed = raw ? JSON.parse(raw) : null;
        setUser(parsed);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await orderService.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Không thể tải chi tiết đơn hàng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleCancel = async () => {
    if (!order || !user?.username) return;

    const confirmed = confirm(
      "Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.",
    );
    if (!confirmed) return;

    setBusy(true);
    try {
      const cancelledOrder = await orderService.updateOrderStatus(
        order.orderId,
        OrderStatus.CANCELLED,
      );
      setOrder(cancelledOrder);

      alert("Đơn hàng đã được hủy thành công!");
    } catch (err) {
      console.error("Cancel order failed:", err);
      alert("Hủy đơn hàng thất bại. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  };

  const handleConfirmReceived = async () => {
    if (!order || !user?.username) return;

    const confirmed = confirm(
      "Bạn xác nhận đã nhận được hàng và tất cả sản phẩm đều như mô tả?",
    );
    if (!confirmed) return;

    setBusy(true);
    try {
      await orderService.confirmReceived(order.orderId, "");
      setOrder((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          orderStatus: OrderStatus.DELIVERED,
        };
      });
      alert("Xác nhận đã nhận hàng thành công!");
    } catch (err) {
      console.error("Confirm received failed:", err);
      alert("Xác nhận nhận hàng thất bại. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-amber-100 text-amber-900 border-0";
      case OrderStatus.AWAITING_CANCELLATION:
        return "bg-orange-100 text-orange-900 border-0";
      case OrderStatus.SHIPPING:
        return "bg-sky-100 text-sky-800 border-0";
      case OrderStatus.DELIVERED:
        return "bg-emerald-100 text-emerald-800 border-0";
      case OrderStatus.CANCELLED:
      case OrderStatus.RETURNED:
        return "bg-red-100 text-red-800 border-0";
      default:
        return "bg-slate-100 text-slate-800 border-0";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader2 className="mb-3 h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-600">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/profile/orders"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại danh sách đơn hàng</span>
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="text-red-800 mb-4">
            {error || "Không tìm thấy đơn hàng"}
          </p>
          <Button asChild variant="outline">
            <Link href="/profile/orders">Quay lại</Link>
          </Button>
        </div>
      </div>
    );
  }

  const orderDetails = (order.orderDetails || []) as Array<{
    productDetailId?: string;
    product?: {
      productId?: string;
      productName?: string;
      image?: string;
      price?: number;
    };
    quantity?: number;
    size?: number;
    color?: string;
    price?: number;
  }>;

  const subtotal = orderDetails.reduce((sum, item) => {
    return (
      sum + (item.price || item.product?.price || 0) * (item.quantity || 0)
    );
  }, 0);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/profile/orders"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại danh sách đơn</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Chi tiết đơn hàng
          </h1>
          <div className="w-32" />
        </div>

        <div className="grid gap-6">
          {/* Order Header Card */}
          <Card className="border-slate-200/90 shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-slate-200">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Package className="h-6 w-6 text-primary" />
                    <p className="font-mono text-lg font-bold text-slate-900">
                      #{order.orderId}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 pl-9">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {new Date(order.orderDate as string).toLocaleString(
                        "vi-VN",
                      )}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4" />
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2">
                  <Badge
                    className={`rounded-full font-semibold text-sm ${getStatusBadge(
                      order.orderStatus,
                    )}`}
                  >
                    {orderStatusLabelVi(order.orderStatus)}
                  </Badge>
                  <p className="text-right">
                    <span className="text-sm text-slate-600">Tổng tiền:</span>
                    <p className="text-3xl font-black text-primary mt-1">
                      {formatOrderVnd(order.totalAmount)}
                    </p>
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Products Section */}
            <div className="md:col-span-2 space-y-4">
              <Card className="border-slate-200/90 shadow-md">
                <CardHeader className="bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold text-slate-900">
                      Sản phẩm ({orderDetails.length})
                    </h2>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {orderDetails.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">
                      Không có sản phẩm nào
                    </p>
                  ) : (
                    orderDetails.map((detail, index) => (
                      <OrderDetailProduct
                        key={index}
                        orderDetail={detail}
                        index={index}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Summary Section */}
            <div className="space-y-4">
              <Card className="border-slate-200/90 shadow-md sticky top-4">
                <CardHeader className="bg-slate-50 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Tóm tắt đơn hàng
                  </h3>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <span className="text-sm text-slate-600">
                      Tiền hàng ({orderDetails.length} sản phẩm)
                    </span>
                    <span className="font-semibold text-slate-900">
                      {subtotal.toLocaleString("vi-VN")}₫
                    </span>
                  </div>

                  {order.usedPoints > 0 && (
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-sm text-slate-600">
                        Điểm tích lũy sử dụng
                      </span>
                      <span className="font-semibold text-slate-900">
                        -{order.usedPoints.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-slate-300 bg-primary/5 -mx-4 -mb-4 px-4 py-3 rounded-b-lg">
                    <span className="font-bold text-slate-900">
                      Tổng thanh toán
                    </span>
                    <span className="text-2xl font-black text-primary">
                      {formatOrderVnd(order.totalAmount)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Info Card */}
              {order.customer && (
                <Card className="border-slate-200/90 shadow-md">
                  <CardHeader className="bg-slate-50 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900">
                      Thông tin giao hàng
                    </h3>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3 text-sm">
                    <div className="flex gap-2">
                      <span className="text-slate-600 min-w-fit">
                        Người nhận:
                      </span>
                      <span className="font-medium text-slate-900">
                        {order.customer.fullName || "—"}
                      </span>
                    </div>
                    {order.customer.phoneNumber && (
                      <div className="flex gap-2 items-center">
                        <Phone className="h-4 w-4 text-slate-500 flex-shrink-0" />
                        <a
                          href={`tel:${order.customer.phoneNumber}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {order.customer.phoneNumber}
                        </a>
                      </div>
                    )}
                    {order.customer.email && (
                      <div className="flex gap-2 items-center">
                        <Mail className="h-4 w-4 text-slate-500 flex-shrink-0" />
                        <a
                          href={`mailto:${order.customer.email}`}
                          className="text-primary hover:underline font-medium truncate"
                        >
                          {order.customer.email}
                        </a>
                      </div>
                    )}
                    {order.customer.address && (
                      <div className="flex gap-2 pt-2">
                        <MapPin className="h-4 w-4 text-slate-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 leading-relaxed">
                          {order.customer.address}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="space-y-2">
                {order.orderStatus === OrderStatus.PENDING && (
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-700 hover:bg-red-50"
                    disabled={busy}
                    onClick={handleCancel}
                  >
                    {busy ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý…
                      </>
                    ) : (
                      "Hủy đơn hàng"
                    )}
                  </Button>
                )}

                {order.orderStatus === OrderStatus.SHIPPING && (
                  <Button
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                    disabled={busy}
                    onClick={handleConfirmReceived}
                  >
                    {busy ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý…
                      </>
                    ) : (
                      "Xác nhận đã nhận hàng"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
