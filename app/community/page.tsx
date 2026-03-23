import { CommunityWaitlist } from "@/components/CommunityWaitlist";
import { Gallery } from "@/components/Gallery";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Soft Life Queens Network",
  description: "Join the Lamssé Network. The strongest brands today are community and product combined. Sign up for the Soft Life Queens Night waitlist.",
};

export default function CommunityPage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-24">
      <div className="container mx-auto px-6 py-12 md:py-20 text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">The Lamssé Network</h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Lamssé Luxe is more than just fashion. It is a growing community for women who are intentional about how they show up, how they live, and how they express themselves.
        </p>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-4">
          Through Lamssé Network, we are building a space where women can connect, share, and grow together while embracing confidence, style, and a refined soft life mindset.
        </p>
      </div>

      {/* Reusing the Waitlist Form & Edge-to-Edge Hero */}
      <CommunityWaitlist />

      {/* Coming Soon Section */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-2">Next Event Coming Soon</h2>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-8">Her Elegance Series — Soft Life Queens Edition</h3>
          
          <div className="bg-card text-card-foreground p-8 md:p-12 rounded-2xl shadow-sm border border-border">
            <p className="text-lg text-muted-foreground mb-6 font-semibold">
              Our first experience is currently in planning.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              This Edition is a carefully curated evening where women come together to relax, connect, and enjoy the moment.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Think silky pyjamas, good wine, meaningful conversations around career and lifestyle, and a space where style meets ease. It is designed to feel effortless, intimate, and refreshing, a true soft life experience.
            </p>
            <a href="#community" className="inline-block px-10 py-5 bg-primary/10 hover:bg-primary hover:text-white transition-colors text-primary font-bold rounded-full text-base tracking-widest uppercase">
              Register
            </a>
          </div>
        </div>
      </section>

      {/* Social Proof / Gallery */}
      <Gallery />
    </main>
  );
}
