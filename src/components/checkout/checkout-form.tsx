"use client";

import { CustomerDTO } from "@/types/customer";
import { PaymentMethod } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface CheckoutFormProps {
  customerInfo: CustomerDTO;
  onCustomerInfoChange: (value: CustomerDTO) => void;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (value: PaymentMethod) => void;
  shippingMethod: "STANDARD" | "EXPRESS";
  onShippingMethodChange: (value: "STANDARD" | "EXPRESS") => void;
  note: string;
  onNoteChange: (value: string) => void;
  saveInfo: boolean;
  onSaveInfoChange: (value: boolean) => void;
}

export function CheckoutForm({
  customerInfo,
  onCustomerInfoChange,
  paymentMethod,
  onPaymentMethodChange,
  shippingMethod,
  onShippingMethodChange,
  note,
  onNoteChange,
  saveInfo,
  onSaveInfoChange,
}: CheckoutFormProps) {
  const updateField = (field: keyof CustomerDTO, value: string) => {
    onCustomerInfoChange({
      ...customerInfo,
      [field]: value,
    });
  };
  const paymentLabels: Record<string, string> = {
    [PaymentMethod.CASH]: "Thanh toán khi nhận hàng",
    [PaymentMethod.CREDIT_CARD]: "Visa, Mastercard (Thẻ)",
    [PaymentMethod.PAYPAL]: "PayPal (Ví điện tử)",
    [PaymentMethod.BANK_TRANSFER]: "Chuyển khoản ngân hàng",
  };

  return (
    <div className="space-y-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold mb-3">Shipping Information</h2>
        <p className="text-sm text-slate-500">
          Nhập thông tin giao hàng và lưu để dùng lần sau.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
          <Input
            id="fullName"
            value={customerInfo.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="Nguyen Van A"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
          <Input
            id="phoneNumber"
            value={customerInfo.phoneNumber}
            onChange={(e) => updateField("phoneNumber", e.target.value)}
            placeholder="0912345678"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            value={customerInfo.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="example@mail.com"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="address">Street / House</FieldLabel>
          <Input
            id="address"
            value={customerInfo.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="Số nhà, tên đường"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="ward">Ward</FieldLabel>
          <Input
            id="ward"
            value={customerInfo.ward}
            onChange={(e) => updateField("ward", e.target.value)}
            placeholder="Phường/Xã"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="district">District</FieldLabel>
          <Input
            id="district"
            value={customerInfo.district}
            onChange={(e) => updateField("district", e.target.value)}
            placeholder="Quận/Huyện"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="city">City</FieldLabel>
          <Input
            id="city"
            value={customerInfo.city}
            onChange={(e) => updateField("city", e.target.value)}
            placeholder="Tỉnh/Thành phố"
          />
        </Field>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-3">Shipping method</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className={`rounded-2xl border p-4 text-left transition ${
                shippingMethod === "STANDARD"
                  ? "border-primary bg-primary/10"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
              onClick={() => onShippingMethodChange("STANDARD")}
            >
              <p className="font-semibold">Giao hàng tiêu chuẩn</p>
              <p className="text-sm text-slate-500">3-5 ngày làm việc</p>
            </button>
            <button
              type="button"
              className={`rounded-2xl border p-4 text-left transition ${
                shippingMethod === "EXPRESS"
                  ? "border-primary bg-primary/10"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
              onClick={() => onShippingMethodChange("EXPRESS")}
            >
              <p className="font-semibold">Giao hàng nhanh</p>
              <p className="text-sm text-slate-500">1-2 ngày làm việc</p>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Payment method</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.values(PaymentMethod).map((method) => (
              <button
                key={method}
                type="button"
                className={`rounded-2xl border p-4 text-left transition ${
                  paymentMethod === method
                    ? "border-primary bg-primary/10"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
                onClick={() => onPaymentMethodChange(method)}
              >
                <p className="font-semibold">{method.replace("_", " ")}</p>
                <p className="text-sm text-slate-500">
                  {paymentLabels[method] || "Phương thức khác"}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Field>
          <FieldLabel htmlFor="note">Ghi chú đơn hàng</FieldLabel>
          <textarea
            id="note"
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            className="w-full min-h-[120px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Ghi chú thêm cho người giao hàng..."
          />
        </Field>
        <div className="flex items-center gap-3">
          <input
            id="saveInfo"
            type="checkbox"
            checked={saveInfo}
            onChange={(e) => onSaveInfoChange(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
          />
          <label htmlFor="saveInfo" className="text-sm text-slate-700">
            Lưu thông tin giao hàng cho lần mua sau
          </label>
        </div>
      </div>
    </div>
  );
}
