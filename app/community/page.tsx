import { CommunityWaitlist } from "@/components/CommunityWaitlist";
import { Gallery } from "@/components/Gallery";
import { Metadata } from "next";
import { getCommunityMoments } from "@/app/actions/community";

export const metadata: Metadata = {
  title: "The Lamssé Network",
  description: "Join the Lamssé Network. The strongest brands today are community and product combined. Secure your spot in the inner circle.",
};

export default async function CommunityPage() {
  const initialMoments = await getCommunityMoments();

  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-24">
      <div className="container mx-auto px-8 sm:px-10 lg:px-16 py-12 md:py-20 text-center max-w-5xl">
        <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight uppercase italic underline decoration-primary decoration-4 underline-offset-8">The Lamssé Network</h1>
        <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed font-bold tracking-tight">
          Lamssé Luxe is more than just fashion. It is a growing community for women who are intentional about how they show up, how they live, and how they express themselves.
        </p>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-4 font-medium">
          Through Lamssé Network, we are building a space where women can connect, share, and grow together while embracing confidence, style, and a refined soft life mindset.
        </p>
      </div>

      {/* Reusing the Waitlist Form & Edge-to-Edge Hero */}
      <CommunityWaitlist />

      {/* Coming Soon Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-primary mb-4">Next Event Coming Soon</h2>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-8 uppercase">Her Elegance Series — Soft Life Queens Edition</h3>
          
          <div className="bg-card text-card-foreground p-8 md:p-12 rounded-3xl shadow-sm border border-border">
            <p className="text-lg text-muted-foreground mb-6 font-semibold">
              Our first experience is currently in planning.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              This Edition is a carefully curated evening where women come together to relax, connect, and enjoy the moment.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Think silky pyjamas, good wine, meaningful conversations around career and lifestyle, and a space where style meets ease. It is designed to feel effortless, intimate, and refreshing, a true soft life experience.
            </p>
            <a href="#community" className="inline-block px-12 py-5 bg-black text-white hover:bg-black/80 transition-all text-xs tracking-[0.2em] font-bold rounded-full uppercase">
              Register Interest
            </a>
          </div>
        </div>
      </section>

      {/* Social Proof / Gallery */}
      <Gallery initialMoments={initialMoments} />
    </main>
  );
}
