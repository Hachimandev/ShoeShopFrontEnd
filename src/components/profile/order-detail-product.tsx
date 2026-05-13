"use client";

import Image from "next/image";
import { ShoppingBag, Palette, Ruler } from "lucide-react";

interface OrderDetailProductProps {
  orderDetail: {
    productDetailId?: string;
    product?: {
      productId?: string;
      productName?: string;
      image?: string;
      price?: number;
    };
    quantity?: number;
    size?: number;
    color?: string;
    price?: number;
  };
  index: number;
}

export function OrderDetailProduct({
  orderDetail,
  index,
}: OrderDetailProductProps) {
  const productName =
    orderDetail.product?.productName || "Sản phẩm không xác định";
  const productImage = orderDetail.product?.image || "/login_picture.jpg";
  const quantity = orderDetail.quantity || 0;
  const size = orderDetail.size ?? "—";
  const color = orderDetail.color || "—";
  const price = orderDetail.price || orderDetail.product?.price || 0;

  // Tạo color code từ tên màu (để hiển thị hình ảnh màu)
  const getColorCode = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      Đen: "#000000",
      "Đen (Black)": "#000000",
      Trắng: "#FFFFFF",
      "Trắng (White)": "#FFFFFF",
      Đỏ: "#EF4444",
      "Đỏ (Red)": "#EF4444",
      Xanh: "#3B82F6",
      "Xanh (Blue)": "#3B82F6",
      "Xanh lá": "#10B981",
      "Xanh lá (Green)": "#10B981",
      Vàng: "#FBBF24",
      "Vàng (Yellow)": "#FBBF24",
      Cam: "#F97316",
      "Cam (Orange)": "#F97316",
      Tím: "#A855F7",
      "Tím (Purple)": "#A855F7",
      Hồng: "#EC4899",
      "Hồng (Pink)": "#EC4899",
      Xám: "#6B7280",
      "Xám (Gray)": "#6B7280",
      Nâu: "#92400E",
      "Nâu (Brown)": "#92400E",
    };

    return colorMap[colorName] || "#E5E7EB";
  };

  const colorCode = getColorCode(color);

  return (
    <div className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {/* Image */}
        <div className="md:col-span-3">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-50 shadow-sm">
            <Image
              alt={productName}
              fill
              className="object-cover"
              src={productImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/login_picture.jpg";
              }}
            />
            <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold">
              #{index + 1}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <ShoppingBag className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-lg truncate">
                  {productName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Mã chi tiết: {orderDetail.productDetailId?.slice(0, 8)}…
                </p>
              </div>
            </div>

            {/* Size and Color Info */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                <Ruler className="h-3.5 w-3.5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">
                  Size: <span className="font-bold text-slate-900">{size}</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                <Palette className="h-3.5 w-3.5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Màu:</span>
                <div className="flex items-center gap-1.5">
                  <div
                    className="h-4 w-4 rounded-full border border-slate-300 shadow-sm"
                    style={{ backgroundColor: colorCode }}
                    title={color}
                  />
                  <span className="font-bold text-slate-900">{color}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm text-slate-600">Số lượng:</span>
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 font-bold text-primary text-sm">
              {quantity}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="md:col-span-4 flex flex-col justify-between items-end">
          <div className="text-right">
            <p className="text-xs text-slate-600 mb-1">Giá / cái</p>
            <p className="text-2xl font-bold text-slate-900">
              {price.toLocaleString("vi-VN")}₫
            </p>
          </div>

          <div className="border-t-2 border-slate-200 pt-3 text-right w-full">
            <p className="text-xs text-slate-600 mb-1">Tổng cộng</p>
            <p className="text-3xl font-black text-primary">
              {(price * quantity).toLocaleString("vi-VN")}₫
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
