import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Learn about the mission and vision behind Lamssé Luxe. The intersection of fashion, confidence, and community.",
};

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">About Lamssé Luxe</h1>
          <p className="text-xl text-muted-foreground">The intersection of fashion, confidence, and community.</p>
        </div>

        <div className="prose prose-lg mx-auto prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary">
          <div className="relative w-full h-[600px] mb-12 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/Lammy-about.jpeg"
              alt="Lamssé Luxe Founder"
              fill
              className="object-cover"
            />
          </div>

          <h2 className="text-2xl mt-8 mb-4">Our Story</h2>
          <p className="mb-4 text-gray-600 leading-relaxed">
            Lamssé Luxe started from a simple but very real experience.
          </p>
          <p className="mb-4 text-gray-600 leading-relaxed">
            I once ordered outfits for an important moment, waited weeks, and at the last minute, the order never arrived. That experience made me realize how difficult it was to find stylish, affordable pieces without long delays or uncertainty, especially when you actually need them.
          </p>
          <p className="mb-4 text-gray-600 leading-relaxed">
            Lamssé Luxe was created to solve that.
          </p>
          <p className="mb-8 text-gray-600 leading-relaxed">
            What began as a fashion solution has grown into something more. A brand that not only provides beautiful pieces, but also creates a space where women feel confident, seen, and connected.
          </p>

          <h2 className="text-2xl mt-8 mb-4">The Mission</h2>
          <p className="mb-4 text-gray-600 leading-relaxed">
            To provide stylish, ready-to-wear pieces that help women show up confidently in every space they enter, while building a community that supports their growth, lifestyle, and self-expression.
          </p>
          <p className="mb-8 text-gray-600 leading-relaxed">
            We are creating for women who are intentional about how they look, how they live, and how they carry themselves.
          </p>

          <h2 className="text-2xl mt-8 mb-4">The Vision</h2>
          <p className="mb-4 text-gray-600 leading-relaxed">
            We believe in the connection between how you look, how you feel, and how you show up.
          </p>
          <p className="mb-4 text-gray-600 leading-relaxed">
            Lamssé Luxe is building more than a fashion brand. Through Lamssé Network, we are creating a community where women can connect and grow, and through Her Elegance Series, we bring that community to life through shared experiences.
          </p>
          <p className="mb-4 text-gray-600 leading-relaxed">
            Because when confidence, style, and the right environment come together, everything changes.
          </p>
          <p className="text-gray-600 font-bold leading-relaxed pb-12 border-b">
            Lamssé Luxe is for the woman who is becoming more of herself every day.
          </p>
        </div>
      </div>
    </main>
  );
}
