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
          // if (data.productDetails && data.productDetails.length > 0) {
          //   setSelectedSize(data.productDetails[0].size);
          //   setSelectedColor(data.productDetails[0].color);
          // }
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

  const isReadyToBuy = selectedSize && selectedColor;

  const totalStock = product.productDetails?.reduce((sum, detail) => sum + (detail.stockQuantity || 0), 0) || product.stock || 0;
  const selectedProductDetail = product.productDetails?.find(
    (detail) => detail.size === selectedSize && detail.color === selectedColor
  );
  const currentStock = selectedProductDetail ? selectedProductDetail.stockQuantity : totalStock;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 container px-4 py-8 mx-auto max-w-[1000px]">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-slate-500">
            <Link href="/products" className="hover:text-primary transition-colors">
              Products
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900">Details</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/5] relative overflow-hidden bg-slate-50 rounded-2xl group shadow-2xl shadow-slate-200/60 hover:shadow-slate-300/80 transition-shadow duration-500">
              <Image
                alt={product.productName || product.name || ""}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src={product.image || "/login_picture.jpg"}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/login_picture.jpg";
                }}
                priority
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            {/* Category */}
            <div className="mb-3">
              <span className="text-xs font-medium px-3 py-1 border border-slate-200 rounded-full text-slate-700">
                {typeof product.category === "object"
                  ? product.category?.categoryName
                  : product.category || "T-Shirt"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              {product.productName || product.name}
            </h1>

            {/* Price */}
            <div className="text-2xl font-bold text-slate-900 mb-8">
              {product.price?.toLocaleString("vi-VN")} ₫
            </div>

            <hr className="border-slate-100 mb-6" />

            {/* Brand */}
            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-1">Brand</p>
              <p className="text-sm font-semibold text-slate-900">{product.brand || "Local Brand"}</p>
            </div>

            {/* Color Selector */}
            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-3">Color</p>
              <div className="flex gap-3">
                {uniqueColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-5 py-2 border rounded-md text-sm transition-all ${
                      selectedColor === color
                        ? "border-slate-900 text-slate-900 font-medium"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-3">Size</p>
              <div className="flex gap-3">
                {uniqueSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] h-10 px-3 border rounded-md flex items-center justify-center text-sm transition-all ${
                      selectedSize === size
                        ? "border-slate-900 text-slate-900 font-medium"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Stock */}
            <div className="mb-4 text-sm text-slate-500">
              {isReadyToBuy ? "Available stock:" : "Total stock:"} {currentStock} items
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-sm text-slate-500 mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 rounded-md">
                  <button
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-medium text-slate-900 border-x border-slate-200 h-10 flex items-center justify-center">
                    {quantity}
                  </span>
                  <button
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    disabled={quantity >= currentStock}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-slate-500">Max {currentStock}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-3">
              <Button
                className={`flex-1 rounded-md h-12 font-medium transition-colors ${
                  isReadyToBuy
                    ? "bg-slate-900 hover:bg-slate-800 text-white"
                    : "bg-[#8c8c8c] hover:bg-[#8c8c8c] text-white cursor-not-allowed"
                }`}
                onClick={handleAddToCart}
                disabled={!isReadyToBuy || addToCartLoading}
              >
                {addToCartLoading
                  ? "Processing..."
                  : isReadyToBuy
                  ? "Add to Cart"
                  : "Select Color & Size"}
              </Button>
              <Button
                variant="outline"
                className="px-6 border-slate-200 rounded-md h-12 font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  if (isReadyToBuy) handleAddToCart();
                  else alert("Please select color and size.");
                }}
              >
                Buy Now
              </Button>
            </div>

            {/* Warning Message */}
            {!isReadyToBuy && (
              <p className="text-[13px] text-red-500 mb-6">
                Please select Color and Size to proceed with purchase.
              </p>
            )}

            {/* Description */}
            <div className="pt-8 mt-4 border-t border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 mb-4">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description || "Comfortable cotton t-shirt."}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
