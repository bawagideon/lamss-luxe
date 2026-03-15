import { CommunityWaitlist } from "@/components/CommunityWaitlist";
import { Gallery } from "@/components/Gallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soft Life Queens Network",
  description: "Join the Lamssé Network. The strongest brands today are community and product combined. Sign up for the Soft Life Queens Night waitlist.",
};

export default function CommunityPage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-white pt-24">
      <div className="container mx-auto px-6 py-12 md:py-20 text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">The Lamssé Network</h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Lamssé Luxe is more than just fashion. It’s a movement for women who are unapologetically designing their soft lives. The strongest brands today are community and product combined, and we are building a network for you.
        </p>
      </div>

      {/* Reusing the Waitlist Form & Edge-to-Edge Hero */}
      <CommunityWaitlist />

      {/* Past Events Showcase / Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8">Past Events Showcase</h2>
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-primary">Soft Life Queens Night &mdash; Spring Edition</h3>
            <p className="text-gray-600 mb-8 italic">
              &quot;Women gathered for a relaxed evening of conversation, style, and connection. An unforgettable experience that seamlessly blended our love for fashion and our drive for success.&quot;
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="Attendee" className="object-cover w-full h-full" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Sarah Jenkins</p>
                <p className="text-xs text-muted-foreground">Toronto, ON</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Gallery */}
      <Gallery />
    </main>
  );
}
