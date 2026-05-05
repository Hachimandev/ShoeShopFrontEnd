"use client";

import { useCart } from "@/context/cart.context";
import { CartItemsList } from "@/components/cart/cart-items-list";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function CartPage() {
  const { cart } = useCart();

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CartItemsList />
            </div>
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
