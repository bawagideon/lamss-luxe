import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-secondary pt-20 pb-10 border-t border-border">
      <div className="container mx-auto px-8 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="col-span-1 lg:col-span-1">
            <div className="relative w-48 h-12 mb-6">
              <Image src="/Logo-light.png" alt="Lamssé Luxe Logo" fill className="object-contain object-left dark:hidden" />
              <Image src="/Logo-dark.png" alt="Lamssé Luxe Logo" fill className="object-contain object-left hidden dark:block" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Ready-to-Slay Fashion for women who move with confidence and intention.<br/><br/>
              Blending fashion, community, and experience into one lifestyle.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-black mb-4 uppercase text-sm tracking-widest text-[#1a1a1a] dark:text-white">Shop</h3>
            <ul className="space-y-3 text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground">
              <li><Link href="/shop/tops" className="hover:text-primary transition-colors">Tops</Link></li>
              <li><Link href="/shop/two-piece" className="hover:text-primary transition-colors">Two-Piece</Link></li>
              <li><Link href="/shop/dresses" className="hover:text-primary transition-colors">Dresses</Link></li>
              <li><Link href="/collections" className="hover:text-primary transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-black mb-4 uppercase text-sm tracking-widest text-[#1a1a1a] dark:text-white">Company</h3>
            <ul className="space-y-3 text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About & Founder Story</Link></li>
              <li><Link href="/community" className="hover:text-primary transition-colors">Lamssé Network Experience</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/shipping-returns" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="font-black mb-4 uppercase text-sm tracking-widest text-[#1a1a1a] dark:text-white">Join The Circle</h3>
            <p className="text-[11px] font-medium text-muted-foreground mb-4">
              Get style inspiration, event updates, and exclusive drops.
            </p>
            <form className="flex flex-col space-y-2">
              <Input 
                type="email" 
                placeholder="Email Address" 
                className="bg-background text-foreground" 
                required 
              />
              <Button type="submit" className="bg-primary hover:bg-primary/80 text-primary-foreground w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
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
