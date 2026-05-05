import Link from "next/link"
import { ShoppingBag, ChevronLeft, Star, Truck, ShieldCheck, Heart, Share2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch data based on params.id
  const product = {
    id: params.id,
    name: "Air Jordan 1 Retro High OG",
    price: 189,
    originalPrice: 220,
    description: "The Air Jordan 1 Retro High OG is a reissue of the classic sneaker that started it all. Featuring premium leather, comfortable cushioning, and iconic branding, this shoe is a must-have for every sneakerhead. Designed for both performance on the court and style on the streets.",
    features: [
        "Premium leather construction for durability and style",
        "Encapsulated Air-Sole unit for lightweight cushioning",
        "Solid rubber outsole for exceptional traction on various surfaces",
        "Classic 'Wings' logo on the collar and iconic Swoosh"
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    colors: [
        { name: "Chicago Red", hex: "#BF1E2D" },
        { name: "Royal Blue", hex: "#005596" },
        { name: "Shadow Grey", hex: "#414042" }
    ],
    stockStatus: "In Stock",
    reviews: 128,
    rating: 4.9
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 container px-4 py-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
            <Link href="/products" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                <ChevronLeft className="mr-1 h-5 w-5" />
                BACK TO COLLECTION
            </Link>
            <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-rose-500">
                    <Heart className="h-5 w-5" />
                </Button>
            </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
            {/* Left: Image Gallery */}
            <div className="space-y-6">
                <div className="aspect-[4/5] relative overflow-hidden rounded-[2.5rem] bg-slate-50 shadow-inner group">
                    <Image
                        alt={product.name}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        fill
                        src="/login_picture.jpg"
                        priority
                    />
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-sm">
                        <span className="text-xs font-black tracking-widest text-primary">NEW ARRIVAL</span>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square relative rounded-[1.5rem] overflow-hidden bg-slate-50 cursor-pointer ring-offset-2 hover:ring-2 ring-primary transition-all">
                            <Image alt="gallery" fill src="/login_picture.jpg" className="object-cover opacity-80 hover:opacity-100" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col space-y-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full">
                            <Star className="h-4 w-4 fill-current mr-1" />
                            <span className="text-sm font-black">{product.rating}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-400 capitalize">{product.reviews} verified reviews</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter leading-[1.1]">{product.name}</h1>
                    <div className="flex items-baseline gap-4">
                        <p className="text-4xl font-black text-primary">${product.price}.00</p>
                        <p className="text-xl text-slate-400 line-through font-bold">${product.originalPrice}.00</p>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-black">SAVE 15%</span>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Size Selector */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-black text-sm uppercase tracking-widest">Select Size (EU)</h3>
                            <button className="text-xs font-bold underline underline-offset-4 hover:text-primary">Size Guide</button>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {product.sizes.map((size) => (
                                <button key={size} className="h-14 border-2 rounded-2xl flex items-center justify-center text-lg font-black hover:border-primary hover:text-primary transition-all active:scale-95 focus:ring-2 ring-primary">
                                    {size}
                                </button>
                            ))}
                            <button className="h-14 border-2 border-dashed rounded-2xl flex items-center justify-center text-xs font-bold text-slate-400 italic">
                                More
                            </button>
                        </div>
                    </div>

                    {/* Color Selector */}
                    <div className="space-y-3">
                         <h3 className="font-black text-sm uppercase tracking-widest">Color: <span className="text-slate-500 font-bold uppercase ml-1">Chicago Red</span></h3>
                         <div className="flex gap-4">
                            {product.colors.map((color) => (
                                <button 
                                    key={color.name} 
                                    className="h-10 w-10 rounded-full border-2 border-white ring-2 ring-transparent hover:ring-slate-300 transition-all"
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                />
                            ))}
                         </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <Button size="lg" className="h-20 text-xl font-black rounded-3xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                        ADD TO BAG — ${product.price}.00
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-green-600 py-2">
                        <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                        {product.stockStatus} - Ships within 24 hours
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-6">
                    <div className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                            <Truck className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase tracking-tight">Express Delivery</p>
                            <p className="text-xs font-bold text-muted-foreground">Free shipping on all premium collections</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase tracking-tight">Lifetime Warranty</p>
                            <p className="text-xs font-bold text-muted-foreground">100% Guaranteed authentic product</p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t">
                    <h3 className="font-black text-xl mb-4">Product Details</h3>
                    <p className="text-slate-600 leading-relaxed font-medium mb-6">
                        {product.description}
                    </p>
                    <ul className="space-y-4">
                        {product.features.map((feature, i) => (
                            <li key={i} className="flex gap-3 text-sm font-bold">
                                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                </div>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      </main>

      <footer className="w-full py-12 bg-slate-50 border-t mt-20">
        <div className="container px-4 mx-auto text-center">
             <div className="flex justify-center gap-8 mb-6">
                <Link href="#" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary">Returns</Link>
                <Link href="#" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary">Shipping</Link>
                <Link href="#" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary">Contact</Link>
             </div>
             <p className="text-xs font-bold text-slate-400">© 2026 SHOESHOP INC. ELEVATE YOUR STEP.</p>
        </div>
      </footer>
    </div>
  )
}
