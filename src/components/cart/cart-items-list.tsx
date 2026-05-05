"use client";

import { useCart } from "@/context/cart.context";
import { CartItem } from "./cart-item";
import { Card, CardContent } from "@/components/ui/card";

export function CartItemsList() {
  const { cart } = useCart();

  return (
    <Card>
      <CardContent className="p-0">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Shopping Cart ({cart.totalItems} items)
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
