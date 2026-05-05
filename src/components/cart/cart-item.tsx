"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus } from "lucide-react";
import { CartItem as CartItemType } from "@/types/cart";
import { useCart } from "@/context/cart.context";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const productName =
    item.product.name || item.product.productName || "Unknown Product";
  const productImage = item.product.image;

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200">
      <div className="relative h-24 w-24 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
        <Image
          src={
            item.product.image
              ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/images/${item.product.image}`
              : "/login_picture.jpg"
          }
          //   src={productImage}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 96px) 100vw, 96px"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-900">{productName}</h3>
        <p className="text-sm text-gray-600 mt-1">
          Size: {item.size} | Color: {item.color}
        </p>
        <p className="text-lg font-bold text-gray-900 mt-2">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Unit: ${item.price.toFixed(2)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-gray-200"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">
            {item.quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-gray-200"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => removeFromCart(item.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  );
}
