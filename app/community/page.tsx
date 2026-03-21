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
          Through Lamssé Network, we are building a space where women can connect, share, and grow together while embracing confidence, style, and a soft life mindset.
        </p>
      </div>

      {/* Reusing the Waitlist Form & Edge-to-Edge Hero */}
      <CommunityWaitlist />

      {/* Coming Soon Section */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-2">Coming Soon</h2>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-8">Lamssé Network Experience &mdash; Soft Life Queens Edition</h3>
          
          <div className="bg-card text-card-foreground p-8 md:p-12 rounded-2xl shadow-sm border border-border">
            <p className="text-lg text-muted-foreground mb-6">
              Our first experience is currently in planning.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              This edition will introduce the Lamssé Network in a way that brings together style, conversation, and community in a relaxed and memorable setting.
            </p>
            <div className="inline-block px-6 py-3 bg-primary/10 text-primary font-bold rounded-full text-sm tracking-wide">
              Be part of the first experience.
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Gallery */}
      <Gallery />
    </main>
  );
}
