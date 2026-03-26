"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { searchProducts, getActiveProducts } from "@/app/actions/products";

interface SearchProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string;
}

export function SearchBar({ isTransparent }: { isTransparent: boolean }) {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trending, setTrending] = useState<SearchProduct[]>([]);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Load "Trending" state once
  useEffect(() => {
    if (isFocused && trending.length === 0) {
      getActiveProducts().then(data => {
        setTrending(data.slice(0, 4)); 
      });
    }
  }, [isFocused, trending.length]);

  // Load search results dynamically via .ilike fuzzy matching
  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      setIsLoading(true);
      searchProducts(debouncedQuery).then(data => {
        setResults(data);
        setIsLoading(false);
      });
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  // Capture clicks outside drop-down to securely close overlay
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchContainerRef} className="flex flex-1 xl:max-w-md max-w-sm relative">
      <div className={`flex flex-1 w-full px-5 py-2.5 rounded-full border transition-colors z-50 ${
        isFocused 
          ? "border-black bg-white text-black drop-shadow-sm" 
          : isTransparent 
            ? "border-white/30 bg-white/10 text-white placeholder-white/80" 
            : "border-border bg-muted/50 text-foreground"
      }`}>
        <Search className={`w-4 h-4 mr-3 opacity-60 flex-shrink-0 ${isFocused ? 'text-black opacity-100' : ''}`} />
        <input 
          type="text" 
          placeholder="Search within Lamssé Luxe..." 
          className={`bg-transparent border-none outline-none w-full text-xs font-bold tracking-wide ${isFocused ? 'text-black placeholder-gray-500' : 'placeholder-current opacity-80'}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        {isFocused && (
          <button onClick={() => { setQuery(""); setIsFocused(false); }} className="ml-2 text-black opacity-50 hover:opacity-100 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isFocused && (
        <>
          {/* Fashion Nova transparent curtain drop-down background */}
          <div className="fixed inset-0 bg-black/40 z-40 transition-opacity animate-in fade-in" />
          
          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-[95vw] md:w-[650px] lg:w-[800px] bg-white text-black rounded-b-2xl shadow-2xl p-6 md:p-8 z-50 animate-in fade-in slide-in-from-top-2 border-t-0 max-h-[85vh] overflow-y-auto overflow-x-hidden">
            
            {/* Main Categories Header Tab Row */}
            <div className="flex items-center space-x-6 border-b border-gray-200 pb-3 mb-6">
              <Link href="/shop" onClick={() => setIsFocused(false)} className="text-xs font-black tracking-widest uppercase border-b-[3px] border-black pb-1.5">Shop All</Link>
              <Link href="/shop/dresses" onClick={() => setIsFocused(false)} className="text-xs font-black tracking-widest uppercase text-gray-400 hover:text-black transition-colors">Dresses</Link>
              <Link href="/shop/two-piece" onClick={() => setIsFocused(false)} className="text-xs font-black tracking-widest uppercase text-gray-400 hover:text-black transition-colors">Two-Piece</Link>
              <Link href="/shop/tops" onClick={() => setIsFocused(false)} className="text-xs font-black tracking-widest uppercase text-gray-400 hover:text-black transition-colors">Tops</Link>
            </div>

            {query.trim() === "" ? (
              <div className="space-y-8">
                {/* Hot Searches Wrapper */}
                <div>
                  <h3 className="text-sm font-bold mb-4 tracking-tight">Hot Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {["velvet gowns", "two piece matching sets", "silk dresses", "vacation outfits", "date night tops"].map(pill => (
                      <button key={pill} onClick={() => setQuery(pill)} className="px-4 py-2 rounded-full border border-gray-200 bg-white text-xs font-bold hover:border-black transition-colors shadow-sm">
                        {pill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending Images Column Matrix */}
                <div>
                  <div className="grid grid-cols-4 gap-6">
                    <h3 className="text-sm font-bold mb-2 tracking-tight">Top Searches</h3>
                    <h3 className="text-sm font-bold mb-2 tracking-tight">Trending</h3>
                    <h3 className="text-sm font-bold mb-2 tracking-tight">Occasion</h3>
                    <h3 className="text-sm font-bold mb-2 tracking-tight">New Drops</h3>
                  </div>

                  <div className="grid grid-cols-4 gap-6 mt-2">
                    {/* Rather than manually map static arrays, map out the live products intelligently */}
                    {trending.map((p, idx) => (
                      <Link key={p.id} href={`/product/${p.id}`} onClick={() => setIsFocused(false)} className="group flex items-start space-x-3 hover:opacity-80 transition-opacity mb-4">
                        <div className="text-[10px] font-black mt-1 w-2">{idx + 1}</div>
                        <div className="relative w-14 h-20 rounded shadow-sm overflow-hidden bg-gray-50 flex-shrink-0">
                          <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col pt-1">
                          <p className="text-xs font-medium leading-tight">{p.name}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
                {/* Dynamic Fuzzy Query Results */}
                <div>
                  <h3 className="text-sm font-bold mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    <button onClick={() => setQuery(query + " dresses")} className="px-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm text-xs font-bold hover:border-black transition-colors">
                      Women&apos;s {query}
                    </button>
                    <button onClick={() => setQuery("sale " + query)} className="px-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm text-xs font-bold hover:border-black transition-colors">
                      Sale {query}
                    </button>
                  </div>

                  <h3 className="text-sm font-bold mb-4">Popular</h3>
                  <div className="space-y-3 mb-8">
                    <button className="flex items-center text-sm font-bold hover:opacity-70">
                      <Search className="w-4 h-4 mr-3" /> {query}
                    </button>
                    <button className="flex items-center text-sm font-bold hover:opacity-70">
                      <Search className="w-4 h-4 mr-3" /> spring {query}
                    </button>
                    <button className="flex items-center text-sm font-bold hover:opacity-70">
                      <Search className="w-4 h-4 mr-3" /> black {query}
                    </button>
                  </div>

                  <h3 className="text-sm font-bold mb-4 flex items-center border-t border-gray-100 pt-6">
                    Products {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin text-gray-400" />}
                  </h3>
                  
                  {results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {results.map((p) => (
                        <Link key={p.id} href={`/product/${p.id}`} onClick={() => setIsFocused(false)} className="group block">
                          <div className="relative aspect-[3/4] rounded shadow-sm overflow-hidden bg-gray-50 mb-2 border border-gray-200">
                            <Image src={p.image_url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <p className="text-[11px] font-bold line-clamp-2 leading-tight pr-2">{p.name}</p>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">${p.price}</p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    !isLoading && <p className="text-sm text-gray-500 italic">No exact matches found for &quot;{query}&quot;.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
