"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Box,
  Layers,
  AlertCircle,
  Loader2,
  Upload,
} from "lucide-react";

const PAGE_SIZE = 10;

const filterSelectClass =
  "h-11 min-w-[168px] shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20";

function formatVnd(n: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter((p) => (p.productId || String(p.id)) !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Lỗi khi xóa sản phẩm.");
    }
  };

  const stats = useMemo(() => {
    const total = products.length;
    const outOfStock = products.filter((p) => {
      const stock =
        p.productDetails?.reduce((sum, d) => sum + d.stockQuantity, 0) || 0;
      return stock === 0;
    }).length;
    const lowStock = products.filter((p) => {
      const stock =
        p.productDetails?.reduce((sum, d) => sum + d.stockQuantity, 0) || 0;
      return stock > 0 && stock < 10;
    }).length;
    return { total, outOfStock, lowStock };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        (p.productName || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.productId || "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Quản lý sản phẩm
            </h1>
            <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-0.5 text-sm font-medium text-sky-800">
              {stats.total} sản phẩm
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Xem, thêm, sửa hoặc xóa sản phẩm trong hệ thống.
          </p>
        </div>
        <Button
          asChild
          className="h-10 shrink-0 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-0 shadow-sm transition hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Box className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">
                Tổng sản phẩm
              </p>
              <p className="text-3xl font-bold tabular-nums text-slate-900">
                {stats.total}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm transition hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Sắp hết hàng</p>
              <p className="text-3xl font-bold tabular-nums text-slate-900">
                {stats.lowStock}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm transition hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Hết hàng</p>
              <p className="text-3xl font-bold tabular-nums text-slate-900">
                {stats.outOfStock}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-11 rounded-lg border-slate-200 bg-white pl-10 shadow-sm placeholder:text-slate-400 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-11 rounded-lg border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                onClick={() => {}}
                disabled={exporting}
              >
                <Upload className="mr-2 h-4 w-4" />
                Xuất Excel
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-medium">Sản phẩm</th>
                  <th className="px-6 py-4 font-medium">Thương hiệu</th>
                  <th className="px-6 py-4 font-medium">Giá niêm yết</th>
                  <th className="px-6 py-4 font-medium text-center">Tồn kho</th>
                  <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      Không tìm thấy sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product) => {
                    const totalStock =
                      product.productDetails?.reduce(
                        (sum, d) => sum + d.stockQuantity,
                        0,
                      ) || 0;
                    const id = product.productId || String(product.id);
                    return (
                      <tr
                        key={id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg border border-slate-200 bg-white flex-shrink-0 overflow-hidden">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.productName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-slate-100 flex items-center justify-center">
                                  <Box className="h-6 w-6 text-slate-300" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 truncate max-w-[200px]">
                                {product.productName}
                              </div>
                              <div className="text-xs text-slate-500 font-mono mt-0.5">
                                {id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {product.brand || "—"}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {formatVnd(product.price)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900">
                                {totalStock}
                              </span>
                              <span className="text-slate-400 text-xs">
                                tổng cộng
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className={`w-fit text-[10px] uppercase font-bold ${
                                totalStock === 0
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : totalStock < 10
                                    ? "border-amber-200 bg-amber-50 text-amber-700"
                                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {totalStock === 0
                                ? "Hết hàng"
                                : totalStock < 10
                                  ? "Sắp hết"
                                  : "Có sẵn"}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/products/${id}`}>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 md:p-6 flex items-center justify-between border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Hiển thị{" "}
              <span className="font-medium text-slate-900">
                {paginatedProducts.length}
              </span>{" "}
              trên{" "}
              <span className="font-medium text-slate-900">
                {filteredProducts.length}
              </span>{" "}
              sản phẩm
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg"
              >
                Trước
              </Button>
              <div className="flex items-center px-4 text-sm font-medium">
                Trang {page} / {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="rounded-lg"
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
