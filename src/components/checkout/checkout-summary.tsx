"use client";

import { Button } from "@/components/ui/button";
import { Cart } from "@/types/cart";

interface CheckoutSummaryProps {
  cart: Cart;
  shippingFee: number;
  tax: number;
  total: number;
  onSubmit: () => void;
  disabled: boolean;
  loading: boolean;
  error: string | null;
}

export function CheckoutSummary({
  cart,
  shippingFee,
  tax,
  total,
  onSubmit,
  disabled,
  loading,
  error,
}: CheckoutSummaryProps) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Tóm tắt đơn hàng</h2>
        <p className="text-sm text-slate-500">
          Kiểm tra lại giỏ hàng và phương thức thanh toán.
        </p>
      </div>

      <div className="space-y-3 border-b border-slate-200 pb-4">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Tạm tính</span>
          <span>${cart.totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Phí vận chuyển</span>
          <span>${shippingFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Thuế</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-lg font-bold">
        <span>Tổng cộng</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {error ? (
        <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Button className="w-full h-14" onClick={onSubmit} disabled={disabled}>
        {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
      </Button>
    </div>
  );
}
