"use client";

import Link from "next/link";
import { ShoppingBag, Filter, ChevronDown, Star, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
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
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

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
        maxPrice = 5000;
      } else if (priceRange === "50_100") {
        minPrice = 5000;
        maxPrice = 10000;
      } else if (priceRange === "100_150") {
        minPrice = 10000;
        maxPrice = 15000;
      } else if (priceRange === "150_200") {
        minPrice = 15000;
        maxPrice = 20000;
      } else if (priceRange === "over_200") {
        minPrice = 20000;
        maxPrice = 99999999;
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
    setCurrentPage(1);
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
    setCurrentPage(1);

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
          maxPrice = 5000;
        } else if (priceRange === "50_100") {
          minPrice = 5000;
          maxPrice = 10000;
        } else if (priceRange === "100_150") {
          minPrice = 10000;
          maxPrice = 15000;
        } else if (priceRange === "150_200") {
          minPrice = 15000;
          maxPrice = 20000;
        } else if (priceRange === "over_200") {
          minPrice = 20000;
          maxPrice = 99999999;
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
      setCurrentPage(1);
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
            { label: "Dưới 5,000 ₫", value: "under_50" },
            { label: "5,000 ₫ - 10,000 ₫", value: "50_100" },
            { label: "10,000 ₫ - 15,000 ₫", value: "100_150" },
            { label: "15,000 ₫ - 20,000 ₫", value: "150_200" },
            { label: "Trên 20,000 ₫", value: "over_200" },
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
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Hoặc nhập khoảng giá (₫)</p>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Từ (₫)"
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
              placeholder="Đến (₫)"
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

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-1 container px-4 py-8 mx-auto">

        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Our Collection</h1>
            <p className="text-muted-foreground">
              {loading ? "Loading..." : `Showing ${currentProducts.length} of ${products.length} distinctive styles`}
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
          <div className="flex-1 w-full flex flex-col">
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
                currentProducts.map((product) => (
                  <Link
                    key={product.productId || product.id}
                    href={`/products/${product.productId || product.id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-[2rem] p-3 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1.5 border border-slate-100/60 shadow-sm flex flex-col h-full">
                      <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 relative mb-4">
                        <Image
                          alt={product.productName || "Product"}
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          src={product.image || "/login_picture.jpg"}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/login_picture.jpg";
                          }}
                        />
                        {/* Glassmorphism Category Badge */}
                        <div className="absolute top-3 left-3 bg-white/70 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-white/40">
                          <span className="text-[10px] font-black tracking-wider uppercase text-slate-700">
                            {typeof product.category === 'object' ? product.category?.categoryName : product.category}
                          </span>
                        </div>
                        {/* Dynamic Floating Action Icon */}
                        <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="bg-primary text-white p-3 rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200">
                            <ShoppingBag className="h-4.5 w-4.5" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 px-1.5 flex-1 flex flex-col">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {product.brand || "Premium Brand"}
                        </p>
                        <h3 className="font-bold text-base leading-snug text-slate-800 group-hover:text-primary transition-colors line-clamp-1">
                          {product.productName || product.name}
                        </h3>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                          <span className="font-black text-[17px] text-slate-950">
                            {product.price ? product.price.toLocaleString("vi-VN") : "0"} ₫
                          </span>
                          <div className="flex items-center gap-1 bg-amber-50 text-amber-500 px-2 py-0.5 rounded-lg border border-amber-100/50">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span className="text-[11px] font-bold text-slate-600">
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

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="mt-12 mb-4 flex justify-center items-center gap-2">
                <Button 
                  variant="outline" 
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="h-10 w-10 p-0 rounded-xl"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`h-10 w-10 p-0 rounded-xl font-bold ${currentPage === i + 1 ? 'shadow-md shadow-primary/20' : ''}`}
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button 
                  variant="outline" 
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="h-10 w-10 p-0 rounded-xl"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
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
