import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-200">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="col-span-1 lg:col-span-1">
            <h2 className="text-xl font-black uppercase tracking-widest mb-4">Lamssé Luxe</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Ready-to-Slay Fashion. Fusing e-commerce with community for the unapologetic soft life queens.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold mb-4 uppercase text-sm tracking-wider">Shop</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/shop/tops" className="hover:text-primary transition-colors">Tops</Link></li>
              <li><Link href="/shop/two-piece" className="hover:text-primary transition-colors">Two-Piece</Link></li>
              <li><Link href="/shop/dresses" className="hover:text-primary transition-colors">Dresses</Link></li>
              <li><Link href="/collections" className="hover:text-primary transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 uppercase text-sm tracking-wider">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About & Founder Story</Link></li>
              <li><Link href="/community" className="hover:text-primary transition-colors">Soft Life Queens Night</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/shipping-returns" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="font-bold mb-4 uppercase text-sm tracking-wider">Join The Circle</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get style inspiration, event announcements, and exclusive drops straight to your inbox.
            </p>
            <form className="flex flex-col space-y-2">
              <Input 
                type="email" 
                placeholder="Email Address" 
                className="bg-white" 
                required 
              />
              <Button type="submit" className="bg-black hover:bg-black/80 text-white w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Lamssé Luxe. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
