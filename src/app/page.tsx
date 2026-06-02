"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft, Star, ShoppingBag, ShieldCheck, Truck, Headphones, RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product";

const features = [
  {
    icon: Truck,
    title: "Free Express Delivery",
    description: "Enjoy free and fast shipping on all premium collections over $200."
  },
  {
    icon: ShieldCheck,
    title: "100% Authentic Quality",
    description: "Every product is verified and guaranteed to be 100% genuine."
  },
  {
    icon: RotateCcw,
    title: "30-Day Easy Returns",
    description: "Not satisfied? Return it within 30 days for a full refund, no questions asked."
  },
  {
    icon: Headphones,
    title: "24/7 Premium Support",
    description: "Our dedicated shoe experts are here to help you around the clock."
  }
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setFeaturedProducts(data.slice(0, 24)); // fetch more for filtering
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const displayedProducts = activeCategory === "All" 
    ? featuredProducts 
    : featuredProducts.filter(p => {
        const catName = typeof p.category === 'object' ? p.category?.categoryName : p.category;
        return catName === activeCategory;
      });

  // Limit to 8 products max per tab to keep the UI clean
  const tabProducts = displayedProducts.slice(0, 8);

  return (
    <main className="flex-1 flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full pt-16 pb-20 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-[100px] -z-10 translate-x-1/4" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10" />

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_500px] xl:grid-cols-[1.2fr_600px] items-center">
            <div className="flex flex-col justify-center space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border shadow-sm w-fit">
                <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold tracking-tight">New Summer Collection 2026</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tighter sm:text-6xl xl:text-[5.5rem] leading-[1.1]">
                  Step into <span className="text-primary">Style</span> <br />
                  Walk with <span className="text-primary relative inline-block">
                    Power
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-primary/30" />
                    </svg>
                  </span>
                </h1>
                <p className="max-w-[600px] text-slate-600 md:text-xl/relaxed font-medium">
                  Discover the perfect blend of comfort, durability, and world-class design. Your journey to excellence starts with the right pair of shoes.
                </p>
              </div>

              <div className="flex flex-col gap-4 min-[400px]:flex-row">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button size="lg" className="px-10 h-14 text-lg w-full sm:w-auto rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                    Shop Collection
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/products" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="px-10 h-14 text-lg w-full sm:w-auto rounded-full bg-white/50 backdrop-blur-md border-2 hover:bg-white">
                    Explore Brands
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative shadow-sm">
                      <Image src="/login_picture.jpg" alt={`Customer ${i}`} fill sizes="40px" className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-sm font-bold text-slate-600">Trusted by 10,000+ customers</p>
                </div>
              </div>
            </div>

            <div className="mx-auto flex w-full items-center justify-center lg:order-last relative">
              <div className="relative h-[400px] w-full sm:h-[500px] md:h-[600px] lg:h-[700px] z-10">
                <Image
                  alt="Premium Sneaker Collection"
                  className="object-cover rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 hover:scale-[1.02]"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src="/landing_picture.png"
                  priority
                  loading="eager"
                />

                {/* Floating Badges */}
                <div className="absolute top-10 -left-8 bg-white p-4 rounded-2xl shadow-xl border animate-bounce-slow hidden md:flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <ShieldCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Verified</p>
                    <p className="text-sm font-black text-slate-900">100% Authentic</p>
                  </div>
                </div>

                <div className="absolute bottom-20 -right-8 bg-white p-5 rounded-2xl shadow-xl border hidden md:block transition-transform hover:-translate-y-2">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">New Arrival</p>
                  <p className="text-xl font-black text-slate-900 mb-2">AIR MAX 2026</p>
                  <Link href="/products" className="text-sm font-bold text-slate-500 hover:text-primary flex items-center">
                    Discover now <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Decorative background blob for image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-400/20 rounded-[3rem] blur-2xl -z-10 transform scale-105 rotate-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm">The ShoeShop Difference</h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight">Why Sneakerheads Choose Us</h3>
            <p className="text-lg text-slate-600">We don&apos;t just sell shoes. We deliver an unparalleled shopping experience from checkout to unboxing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group flex flex-col items-center text-center p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white text-primary transition-all duration-300">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-24 bg-slate-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between mb-12 gap-8">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm">Shop by Need</h2>
              <h3 className="text-3xl md:text-5xl font-black tracking-tight">Find Your Perfect Fit</h3>
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 w-full xl:w-auto">
              {["All", "Lifestyle", "Running", "Basketball", "Training"].map(cat => (
                <Button 
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  className={`rounded-full px-6 h-11 font-bold whitespace-nowrap transition-all duration-300 ${activeCategory !== cat ? 'bg-white border-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50' : 'shadow-lg shadow-primary/30 scale-105'}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[2rem] p-4 h-[420px] animate-pulse shadow-sm border border-slate-100">
                  <div className="aspect-[4/5] rounded-3xl bg-slate-100 mb-6" />
                  <div className="h-6 bg-slate-100 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                </div>
              ))
            ) : tabProducts.length > 0 ? (
              tabProducts.map((product, i) => (
                <Link key={product.productId} href={`/products/${product.productId}`} className="group block">
                  <div className="bg-white rounded-[2rem] p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1.5 border border-slate-100/60 shadow-sm h-full flex flex-col">
                    <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100/50 relative mb-6">
                      <Image
                        alt={product.productName || "Product"}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        src={product.image || "/login_picture.jpg"}
                        priority={i === 0}
                      />
                      <div className="absolute top-4 left-4 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/40">
                        <span className="text-[10px] font-black tracking-wider uppercase text-slate-700">
                          {typeof product.category === 'object' ? product.category?.categoryName : product.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-primary text-white p-3.5 rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                      </div>
                    </div>

                    <div className="px-2 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{product.brand || "Premium Brand"}</p>
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-500 px-2 py-0.5 rounded-lg border border-amber-100/50">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="text-[11px] font-bold text-slate-600">{product.rating || "5.0"}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg leading-tight mb-4 group-hover:text-primary transition-colors text-slate-850 line-clamp-1">
                        {product.productName}
                      </h3>
                      <div className="mt-auto flex items-end justify-between pt-4 border-t border-slate-50">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Price</p>
                          <span className="font-black text-xl text-slate-950">{product.price?.toLocaleString("vi-VN")} ₫</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Fallback if no products
              <div className="col-span-full w-full text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm">
                <ShoppingBag className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">No Products Found</h3>
                <p className="text-slate-500">We couldn't find any products in this category.</p>
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/products">
              <Button size="lg" className="px-10 h-14 text-lg rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform font-bold group">
                View Entire Collection <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>


    </main>
  );
}
