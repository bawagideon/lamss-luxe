"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCommunityMoments } from "@/app/actions/community";

const fallbackImages = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=600&auto=format&fit=crop"
];

export function Gallery({ initialMoments }: { initialMoments?: any[] }) {
  const [moments, setMoments] = useState<any[]>([]);

  useEffect(() => {
    if (initialMoments && initialMoments.length > 0) {
      setMoments(initialMoments);
    } else {
      getCommunityMoments().then(data => {
        if (data && data.length > 0) {
          setMoments(data);
        }
      });
    }
  }, [initialMoments]);

  // If no database moments exist yet, use fallback placeholders for the "premium" look
  const displayMoments = moments.length > 0 
    ? moments 
    : fallbackImages.map((img, i) => ({ id: `fallback-${i}`, image_url: img, instagram_link: null }));

  return (
    <section className="py-24 bg-background" id="gallery">
      <div className="container mx-auto px-8 sm:px-10 lg:px-16 overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 uppercase italic underline decoration-primary decoration-4 underline-offset-8">Community Moments</h2>
          <div className="text-muted-foreground text-lg max-w-2xl mx-auto space-y-2 font-bold tracking-tight">
            <p>Tag @lamsseluxe.ca or use #LamsséNetwork to be featured.</p>
            <p>We love seeing how you show up, express yourself, and embrace your style.</p>
          </div>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {displayMoments.map((moment, index) => {
            const isVideo = moment.image_url?.match(/\.(mp4|mov|webm)$|video/i);
            const content = (
              <motion.div 
                key={moment.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: (index % 5) * 0.1 }}
                viewport={{ once: true }} 
                className="relative w-full break-inside-avoid overflow-hidden rounded-2xl group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 bg-muted"
                style={{ aspectRatio: index % 3 === 0 ? '3/4' : index % 2 === 0 ? '1/1' : '4/5' }}
              >
                {isVideo ? (
                  <video 
                    src={moment.image_url} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <Image 
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" 
                    src={moment.image_url} 
                    alt="Gallery Moment" 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            );

            if (moment.instagram_link) {
              return (
                <Link key={moment.id} href={moment.instagram_link} target="_blank" rel="noopener noreferrer" className="block break-inside-avoid mb-4">
                  {content}
                </Link>
              );
            }

            return <div key={moment.id} className="mb-4">{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
