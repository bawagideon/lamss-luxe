import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Learn about the mission and vision behind Lamssé Luxe. Freshly curated fashion for the Queen.",
};

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-40 pb-24 transition-colors duration-500">
      <div className="container mx-auto px-8 sm:px-10 max-w-5xl">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic drop-shadow-sm">About Lamssé</h1>
          <p className="text-lg md:text-xl text-muted-foreground uppercase tracking-[0.4em] font-black max-w-2xl mx-auto border-y border-zinc-100 dark:border-zinc-800 py-6">
             The intersection of fashion, confidence, and community.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert mx-auto max-w-4xl prose-headings:font-black prose-headings:tracking-widest prose-headings:uppercase">
          <div className="relative w-full h-[700px] mb-20 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10 group">
            <Image
              src="/Lammy-about.jpeg"
              alt="Lamssé Luxe Founder"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="space-y-24">
             {/* Our Story */}
             <section className="relative">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest mb-10 text-primary italic">Our Story</h2>
                <div className="space-y-8 text-[17px] md:text-[18px] font-bold text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                   <p>
                     Lamssé Luxe started from a simple but very real experience.
                   </p>
                   <div className="p-8 md:p-12 border-l-4 border-primary bg-zinc-50 dark:bg-zinc-900/50 rounded-r-2xl transform hover:-translate-y-1 transition-transform">
                      <p className="text-zinc-800 dark:text-zinc-200 italic">
                        &quot;I once ordered outfits for an important moment, waited weeks, and at the last minute, the order never arrived. That experience made me realize how difficult it was to find stylish, affordable pieces without long delays or uncertainty, especially when you actually need them.&quot;
                      </p>
                   </div>
                   <p>
                     Lamssé Luxe was created to solve that. What began as a fashion solution has grown into something more: a brand that provides beautiful pieces and creates a space where women feel <span className="text-foreground">confident, seen, and connected.</span>
                   </p>
                </div>
             </section>

             {/* The Mission */}
             <section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                   <div>
                      <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest mb-8 text-primary italic">The Mission</h2>
                      <p className="text-[17px] font-bold text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                        To provide stylish, ready-to-wear pieces that help women show up confidently in every space they enter, while building a community that supports their growth, lifestyle, and self-expression.
                      </p>
                      <p className="text-[17px] font-black uppercase tracking-widest text-[#FF2B8B]">
                        We creation for the Intentional Woman.
                      </p>
                   </div>
                   <div className="bg-zinc-100 dark:bg-zinc-800/50 aspect-square rounded-3xl flex items-center justify-center p-12 overflow-hidden ring-1 ring-border">
                      <p className="text-6xl md:text-8xl font-black text-zinc-200 dark:text-zinc-700 select-none transform rotate-[-10deg]">MISSION</p>
                   </div>
                </div>
             </section>

             {/* The Vision */}
             <section className="bg-zinc-900 text-white p-12 md:p-16 rounded-[40px] shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/40 transition-colors" />
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest mb-10 text-primary italic relative z-10">The Vision</h2>
                <div className="space-y-8 text-[17px] md:text-[18px] font-bold text-zinc-300 leading-relaxed relative z-10">
                   <p>
                     We believe in the connection between how you look, how you feel, and how you show up.
                   </p>
                   <p>
                     Lamssé Luxe is building more than a fashion brand. Through <span className="text-primary">Luxe Network</span>, we are creating a community where women can connect and grow, and through <span className="text-primary italic">Her Elegance Series</span>, we bring that community to life through shared experiences.
                   </p>
                   <p className="pt-12 border-t border-white/10 text-white text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight">
                     Lamssé Luxe is for the woman who is becoming more of herself every day.
                   </p>
                </div>
             </section>
          </div>
        </div>
      </div>
    </main>
  );
}
