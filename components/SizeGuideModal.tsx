"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler, Info } from "lucide-react";

export function SizeGuideModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="text-muted-foreground text-xs font-bold uppercase tracking-widest hover:text-primary underline underline-offset-4 transition-colors flex items-center gap-2">
          <Ruler className="w-3 h-3" />
          Size Guide
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-950 border-border p-0">
        <div className="bg-black text-white p-6 md:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">Size Guide</DialogTitle>
            <p className="text-zinc-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2">Find your perfect fit with Lamssé Luxe</p>
          </DialogHeader>
        </div>

        <div className="p-4 md:p-8">
          <Tabs defaultValue="cm" className="w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <TabsList className="grid w-full sm:w-[200px] grid-cols-2 bg-zinc-100 dark:bg-zinc-900">
                <TabsTrigger value="cm" className="text-[10px] font-black uppercase">Centimeters</TabsTrigger>
                <TabsTrigger value="inches" className="text-[10px] font-black uppercase">Inches</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2 text-primary">
                 <Info className="w-3.5 h-3.5 shrink-0" />
                 <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Model is 5&apos;8&quot; wearing size S</span>
              </div>
            </div>

            <TabsContent value="cm">
              <SizeTable unit="cm" />
            </TabsContent>
            <TabsContent value="inches">
              <SizeTable unit="inches" />
            </TabsContent>
          </Tabs>

          <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 border-t border-zinc-100 dark:border-zinc-900 pt-6 md:pt-8">
             <div className="space-y-4">
                <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">How to measure</h4>
                <div className="space-y-6">
                  <MeasureStep label="Bust" desc="Measure around the fullest part of your chest." />
                  <MeasureStep label="Waist" desc="Measure around your natural waistline (narrowest part)." />
                  <MeasureStep label="Hips" desc="Measure around the fullest part of your hips." />
                </div>
                
                <div className="mt-6 md:mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900 space-y-4">
                   <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-primary">Fitting Rules</h4>
                   <ul className="space-y-2">
                      <li className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase leading-relaxed flex gap-2">
                         <span className="text-primary shrink-0">•</span> <span>Between sizes? Size down for a snatched fit, or up for comfort.</span>
                      </li>
                      <li className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase leading-relaxed flex gap-2">
                         <span className="text-primary shrink-0">•</span> <span>Measure over your favorite lingerie for the most accurate silhouette.</span>
                      </li>
                      <li className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase leading-relaxed flex gap-2">
                         <span className="text-primary shrink-0">•</span> <span>Keep the tape level and flat against your body—no pulling tight.</span>
                      </li>
                   </ul>
                </div>
             </div>
             <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-8 rounded-sm flex items-center justify-center relative overflow-hidden group min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Elegant High-Fashion Silhouette */}
                <svg viewBox="0 0 100 200" className="w-32 h-64 md:w-40 md:h-80 text-zinc-900 dark:text-zinc-100 relative z-10">
                   {/* Abstract but recognizable female form */}
                   <path 
                     fill="currentColor" 
                     d="M50 15c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7zm0 15c-10 0-14 10-14 20 0 15 5 25 5 45 0 25-5 40-5 65 0 20 5 40 14 40s14-20 14-40c0-25-5-40-5-65 0-20 5-30 5-45 0-10-4-20-14-20z" 
                     className="opacity-10"
                   />
                   <path 
                     fill="none" 
                     stroke="currentColor" 
                     strokeWidth="0.5" 
                     d="M50 30c-8 0-12 8-12 18 0 12 4 22 4 40 0 22-4 35-4 58 0 18 4 34 12 34s12-16 12-34c0-23-4-36-4-58 0-18 4-28 4-40 0-10-4-18-12-18z"
                   />
                   
                   {/* Measurement Indicators */}
                   <g className="text-primary">
                      {/* Bust */}
                      <line x1="38" y1="55" x2="62" y2="55" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="38" cy="55" r="1.5" fill="currentColor" />
                      <circle cx="62" cy="55" r="1.5" fill="currentColor" />
                      
                      {/* Waist */}
                      <line x1="42" y1="85" x2="58" y2="85" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="42" cy="85" r="1.5" fill="currentColor" />
                      <circle cx="58" cy="85" r="1.5" fill="currentColor" />
                      
                      {/* Hips */}
                      <line x1="38" y1="115" x2="62" y2="115" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="38" cy="115" r="1.5" fill="currentColor" />
                      <circle cx="62" cy="115" r="1.5" fill="currentColor" />
                   </g>
                </svg>
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SizeTable({ unit }: { unit: "cm" | "inches" }) {
  const data = unit === "cm" ? [
    { size: "XXS", us: "0", bust: "78-81", waist: "58-61", hips: "84-87" },
    { size: "XS", us: "2", bust: "82-85", waist: "62-65", hips: "88-91" },
    { size: "S", us: "4-6", bust: "86-89", waist: "66-69", hips: "92-95" },
    { size: "M", us: "8-10", bust: "90-94", waist: "70-74", hips: "96-100" },
    { size: "L", us: "12", bust: "95-99", waist: "75-79", hips: "101-105" },
    { size: "XL", us: "14", bust: "100-104", waist: "80-84", hips: "106-110" },
  ] : [
    { size: "XXS", us: "0", bust: "30.5-32", waist: "23-24", hips: "33-34" },
    { size: "XS", us: "2", bust: "32.5-33.5", waist: "24.5-25.5", hips: "34.5-35.5" },
    { size: "S", us: "4-6", bust: "34-35", waist: "26-27", hips: "36-37.5" },
    { size: "M", us: "8-10", bust: "35.5-37", waist: "27.5-29", hips: "38-39.5" },
    { size: "L", us: "12", bust: "37.5-39", waist: "29.5-31", hips: "40-41.5" },
    { size: "XL", us: "14", bust: "39.5-41", waist: "31.5-33", hips: "42-43.5" },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-[11px] text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-100 dark:border-zinc-900">
            <th className="py-4 font-black uppercase tracking-widest text-zinc-400">Size</th>
            <th className="py-4 font-black uppercase tracking-widest text-zinc-400">US</th>
            <th className="py-4 font-black uppercase tracking-widest text-zinc-400">Bust</th>
            <th className="py-4 font-black uppercase tracking-widest text-zinc-400">Waist</th>
            <th className="py-4 font-black uppercase tracking-widest text-zinc-400">Hips</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900/50">
          {data.map((row) => (
            <tr key={row.size} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
              <td className="py-4 font-black text-black dark:text-white">{row.size}</td>
              <td className="py-4 font-bold text-zinc-500">{row.us}</td>
              <td className="py-4 font-bold text-zinc-500">{row.bust}</td>
              <td className="py-4 font-bold text-zinc-500">{row.waist}</td>
              <td className="py-4 font-bold text-zinc-500">{row.hips}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MeasureStep({ label, desc }: { label: string, desc: string }) {
  return (
    <div className="flex gap-4">
       <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
       <div>
          <span className="block text-[10px] font-black uppercase tracking-widest mb-0.5">{label}</span>
          <p className="text-[10px] text-muted-foreground font-medium">{desc}</p>
       </div>
    </div>
  );
}
