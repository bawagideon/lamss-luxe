import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] pt-24 pb-12 text-white overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* DESKTOP FOOTER GRID (1:1 Parity with Design Image) */}
        <div className="hidden lg:grid grid-cols-4 gap-16 mb-32 border-t border-white/5 pt-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-10">
            <Link href="/" className="relative w-24 h-6">
              <Image src="/Logo-dark.png" alt="Logo" fill className="object-contain object-left" priority />
            </Link>
            <div className="flex flex-col gap-10 text-[13px] font-medium leading-relaxed text-zinc-400 max-w-[280px]">
              <p>Ready-to-Slay Fashion for women who move with confidence and intention.</p>
              <p>Blending fashion, community, and experience into one lifestyle.</p>
            </div>
          </div>

          {/* Shop Column */}
          <div className="flex flex-col gap-10">
            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-white">Shop</h3>
            <div className="flex flex-col gap-6 text-[11px] font-black uppercase tracking-[0.2em]">
              {["Tops", "Two-Piece", "Dresses", "New Arrivals"].map(link => (
                <Link key={link} href={`/shop/${link.toLowerCase().replace(" ", "-")}`} className="text-zinc-400 hover:text-[#FF2B8B] transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-10">
            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-white">Company</h3>
            <div className="flex flex-col gap-6 text-[11px] font-black uppercase tracking-[0.2em]">
              {["About & Founder Story", "Lamssé Network Experience", "Contact", "Shipping & Returns"].map(link => (
                <Link key={link} href="#" className="text-zinc-400 hover:text-[#FF2B8B] transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="flex flex-col gap-8">
            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-white">Join The Circle</h3>
            <div className="flex flex-col gap-8">
               <p className="text-[11px] font-medium text-zinc-500 leading-relaxed max-w-[260px]">
                 Get style inspiration, event updates, and exclusive drops.
               </p>
               <div className="flex flex-col gap-3">
                  <Input 
                    placeholder="Email Address" 
                    className="bg-[#0F0F0F] border-none h-12 text-[11px] font-black uppercase tracking-[0.1em] text-white rounded-md placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-white/20" 
                  />
                  <button className="w-full h-12 bg-[#FF2B8B] text-[11px] font-black uppercase tracking-[0.2em] text-white rounded-md hover:opacity-90 transition-opacity">
                    Subscribe
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* MOBILE FOOTER (Vertical Stack Optimized) */}
        <div className="lg:hidden flex flex-col items-center">
           {/* Mobile Brand */}
           <div className="flex flex-col items-center text-center gap-8 mb-16 px-4">
              <Link href="/" className="relative w-24 h-6">
                <Image src="/Logo-dark.png" alt="Logo" fill className="object-contain" priority />
              </Link>
              <div className="flex flex-col gap-6 text-[12px] font-medium text-zinc-400 leading-relaxed">
                <p>Ready-to-Slay Fashion for women who move with confidence and intention.</p>
                <p>Blending fashion, community, and experience into one lifestyle.</p>
              </div>
           </div>

           {/* Mobile Newsletter (Specific Magenta Button) */}
           <div className="w-full bg-[#0F0F0F] rounded-2xl p-10 flex flex-col items-center mb-16 shadow-2xl">
              <h3 className="text-[12px] font-black uppercase tracking-[0.3em] mb-10 text-center text-white">Join The Circle</h3>
              <div className="w-full flex flex-col gap-4">
                 <Input 
                    placeholder="Email Address" 
                    className="bg-[#1A1A1A] border-none h-14 text-[11px] font-black uppercase tracking-widest text-white rounded-lg placeholder:text-zinc-700" 
                 />
                 <button className="w-full h-14 bg-[#FF2B8B] text-[11px] font-black uppercase tracking-[0.25em] text-white rounded-lg">
                    Subscribe
                 </button>
              </div>
           </div>

           {/* Mobile Accordions */}
           <div className="w-full mb-16">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="shop" className="border-white/5">
                  <AccordionTrigger className="text-[11px] font-black uppercase tracking-[0.3em] py-6 text-white">Shop</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-5 pb-6">
                    {["Tops", "Two-Piece", "Dresses", "New Arrivals"].map(link => (
                      <Link key={link} href="#" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{link}</Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="company" className="border-white/5">
                  <AccordionTrigger className="text-[11px] font-black uppercase tracking-[0.3em] py-6 text-white">Company</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-5 pb-6">
                    {["About & Founder Story", "Lamssé Network Experience", "Contact", "Shipping & Returns"].map(link => (
                      <Link key={link} href="#" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{link}</Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
           </div>
        </div>

        {/* BOTTOM BAR (Legal & Specific Social) */}
        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 text-center">
            &copy; 2026 LAMSSÉ LUXE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[#FF2B8B] transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
