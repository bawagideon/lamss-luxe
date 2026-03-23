import { Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function GiftCardsPage() {
  return (
    <div className="w-full max-w-2xl space-y-12 h-full flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
          GIFT CARDS
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center pt-20">
        <div className="w-full max-w-sm aspect-[1.6/1] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
          
          {/* Decorative Gloss Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000 point-events-none" />
          
          <div className="flex justify-between items-start z-10">
            <h3 className="text-white/90 font-black tracking-widest uppercase text-sm">Lamssé Luxe</h3>
            <Gift className="w-6 h-6 text-white/50" />
          </div>
          
          <div className="z-10 mt-auto flex items-end justify-between">
            <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">
              Digital Gift Card
            </span>
          </div>

        </div>

        <div className="text-center mt-12 max-w-md space-y-4">
          <Badge className="bg-black text-white hover:bg-black uppercase tracking-widest text-[10px] font-black px-3 py-1 mb-2">
            Coming Soon
          </Badge>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            The Perfect Gift
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            We are actively working on bringing you digital gift cards. Give the gift of luxury and confidence. Check back soon!
          </p>
        </div>
      </div>
    </div>
  );
}
