import Link from "next/link"
import { ShoppingBag, Filter, ChevronDown, Star, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

const PRODUCTS = [
  { id: 1, name: "Air Jordan 1 Retro", price: 189, category: "Basketball", rating: 4.9 },
  { id: 2, name: "Nike Air Max 270", price: 150, category: "Running", rating: 4.8 },
  { id: 3, name: "Adidas Ultraboost", price: 180, category: "Running", rating: 4.7 },
  { id: 4, name: "Puma Suede Classic", price: 85, category: "Lifestyle", rating: 4.5 },
  { id: 5, name: "Nike Blazer Mid '77", price: 105, category: "Lifestyle", rating: 4.6 },
  { id: 6, name: "New Balance 550", price: 110, category: "Lifestyle", rating: 4.8 },
]

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center font-bold text-2xl tracking-tighter" href="/">
          <ShoppingBag className="mr-2 h-6 w-6" />
          <span>SHOESHOP</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
            <nav className="hidden md:flex gap-6 mr-6">
                <Link className="text-sm font-bold hover:text-primary" href="/products">Collection</Link>
                <Link className="text-sm font-medium hover:text-primary" href="#">New Arrivals</Link>
                <Link className="text-sm font-medium hover:text-primary" href="#">Sales</Link>
            </nav>
            <Link href="/auth/login">
                <Button variant="outline" size="sm">Login</Button>
            </Link>
        </div>
      </header>

      <main className="flex-1 container px-4 py-8 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Our Collection</h1>
                <p className="text-muted-foreground">Showing {PRODUCTS.length} distinctive styles</p>
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
          {PRODUCTS.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
                <div className="bg-white rounded-3xl p-3 transition-all hover:shadow-xl border border-transparent hover:border-slate-100">
                    <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100 relative mb-4">
                        <Image
                            alt={product.name}
                            className="object-cover transition-transform group-hover:scale-110 duration-500"
                            fill
                            src="/login_picture.jpg"
                        />
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                                <ShoppingBag className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1 px-1">
                        <p className="text-xs font-bold text-primary uppercase tracking-wider">{product.category}</p>
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                            <span className="font-black text-xl">${product.price}.00</span>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="h-3.5 w-3.5 fill-current" />
                                <span className="text-xs font-bold text-slate-600">{product.rating}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="w-full py-8 bg-white border-t mt-12">
        <div className="container px-4 mx-auto text-center">
             <p className="text-xs text-slate-500">© 2026 SHOESHOP Inc. Premium Footwear.</p>
        </div>
      </footer>
    </div>
  )
}
