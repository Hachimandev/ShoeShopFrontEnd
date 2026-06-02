"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { use } from "react";
import Image from "next/image";
import { orderService } from "@/services/order.service";
import { Order, OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Constants cho SePay QR (nên đưa vào .env trong thực tế)
  const bankName = process.env.NEXT_PUBLIC_SEPAY_BANK || "MBBank";
  const accountNumber = process.env.NEXT_PUBLIC_SEPAY_ACCOUNT || "123456789";

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(orderId);
        setOrder(data);

        // Nếu đã thanh toán, hiển thị thành công và chuyển hướng
        if (data.orderStatus === OrderStatus.PAID || data.orderStatus === OrderStatus.SHIPPING) {
          setIsSuccess(true);
          setTimeout(() => {
            router.push("/profile/orders");
          }, 3000);
        }
      } catch (err: any) {
        setError(err.message || "Không thể tải thông tin đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Polling mỗi 3 giây để kiểm tra trạng thái thanh toán
    const interval = setInterval(async () => {
      try {
        const data = await orderService.getOrderById(orderId);
        if (data.orderStatus === OrderStatus.PAID || data.orderStatus === OrderStatus.SHIPPING) {
          setOrder(data);
          setIsSuccess(true);
          clearInterval(interval);
          setTimeout(() => {
            router.push("/profile/orders");
          }, 3000);
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Lỗi tải thông tin</h2>
          <p className="text-slate-500 mb-6">{error || "Không tìm thấy đơn hàng"}</p>
          <Button onClick={() => router.push("/")}>Về trang chủ</Button>
        </div>
      </div>
    );
  }

  const qrUrl = `https://qr.sepay.vn/img?bank=${bankName}&acc=${accountNumber}&template=compact&amount=${order.totalAmount}&des=${encodeURIComponent(orderId)}`;

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 text-center">
            <h1 className="text-2xl font-bold mb-2">Thanh toán chuyển khoản</h1>
            <p className="text-slate-300">Mã đơn hàng: {orderId}</p>
          </div>

          <div className="p-8">
            {isSuccess ? (
              <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Thanh toán thành công!</h2>
                <p className="text-slate-500 mb-8">
                  Cảm ơn bạn. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
                  Hệ thống sẽ tự động chuyển hướng...
                </p>
                <Button onClick={() => router.push("/profile/orders")} className="w-full">
                  Xem đơn hàng ngay
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* QR Code */}
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 bg-white rounded-2xl border-2 border-primary/20 shadow-lg relative">
                    <Image
                      src={qrUrl}
                      alt="Payment QR Code"
                      width={300}
                      height={300}
                      className="rounded-xl"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">Quét mã QR để thanh toán</h3>
                    <p className="text-slate-500 mt-1">Sử dụng App ngân hàng hoặc Momo để quét mã</p>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-500">Ngân hàng</span>
                      <span className="font-semibold text-slate-900">{bankName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-500">Số tài khoản</span>
                      <span className="font-semibold text-slate-900">{accountNumber}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-500">Số tiền</span>
                      <span className="font-bold text-primary text-xl">
                        {order.totalAmount.toLocaleString()}đ
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Nội dung chuyển khoản</span>
                      <span className="font-mono bg-slate-200 px-3 py-1 rounded-lg font-semibold text-slate-900">
                        {orderId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-center gap-3 text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium animate-pulse">
                    Đang chờ thanh toán... Không đóng trình duyệt
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    className="flex-1 text-slate-600"
                    disabled={actionLoading}
                    onClick={async () => {
                      if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
                        setActionLoading(true);
                        try {
                          await orderService.updateOrderStatus(orderId, OrderStatus.CANCELLED);
                          alert("Hủy giao dịch thành công.");
                          router.push("/profile/orders");
                        } catch (e) {
                          alert("Có lỗi xảy ra khi hủy đơn hàng.");
                        } finally {
                          setActionLoading(false);
                        }
                      }
                    }}
                  >
                    Hủy giao dịch
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      alert("Hệ thống đang kiểm tra tự động. Vui lòng giữ màn hình này thêm ít phút để đợi tiền vào tài khoản nhé!");
                    }}
                  >
                    Tôi đã thanh toán
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
