import Link from "next/link"
import { ShoppingBag, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center font-bold text-2xl tracking-tighter" href="/">
          <ShoppingBag className="mr-2 h-6 w-6" />
          <span>SHOESHOP</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Collection
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            New Arrivals
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Sales
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/auth/login">
            Login
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4 text-left">
                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl xl:text-7xl/none">
                    Step into Style <br /> with SHOESHOP
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                    Discover the perfect blend of comfort, durability, and world-class design. Your journey to excellence starts with the right pair of shoes.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Button size="lg" className="px-10 h-14 text-lg">
                    Shop Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="px-10 h-14 text-lg">
                    View Catalog
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                         <Image src="/login_picture.jpg" alt="user" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <p className="text-muted-foreground">Trusted by 10,000+ happy customers</p>
                </div>
              </div>
              <div className="mx-auto flex w-full items-center justify-center lg:order-last">
                <div className="relative h-[300px] w-full sm:h-[400px] md:h-[500px] lg:h-[600px]">
                  <Image
                    alt="Latest Shoe Collection"
                    className="object-cover rounded-3xl shadow-2xl transition-transform hover:scale-[1.02] duration-500"
                    fill
                    src="/login_picture.jpg"
                    priority
                  />
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block">
                    <p className="text-sm font-bold">New Arrival</p>
                    <p className="text-2xl font-black text-primary">NIKE AIR MAX</p>
                    <Button variant="link" className="p-0 h-auto text-primary font-bold">Learn more →</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Best Sellers</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Explore our most loved styles, designed for performance and built for everyday life.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group relative bg-slate-50 rounded-3xl p-4 transition-all hover:bg-white hover:shadow-2xl">
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-white relative mb-4">
                     <Image
                      alt="Shoe Product"
                      className="object-cover transition-transform group-hover:scale-110 duration-500"
                      fill
                      src="/login_picture.jpg"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1 px-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xl">Air Jordan {i}</h3>
                      <span className="font-black text-2xl text-primary">$189.00</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Premium Men&apos;s Shoes</p>
                    <div className="flex items-center gap-1 py-2 text-yellow-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-current" />
                      ))}
                      <span className="text-xs text-muted-foreground ml-2">(4.9)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 bg-slate-900 text-slate-200">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-12 lg:grid-cols-4">
            <div className="space-y-4">
              <Link className="flex items-center font-bold text-2xl tracking-tighter text-white" href="/">
                <ShoppingBag className="mr-2 h-6 w-6" />
                <span>SHOESHOP</span>
              </Link>
              <p className="text-sm text-slate-400">
                Premium quality footwear for those who demand excellence in every step. 
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Shop</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#">All Collection</Link></li>
                <li><Link href="#">New Arrivals</Link></li>
                <li><Link href="#">Sale</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#">Shipping</Link></li>
                <li><Link href="#">Returns</Link></li>
                <li><Link href="#">Contact Us</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-white">Stay Updated</h4>
              <p className="text-sm text-slate-400">Subscribe for exclusive offers.</p>
              <div className="flex gap-2">
                <Input placeholder="Email" className="bg-slate-800 border-slate-700 text-white" />
                <Button size="sm">Go</Button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">© 2026 SHOESHOP Inc. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-slate-500">
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

