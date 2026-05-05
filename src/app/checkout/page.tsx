"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart.context";
import { useCustomer } from "@/hooks/useCustomer";
import { authService } from "@/services/auth.service";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { CustomerDTO } from "@/types/customer";
import { PaymentMethod } from "@/types/order";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

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
  const { cart, checkout, clearCart } = useCart();
  const {
    getCustomer,
    getCustomerInfo,
    updateCustomerInfo,
    loading: customerLoading,
    error: customerError,
    clearError: clearCustomerError,
  } = useCustomer();

  const [customerInfo, setCustomerInfo] =
    useState<CustomerDTO>(emptyCustomerInfo);
  const [saveInfo, setSaveInfo] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH,
  );
  const [shippingMethod, setShippingMethod] = useState<"STANDARD" | "EXPRESS">(
    "STANDARD",
  );
  const [note, setNote] = useState("");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const shippingFee =
    cart.items.length > 0 ? (shippingMethod === "EXPRESS" ? 25 : 10) : 0;
  const tax = cart.totalPrice * 0.1;
  const total = cart.totalPrice + shippingFee + tax;

  useEffect(() => {
    const initializeForm = async () => {
      const storedCheckout = localStorage.getItem(STORAGE_KEY);
      if (storedCheckout) {
        try {
          setCustomerInfo(JSON.parse(storedCheckout));
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      const userJson = localStorage.getItem("user");
      if (!userJson) {
        console.warn("No user found in localStorage");
        return;
      }

      try {
        const user = JSON.parse(userJson);
        if (!user.username) {
          console.warn("Username not found in user object");
          return;
        }

        console.log("Fetching customer data for:", user.username);

        let customerIdFromApi: string | null = null;

        try {
          const customer = await getCustomer(user.username);
          console.log("Customer fetched:", customer);
          if (customer && customer.customerId) {
            customerIdFromApi = customer.customerId;
            setCustomerId(customerIdFromApi);
            console.log(
              "Customer ID set from customer endpoint:",
              customerIdFromApi,
            );
          } else {
            console.warn(
              "Customer data incomplete from customer endpoint:",
              customer,
            );
          }
        } catch (error) {
          console.error("Failed to fetch customer:", error);
        }

        if (!customerIdFromApi) {
          try {
            const userInfo = await authService.getCurrentUser(user.username);
            console.log("Current user info fetched:", userInfo);
            if (userInfo?.customer?.customerId) {
              customerIdFromApi = userInfo.customer.customerId;
              setCustomerId(customerIdFromApi);
              console.log(
                "Customer ID set from account endpoint:",
                customerIdFromApi,
              );
            }
          } catch (error) {
            console.error("Failed to fetch current user account info:", error);
          }
        }

        try {
          const info = await getCustomerInfo(user.username);
          if (info) {
            setCustomerInfo(info);
          }
        } catch (error) {
          console.error("Failed to fetch customer info:", error);
        }
      } catch (error) {
        console.error("Failed to initialize checkout form:", error);
      }
    };

    initializeForm();
  }, [getCustomer, getCustomerInfo]);

  const saveLocalCustomerInfo = (info: CustomerDTO) => {
    if (saveInfo) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleSubmit = async () => {
    if (cart.items.length === 0) {
      setCheckoutError("Your cart is empty. Please add items before checkout.");
      return;
    }

    const usernameJson = localStorage.getItem("user");
    if (!usernameJson) {
      setCheckoutError("Please login before checkout.");
      router.push("/auth/login");
      return;
    }

    const user = JSON.parse(usernameJson);
    if (!user.username) {
      setCheckoutError("Please login before checkout.");
      router.push("/auth/login");
      return;
    }

    if (
      !customerInfo.fullName ||
      !customerInfo.email ||
      !customerInfo.phoneNumber
    ) {
      setCheckoutError(
        "Please fill in your contact details before placing the order.",
      );
      return;
    }

    if (!customerId) {
      setCheckoutError(
        "Customer information not found. Please try logging in again.",
      );
      console.error("customerId is null or undefined", {
        customerId,
        username: user.username,
      });
      router.push("/auth/login");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setCheckoutError("Authentication token not found. Please login again.");
      router.push("/auth/login");
      return;
    }

    setCheckoutError(null);
    setCheckoutLoading(true);
    clearCustomerError();

    const fullAddress = [
      customerInfo.address,
      customerInfo.ward,
      customerInfo.district,
      customerInfo.city,
    ]
      .filter(Boolean)
      .join(", ");

    if (customerId) {
      try {
        await updateCustomerInfo(user.username, {
          fullName: customerInfo.fullName,
          email: customerInfo.email,
          phoneNumber: customerInfo.phoneNumber,
          address: fullAddress,
        });
      } catch (error) {
        console.warn("Unable to update customer info before checkout:", error);
      }
    }

    saveLocalCustomerInfo(customerInfo);

    try {
      console.log("Starting checkout with:", {
        customerId,
        paymentMethod,
        cartItemsCount: cart.items.length,
      });
      const result = await checkout(customerId, paymentMethod);
      if (result) {
        setSuccessMessage(
          `Order created successfully! Order ID: ${result.orderId}`,
        );
        clearCart();
        setTimeout(() => {
          router.push("/orders");
        }, 1600);
      }
    } catch (error: any) {
      console.error("Checkout failed:", error);
      setCheckoutError(
        error?.response?.data?.message ||
          error?.message ||
          "Checkout failed. Please try again.",
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  const canCheckout =
    cart.items.length > 0 &&
    !!customerInfo.fullName &&
    !!customerInfo.email &&
    !!customerInfo.phoneNumber;

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="mb-6">
          <Link href="/cart">
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Cart
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Thanh toán</h1>
          <p className="text-slate-600 mt-2">
            Kiểm tra lại thông tin giao hàng, phương thức thanh toán và đơn hàng
            trước khi xác nhận.
          </p>
        </div>

        {/* Debug info */}
        <div className="mb-4 rounded-lg bg-slate-200 p-3 text-xs">
          <p>Debug: customerId = {customerId || "null"}</p>
          <p>
            Debug: token ={" "}
            {localStorage.getItem("token") ? "exists" : "missing"}
          </p>
          <p>
            Debug: username ={" "}
            {JSON.parse(localStorage.getItem("user") || "{}").username ||
              "none"}
          </p>
        </div>

        {cart.items.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">
              Giỏ hàng của bạn đang trống.
            </p>
            <p className="text-slate-600 mt-2">
              Vui lòng thêm sản phẩm trước khi thanh toán.
            </p>
            <div className="mt-6 inline-flex">
              <Link href="/products">
                <Button>Tiếp tục mua sắm</Button>
              </Link>
            </div>
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
              {successMessage ? (
                <div className="mt-4 rounded-3xl bg-emerald-50 p-4 text-emerald-900">
                  {successMessage}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
