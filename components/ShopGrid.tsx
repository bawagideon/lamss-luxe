"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "The Soft Life Slip Dress",
    price: "$120",
    imageDefault: "https://images.unsplash.com/photo-1542289139-44b41662fbfe?q=80&w=800&auto=format&fit=crop",
    imageLifestyle: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Midnight Silk Two-Piece",
    price: "$145",
    imageDefault: "https://images.unsplash.com/photo-1434389678369-1ae14c4abf8d?q=80&w=800&auto=format&fit=crop",
    imageLifestyle: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Luxe Corset Top",
    price: "$85",
    imageDefault: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
    imageLifestyle: "https://images.unsplash.com/photo-1529139574466-a303027c028b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Elegance Maxi Dress",
    price: "$160",
    imageDefault: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop",
    imageLifestyle: "https://images.unsplash.com/photo-1515347619145-c0528ef3c8df?q=80&w=800&auto=format&fit=crop",
  },
];

export function ShopGrid() {
  return (
    <section className="py-24 bg-white" id="shop">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Shop The Look</h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Curated elegance for the modern woman. Wear it during the day, slay it through the night.
            </p>
          </div>
          <Link href="#" className="mt-6 md:mt-0 text-primary font-bold hover:underline transition-all">
            View All Collections &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-sm">
                {/* Default Studio Image */}
                <Image 
                  src={product.imageDefault} 
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
                {/* Lifestyle Hover Image */}
                <Image 
                  src={product.imageLifestyle} 
                  alt={`${product.name} Lifestyle`}
                  fill
                  className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 scale-105 group-hover:scale-100 transition-transform"
                />
                
                {/* Quick Add Button Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <button className="w-full bg-white/95 backdrop-blur-sm text-black py-3 px-4 font-bold text-sm tracking-wide shadow-lg hover:bg-primary hover:text-white transition-colors rounded-sm">
                    Add To Cart &mdash; {product.price}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-start mt-4">
                <div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">Available in 3 colors</p>
                </div>
                <span className="font-bold">{product.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
