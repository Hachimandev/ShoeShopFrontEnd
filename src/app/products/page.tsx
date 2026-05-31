"use client";

import Link from "next/link";
import { ShoppingBag, Filter, ChevronDown, Star, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { productService } from "@/services/product.service";
import { categoryService, Category } from "@/services/category.service";
import { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Abort controllers and debounce timeouts
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProducts = async (
    params?: {
      searchTerm?: string;
      category?: string;
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
      sort?: string;
    },
    signal?: AbortSignal
  ) => {
    // Abort the previous fetch if it's still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new controller for the current request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Use the passed signal if available (e.g. from mount useEffect)
    const activeSignal = signal || controller.signal;

    setLoading(true);
    try {
      const data = await productService.getAllProducts(params, activeSignal);
      setProducts(data);
    } catch (error) {
      if (axios.isCancel(error) || activeSignal.aborted) {
        // Request was canceled, ignore
        return;
      }
      console.error("Failed to fetch products:", error);
    } finally {
      if (!activeSignal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts(undefined, controller.signal);

    categoryService.getAllCategories(controller.signal)
      .then(data => {
        if (!controller.signal.aborted) {
          setCategories(data);
        }
      })
      .catch(error => {
        if (!axios.isCancel(error) && !controller.signal.aborted) {
          console.error("Failed to fetch categories:", error);
        }
      });

    return () => {
      controller.abort();
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleCategoryChange = (name: string) => {
    setSelectedCategory(prev => prev === name ? "" : name);
  };

  const handleBrandChange = (name: string) => {
    setSelectedBrand(prev => prev === name ? "" : name);
  };

  const handleApplyFilters = () => {
    let minPrice: number | undefined = undefined;
    let maxPrice: number | undefined = undefined;

    if (minPriceInput || maxPriceInput) {
      if (minPriceInput) minPrice = parseFloat(minPriceInput);
      if (maxPriceInput) maxPrice = parseFloat(maxPriceInput);
    } else if (priceRange) {
      if (priceRange === "under_50") {
        minPrice = 0;
        maxPrice = 50;
      } else if (priceRange === "50_100") {
        minPrice = 50;
        maxPrice = 100;
      } else if (priceRange === "100_150") {
        minPrice = 100;
        maxPrice = 150;
      } else if (priceRange === "150_200") {
        minPrice = 150;
        maxPrice = 200;
      } else if (priceRange === "over_200") {
        minPrice = 200;
        maxPrice = 999999;
      }
    }

    fetchProducts({
      searchTerm: searchTerm || undefined,
      category: selectedCategory || undefined,
      brand: selectedBrand || undefined,
      minPrice,
      maxPrice,
      sort: sortBy || undefined
    });
    setShowMobileFilters(false);
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setSortBy("");
    setSearchTerm("");

    fetchProducts();
    setShowMobileFilters(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      let minPrice: number | undefined = undefined;
      let maxPrice: number | undefined = undefined;

      if (minPriceInput || maxPriceInput) {
        if (minPriceInput) minPrice = parseFloat(minPriceInput);
        if (maxPriceInput) maxPrice = parseFloat(maxPriceInput);
      } else if (priceRange) {
        if (priceRange === "under_50") {
          minPrice = 0;
          maxPrice = 50;
        } else if (priceRange === "50_100") {
          minPrice = 50;
          maxPrice = 100;
        } else if (priceRange === "100_150") {
          minPrice = 100;
          maxPrice = 150;
        } else if (priceRange === "150_200") {
          minPrice = 150;
          maxPrice = 200;
        } else if (priceRange === "over_200") {
          minPrice = 200;
          maxPrice = 999999;
        }
      }

      fetchProducts({
        searchTerm: value || undefined,
        category: selectedCategory || undefined,
        brand: selectedBrand || undefined,
        minPrice,
        maxPrice,
        sort: sortBy || undefined
      });
    }, 500);
  };

  const FilterSidebarContent = () => (
    <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      {/* Title */}
      <div className="pb-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">BỘ LỌC SẢN PHẨM</h2>
      </div>

      {/* Sắp xếp */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Sắp xếp</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer text-slate-700 font-medium"
        >
          <option value="">Mặc định</option>
          <option value="newest">Mới nhất</option>
          <option value="price_low">Giá tăng dần</option>
          <option value="price_high">Giá giảm dần</option>
        </select>
      </div>

      {/* Danh mục */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Danh mục</h3>
        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2">
          {categories.map((cat) => (
            <label key={cat.categoryId} className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-slate-900 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={selectedCategory === cat.categoryName}
                onChange={() => handleCategoryChange(cat.categoryName)}
                className="rounded-md border-slate-300 text-primary focus:ring-primary h-4.5 w-4.5"
              />
              <span>{cat.categoryName}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Thương hiệu */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Thương hiệu</h3>
        <div className="space-y-2.5">
          {["Nike", "Adidas", "Puma"].map((b) => (
            <label key={b} className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-slate-900 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={selectedBrand === b}
                onChange={() => handleBrandChange(b)}
                className="rounded-md border-slate-300 text-primary focus:ring-primary h-4.5 w-4.5"
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Khoảng giá */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Khoảng giá</h3>

        {/* Preset ranges */}
        <div className="space-y-2.5">
          {[
            { label: "Dưới $50", value: "under_50" },
            { label: "$50 - $100", value: "50_100" },
            { label: "$100 - $150", value: "100_150" },
            { label: "$150 - $200", value: "150_200" },
            { label: "Trên $200", value: "over_200" },
          ].map((range) => (
            <label key={range.value} className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-slate-900 cursor-pointer font-medium">
              <input
                type="radio"
                name="price_range"
                checked={priceRange === range.value}
                onChange={() => {
                  setPriceRange(range.value);
                  setMinPriceInput("");
                  setMaxPriceInput("");
                }}
                className="text-primary focus:ring-primary h-4.5 w-4.5"
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>

        {/* Custom range inputs */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Hoặc nhập khoảng giá ($)</p>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Từ ($)"
              type="number"
              className="h-9 text-xs px-2.5 rounded-lg"
              value={minPriceInput}
              onChange={(e) => {
                setMinPriceInput(e.target.value);
                setPriceRange("");
              }}
            />
            <span className="text-slate-400 text-xs font-bold">-</span>
            <Input
              placeholder="Đến ($)"
              type="number"
              className="h-9 text-xs px-2.5 rounded-lg"
              value={maxPriceInput}
              onChange={(e) => {
                setMaxPriceInput(e.target.value);
                setPriceRange("");
              }}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-4 flex flex-col gap-2 border-t border-slate-100">
        <Button className="w-full h-10 font-bold" onClick={handleApplyFilters}>
          Áp dụng
        </Button>
        <Button variant="outline" className="w-full h-10 font-bold" onClick={handleResetFilters}>
          Đặt lại
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-1 container px-4 py-8 mx-auto">

        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Our Collection</h1>
            <p className="text-muted-foreground">
              {loading ? "Loading..." : `Showing ${products.length} distinctive styles`}
            </p>
          </div>

          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Search shoes..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            {/* Mobile Filter Trigger */}
            <Button variant="outline" className="lg:hidden gap-2" onClick={() => setShowMobileFilters(true)}>
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Main layout container (Sidebar + Grid) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
            <FilterSidebarContent />
          </aside>

          {/* Product Grid container */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                // Skeleton Loading
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-3 h-[400px] animate-pulse shadow-sm border border-slate-100">
                    <div className="aspect-square rounded-2xl bg-slate-100 mb-4" />
                    <div className="h-4 bg-slate-100 rounded w-1/4 mb-2" />
                    <div className="h-6 bg-slate-100 rounded w-3/4 mb-4" />
                    <div className="flex justify-between">
                      <div className="h-6 bg-slate-100 rounded w-1/4" />
                      <div className="h-6 bg-slate-100 rounded w-1/4" />
                    </div>
                  </div>
                ))
              ) : products.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-700 mb-1">Không tìm thấy sản phẩm</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto mb-4">
                    Thử thay đổi điều kiện lọc hoặc nhập từ khóa tìm kiếm khác.
                  </p>
                  <Button onClick={handleResetFilters}>Đặt lại bộ lọc</Button>
                </div>
              ) : (
                products.map((product) => (
                  <Link
                    key={product.productId || product.id}
                    href={`/products/${product.productId || product.id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-3xl p-3 transition-all hover:shadow-xl border border-slate-100 hover:border-slate-200/50 shadow-sm">
                      <div className="aspect-square overflow-hidden rounded-2xl bg-slate-50 relative mb-4">
                        <Image
                          alt={product.productName || "Product"}
                          className="object-cover transition-transform group-hover:scale-110 duration-500"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          src={product.image || "/login_picture.jpg"}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/login_picture.jpg";
                          }}
                        />
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/95 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors">
                            <ShoppingBag className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 px-1">
                        <p className="text-xs font-bold text-primary uppercase tracking-wider">
                          {typeof product.category === 'object' ? product.category?.categoryName : product.category}
                        </p>
                        <h3 className="font-bold text-[15px] leading-snug group-hover:text-primary transition-colors line-clamp-1">
                          {product.productName || product.name}
                        </h3>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-50">
                          <span className="font-black text-[16px] text-slate-900">
                            ${product.price ? product.price.toLocaleString() : "0"}.00
                          </span>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span className="text-xs font-bold text-slate-500">
                              {product.rating || "4.5"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Mobile Filter Slide-out Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />

            {/* Drawer */}
            <div className="relative w-80 max-w-full bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="font-black text-slate-800">Bộ lọc</span>
                <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <FilterSidebarContent />
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
