"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Cart } from "@/types/cart";
import { Product } from "@/types/product";
import { CartItemDTO, Cart as BackendCart, OrderRequest, PaymentMethod } from "@/types/order";
import { useOrder } from "@/hooks/useOrder";

interface CartContextType {
  cart: Cart;
  addToCart: (
    product: Product,
    quantity: number,
    size: number,
    color: string,
  ) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  convertToBackendCart: () => BackendCart;
  checkout: (customerId: string, paymentMethod: PaymentMethod) => Promise<any>;
  checkoutLoading: boolean;
  checkoutError: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });
  const { checkout: orderCheckout, loading: checkoutLoading, error: checkoutError, clearError } = useOrder();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return { totalItems, totalPrice };
  };

  const addToCart = (
    product: Product,
    quantity: number,
    size: number,
    color: string,
  ) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find(
        (item) =>
          (item.product.id || item.product.productId) ===
            (product.id || product.productId) &&
          item.size === size &&
          item.color === color,
      );

      let newItems: CartItem[];
      if (existingItem) {
        newItems = prevCart.items.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        const newItem: CartItem = {
          id: `${product.id || product.productId}-${size}-${color}-${Date.now()}`,
          product,
          quantity,
          size,
          color,
          price: product.price,
        };
        newItems = [...prevCart.items, newItem];
      }

      const { totalItems, totalPrice } = calculateTotals(newItems);
      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.id !== id);
      const { totalItems, totalPrice } = calculateTotals(newItems);
      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) => {
      const newItems =
        quantity <= 0
          ? prevCart.items.filter((item) => item.id !== id)
          : prevCart.items.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            );

      const { totalItems, totalPrice } = calculateTotals(newItems);
      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });
  };

  const convertToBackendCart = (): BackendCart => {
    const backendItems: CartItemDTO[] = cart.items.map((item) => ({
      productDetailId: `${item.product.id || item.product.productId}-${item.size}-${item.color}`,
      quantity: item.quantity,
      productName: item.product.name || item.product.productName || "Unknown Product",
      price: item.price,
      size: item.size,
      color: item.color,
      stockQuantity: item.product.stock || 0,
      image: item.product.image,
    }));

    return {
      items: backendItems,
      promotionId: undefined, // Có thể thêm logic promotion sau
      usedPoints: 0, // Có thể thêm logic points sau
    };
  };

  const checkout = async (customerId: string, paymentMethod: PaymentMethod) => {
    clearError();
    const backendCart = convertToBackendCart();

    const orderRequest: OrderRequest = {
      customerId,
      cart: backendCart,
      paymentMethod,
    };

    const result = await orderCheckout(orderRequest);
    if (result) {
      // Clear cart after successful checkout
      clearCart();
    }
    return result;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        convertToBackendCart,
        checkout,
        checkoutLoading,
        checkoutError
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
