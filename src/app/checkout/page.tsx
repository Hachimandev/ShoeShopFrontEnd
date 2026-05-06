"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart.context";
import { useCustomer } from "@/hooks/useCustomer";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { CustomerDTO } from "@/types/customer";
import { PaymentMethod } from "@/types/order";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { customerService } from "@/services/customer.service";
import { orderService } from "@/services/order.service";

const STORAGE_KEY = "checkoutCustomerInfo";

const emptyCustomerInfo: CustomerDTO = {
  fullName: "",
  email: "",
  phoneNumber: "",
  address: "",
  ward: "",
  district: "",
  city: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, convertToBackendCart } = useCart();
  const {
    getCustomer,
    getCustomerInfo,
    updateCustomerInfo,
    error: customerError,
  } = useCustomer();

  // State quản lý
  const [isMounted, setIsMounted] = useState(false);
  const [customerInfo, setCustomerInfo] =
    useState<CustomerDTO>(emptyCustomerInfo);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [saveInfo, setSaveInfo] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH,
  );
  const [shippingMethod, setShippingMethod] = useState<"STANDARD" | "EXPRESS">(
    "STANDARD",
  );
  const [note, setNote] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Đánh dấu đã mount để tránh lỗi 500 SSR (LocalStorage chỉ chạy ở Client)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Khởi tạo dữ liệu từ LocalStorage và API
  useEffect(() => {
    if (!isMounted) return;

    const initializeForm = async () => {
      // 1. Đọc info từ LocalStorage (nếu có)
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCustomerInfo((prev) => ({ ...prev, ...parsed }));
        } catch (e) {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      // 2. Lấy User để gọi API lấy ID
      const userJson = localStorage.getItem("user");
      if (!userJson) return;

      try {
        const user = JSON.parse(userJson);
        if (!user.username) return;

        // Gọi API song song
        const [customerData, infoData] = await Promise.all([
          customerService.getCustomer(user.username).catch(() => null),
          customerService.getCustomerInfo(user.username).catch(() => null),
        ]);

        if (customerData?.customerId) {
          setCustomerId(customerData.customerId);
        }

        if (infoData) {
          setCustomerInfo({
            fullName: infoData.fullName || "",
            email: infoData.email || "",
            phoneNumber: infoData.phoneNumber || "",
            address: infoData.address || "",
            ward: infoData.ward || "",
            district: infoData.district || "",
            city: infoData.city || "",
          });
        }
      } catch (error) {
        console.error("Lỗi khởi tạo dữ liệu checkout:", error);
      }
    };

    initializeForm();
  }, [isMounted, getCustomer, getCustomerInfo]);

  // Tính toán phí dựa trên cart
  const { shippingFee, tax, total } = useMemo(() => {
    const subtotal = cart?.totalPrice || 0;
    const fee =
      (cart?.items?.length || 0) > 0
        ? shippingMethod === "EXPRESS"
          ? 25
          : 10
        : 0;
    const t = subtotal * 0.1;
    return { shippingFee: fee, tax: t, total: subtotal + fee + t };
  }, [cart, shippingMethod]);

  const handleSubmit = async () => {
    // 1. Kiểm tra giỏ hàng
    if (!cart?.items?.length) {
      setCheckoutError("Giỏ hàng của bạn đang trống.");
      return;
    }

    // 2. Kiểm tra thông tin bắt buộc
    if (
      !customerInfo.fullName ||
      !customerInfo.email ||
      !customerInfo.phoneNumber
    ) {
      setCheckoutError("Vui lòng điền đầy đủ Họ tên, Email và Số điện thoại.");
      return;
    }

    // 3. Kiểm tra định danh khách hàng
    if (!customerId) {
      setCheckoutError(
        "Lỗi hệ thống: Không tìm thấy mã khách hàng. Vui lòng đăng nhập lại.",
      );
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      // 4. Xử lý địa chỉ hoàn chỉnh
      const fullAddress = [
        customerInfo.address,
        customerInfo.ward,
        customerInfo.district,
        customerInfo.city,
      ]
        .filter(Boolean)
        .join(", ");

      // 5. Chuyển đổi Enum Frontend sang Enum Backend (QUAN TRỌNG)
      // Dựa trên Enum bạn đã cung cấp: COD, CARD, EWALLET
      let backendPaymentMethod: "COD" | "CARD" | "EWALLET" = "COD";
      if (paymentMethod === PaymentMethod.CREDIT_CARD) {
        backendPaymentMethod = "CARD";
      } else if (
        paymentMethod === PaymentMethod.PAYPAL ||
        paymentMethod === PaymentMethod.BANK_TRANSFER
      ) {
        backendPaymentMethod = "EWALLET";
      } else {
        backendPaymentMethod = "COD"; // Mặc định cho CASH
      }

      // 6. Đóng gói OrderRequest đúng cấu trúc Backend yêu cầu
      const orderRequest = {
        userInfo: {
          fullName: customerInfo.fullName,
          email: customerInfo.email,
          phoneNumber: customerInfo.phoneNumber,
          address: fullAddress,
          paymentMethod: backendPaymentMethod, // "COD" | "CARD" | "EWALLET"
        },
        cart: convertToBackendCart(), // Chuyển đổi giỏ hàng sang cấu trúc Backend yêu cầu
        totalAmount: total, // Tổng tiền sau thuế và phí[cite: 3]
      };

      console.log("Dữ liệu gửi tới Backend:", orderRequest);

      // 7. Gọi API Checkout[cite: 3]
      const result = await orderService.checkout(orderRequest);

      if (result) {
        setSuccessMessage(
          `Đặt hàng thành công! Mã đơn hàng: ${result.orderId || ""}`,
        );

        // Lưu thông tin nếu người dùng yêu cầu
        if (saveInfo) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(customerInfo));
        }

        // Xóa giỏ hàng và chuyển hướng
        clearCart();
        setTimeout(() => {
          router.push("/orders");
        }, 1600);
      }
    } catch (error: any) {
      console.error("Lỗi Checkout:", error);
      const serverMessage = error?.response?.data?.message;
      setCheckoutError(
        serverMessage || "Thanh toán thất bại. Vui lòng kiểm tra lại kết nối.",
      );
    } finally {
      setCheckoutLoading(false);
    }
  };
  const canCheckout = useMemo(() => {
    return (
      (cart?.items?.length || 0) > 0 &&
      !!customerInfo.fullName &&
      !!customerInfo.email &&
      !!customerInfo.phoneNumber
    );
  }, [cart, customerInfo]);

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="mb-6">
          <Link href="/cart">
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Quay lại giỏ hàng
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Thanh toán</h1>
        </div>

        {cart.items.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg">Giỏ hàng của bạn đang trống.</p>
            <Link href="/products" className="mt-4 inline-block">
              <Button>Tiếp tục mua sắm</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CheckoutForm
                customerInfo={customerInfo}
                onCustomerInfoChange={setCustomerInfo}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                shippingMethod={shippingMethod}
                onShippingMethodChange={setShippingMethod}
                note={note}
                onNoteChange={setNote}
                saveInfo={saveInfo}
                onSaveInfoChange={setSaveInfo}
              />
            </div>
            <div className="lg:col-span-1">
              <CheckoutSummary
                cart={cart}
                shippingFee={shippingFee}
                tax={tax}
                total={total}
                onSubmit={handleSubmit}
                disabled={!canCheckout}
                loading={checkoutLoading}
                error={checkoutError || customerError}
              />
              {successMessage && (
                <div className="mt-4 rounded-3xl bg-emerald-50 p-4 text-emerald-900 text-center font-medium border border-emerald-200">
                  {successMessage}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
