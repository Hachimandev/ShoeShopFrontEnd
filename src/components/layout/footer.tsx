"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <footer className="w-full py-12 bg-slate-900 border-t">
      <div className="container px-4 md:px-6 mx-auto text-left">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link className="flex items-center font-bold text-xl text-white" href="/">
              <ShoppingBag className="mr-2 h-5 w-5" />
              <span>SHOESHOP</span>
            </Link>
            <p className="text-sm text-slate-400">
              The world's best footwear, delivered straight to your door.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Collections</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/products">All Collection</Link></li>
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
  );
}
