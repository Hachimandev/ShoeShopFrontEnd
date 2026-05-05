"use client";

import Link from "next/link";
import { ShoppingBag, Filter, ChevronDown, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-1 container px-4 py-8 mx-auto">
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
              <Input className="pl-8" placeholder="Search shoes..." />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              Sort
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Skeleton Loading
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-3 h-[400px] animate-pulse">
                <div className="aspect-square rounded-2xl bg-slate-200 mb-4" />
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-2" />
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
                <div className="flex justify-between">
                  <div className="h-6 bg-slate-200 rounded w-1/4" />
                  <div className="h-6 bg-slate-200 rounded w-1/4" />
                </div>
              </div>
            ))
          ) : (
            products.map((product) => (
              <Link
                key={product.productId || product.id}
                href={`/products/${product.productId || product.id}`}
                className="group"
              >
                <div className="bg-white rounded-3xl p-3 transition-all hover:shadow-xl border border-transparent hover:border-slate-100">
                  <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100 relative mb-4">
                            <Image
                        alt={product.productName}
                      className="object-cover transition-transform group-hover:scale-110 duration-500"
                      fill
                      src={product.image || "/login_picture.jpg"}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/login_picture.jpg";
                      }}
                    />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 px-1">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">
                      {product.category?.categoryName || product.category}
                    </p>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                      {product.productName || product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-black text-xl">
                        ${product.price ? product.price.toLocaleString() : "0"}.00
                      </span>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="text-xs font-bold text-slate-600">
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
      </main>
    </div>
  );
}

  
