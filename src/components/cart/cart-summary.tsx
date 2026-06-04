"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/cart.context";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

const SHIPPING_COST = 1000;
const TAX_RATE = 0.1;

export function CartSummary() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const subtotal = cart.totalPrice;
  const tax = subtotal * TAX_RATE;
  const shipping = cart.items.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + tax + shipping;

  return (
    <Card className="h-fit sticky top-4">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        <div className="space-y-3 mb-6 pb-6 border-b">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{subtotal.toLocaleString("vi-VN")} ₫</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (10%)</span>
            <span className="font-medium">{tax.toLocaleString("vi-VN")} ₫</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">{shipping.toLocaleString("vi-VN")} ₫</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-bold text-blue-600">
            {total.toLocaleString("vi-VN")} ₫
          </span>
        </div>

        <Button
          className="w-full h-12 text-base font-semibold mb-3"
          onClick={() => router.push("/checkout")}
          disabled={cart.items.length === 0}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Checkout
        </Button>

        <Button variant="outline" className="w-full h-10" onClick={clearCart}>
          Clear Cart
        </Button>

        <Link href="/products">
          <Button variant="ghost" className="w-full h-10 mt-2">
            Continue Shopping
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
