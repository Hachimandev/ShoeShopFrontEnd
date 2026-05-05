import Link from "next/link"
import { ChevronRight, Star, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Home() {
  return (
    <>
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
                  <Link href="/products">
                    <Button size="lg" className="px-10 h-14 text-lg w-full">
                      Shop Now
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button size="lg" variant="outline" className="px-10 h-14 text-lg w-full">
                      View Catalog
                    </Button>
                  </Link>
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
    </>
  )
}

