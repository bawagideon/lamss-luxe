import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Learn about the mission and vision behind Lamssé Luxe. The intersection of fashion, confidence, and community.",
};

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-white pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">About Lamssé Luxe</h1>
          <p className="text-xl text-muted-foreground">The intersection of fashion, confidence, and community.</p>
        </div>
        
        <div className="prose prose-lg mx-auto prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary">
          <div className="relative w-full h-[600px] mb-12 rounded-2xl overflow-hidden shadow-lg">
            <Image 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop" 
              alt="Fashion Forward Women" 
              fill
              className="object-cover"
            />
          </div>

          <h2 className="text-2xl mt-8 mb-4">Our Story</h2>
          <p className="mb-8 text-gray-600 leading-relaxed">
            Lamssé Luxe was born from a simple realization: women building their empires deserve a wardrobe that matches their ambition and their need for a &quot;soft life.&quot; Our founder saw a gap between high-end fashion and the community-driven support systems women crave. Taking inspiration from the rapid growth of inclusive fashion brands and tight-knit wellness communities, Lamssé Luxe was created to be more than just a store—it is a network. We believe that empowering women goes beyond the fabric; it&apos;s about the feeling.
          </p>

          <h2 className="text-2xl mt-8 mb-4">The Mission</h2>
          <p className="mb-8 text-gray-600 leading-relaxed">
            To provide ready-to-slay fashion that empowers women to step into rooms radiating confidence, while simultaneously building a community that nurtures their personal and professional growth. We design for the unapologetic queen who values aesthetics just as much as authentic connections.
          </p>

          <h2 className="text-2xl mt-8 mb-4">The Vision</h2>
          <p className="text-gray-600 leading-relaxed pb-12 border-b">
            We believe in the powerful intersection of fashion, confidence, and community. When you look your best, you feel your best. And when you are surrounded by like-minded women, there is no limit to what you can achieve. Welcome to the Lamssé Luxe circle.
          </p>
        </div>
      </div>
    </main>
  );
}
