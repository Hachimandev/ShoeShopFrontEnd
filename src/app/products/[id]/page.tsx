"use client";

import Link from "next/link";
import {
  ShoppingBag,
  ChevronLeft,
  Star,
  Truck,
  ShieldCheck,
  Heart,
  Share2,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState, use, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product";
import { useCart } from "@/context/cart.context";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        if (id) {
          const data = await productService.getProductById(id, controller.signal);
          setProduct(data);
          // Set mặc định size và màu đầu tiên nếu có
          if (data.productDetails && data.productDetails.length > 0) {
            setSelectedSize(data.productDetails[0].size);
            setSelectedColor(data.productDetails[0].color);
          }
        }
      } catch (error) {
        if (axios.isCancel(error) || controller.signal.aborted) {
          // Request was canceled, ignore
          return;
        }
        console.error("Failed to fetch product:", error);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      controller.abort();
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen animate-pulse container px-4 py-8 mx-auto max-w-7xl">
        <div className="h-4 w-32 bg-slate-200 rounded mb-8" />
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-[4/5] bg-slate-200 rounded-[2.5rem]" />
          <div className="space-y-6 text-slate-200">
            <div className="h-12 bg-slate-200 rounded w-3/4" />
            <div className="h-8 bg-slate-200 rounded w-1/4" />
            <div className="h-32 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Button asChild className="mt-4">
          <Link href="/products">Back to Collection</Link>
        </Button>
      </div>
    );
  }

  // Lấy danh sách size duy nhất
  const uniqueSizes = Array.from(
    new Set(product.productDetails?.map((d) => d.size)),
  ).sort();
  // Lấy danh sách màu sắc duy nhất
  const uniqueColors = Array.from(
    new Set(product.productDetails?.map((d) => d.color)),
  );

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }

    setAddToCartLoading(true);
    try {
      addToCart(product, quantity, selectedSize, selectedColor);
      // Show success message or toast
      setTimeout(() => {
        router.push("/cart");
      }, 500);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add item to cart");
    } finally {
      setAddToCartLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 container px-4 py-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            BACK TO COLLECTION
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-rose-500"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/5] relative overflow-hidden rounded-[2.5rem] bg-slate-50 shadow-inner group">
              <Image
                alt={product.productName || product.name || ""}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src={product.image || "/login_picture.jpg"}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/login_picture.jpg";
                }}
                priority
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-sm">
                <span className="text-xs font-black tracking-widest text-primary uppercase">
                  {typeof product.category === "object"
                    ? product.category?.categoryName
                    : product.category}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-current mr-1" />
                  <span className="text-sm font-black">
                    {product.rating || "4.5"}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-400 capitalize">
                  {product.reviews || 0} verified reviews
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter leading-[1.1]">
                {product.productName || product.name}
              </h1>
              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-black text-primary">
                  {product.price?.toLocaleString("vi-VN")} ₫
                </p>
                {product.originalPrice && (
                  <p className="text-xl text-slate-400 line-through font-bold">
                    {product.originalPrice?.toLocaleString("vi-VN")} ₫
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Size Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-sm uppercase tracking-widest">
                    Select Size (EU)
                  </h3>
                  <button className="text-xs font-bold underline underline-offset-4 hover:text-primary">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {uniqueSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-14 border-2 rounded-2xl flex items-center justify-center text-lg font-black transition-all active:scale-95 ${selectedSize === size
                          ? "border-primary text-primary ring-2 ring-primary"
                          : "border-slate-100 hover:border-slate-300"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="space-y-3">
                <h3 className="font-black text-sm uppercase tracking-widest">
                  Color:{" "}
                  <span className="text-slate-500 font-bold uppercase ml-1">
                    {selectedColor}
                  </span>
                </h3>
                <div className="flex gap-4">
                  {uniqueColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`h-10 px-4 rounded-full border-2 transition-all font-bold text-sm ${selectedColor === color
                          ? "border-primary bg-primary text-white"
                          : "border-slate-200 hover:border-slate-300 text-slate-600"
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="font-bold text-sm uppercase tracking-widest">
                  Quantity:
                </span>
                <div className="flex items-center gap-3 ml-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-bold text-lg">
                    {quantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-lg"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                size="lg"
                className="h-20 text-xl font-black rounded-3xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                onClick={handleAddToCart}
                disabled={addToCartLoading || !selectedSize || !selectedColor}
              >
                {addToCartLoading
                  ? "Adding..."
                  : `THÊM VÀO GIỎ — ${(product.price * quantity)?.toLocaleString("vi-VN")} ₫`}
              </Button>
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-green-600 py-2">
                <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                In Stock - Ships within 24 hours
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-6">
              <div className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight">
                    Express Delivery
                  </p>
                  <p className="text-xs font-bold text-muted-foreground">
                    Free shipping on all premium collections
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight">
                    Authenticity Guaranteed
                  </p>
                  <p className="text-xs font-bold text-muted-foreground">
                    All products are 100% genuine and verified
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t">
              <h3 className="font-black text-xl mb-4">Product Description</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
