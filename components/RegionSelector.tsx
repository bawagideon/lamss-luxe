"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRegion, regions, type Region } from "@/store/useRegion";
import toast from "react-hot-toast";

interface RegionSelectorProps {
  isTransparent?: boolean;
}

export function RegionSelector({ isTransparent }: RegionSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const { region: selectedRegion, setRegion } = useRegion();

  const handleSelect = (region: Region) => {
    setRegion(region);
    setOpen(false);
    toast.success(`Region updated to ${region.country}`, {
      icon: region.flag,
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      },
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-9 px-3 gap-2 font-black text-xs tracking-widest uppercase transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5",
            isTransparent 
              ? "text-white hover:text-white" 
              : "text-primary dark:text-foreground"
          )}
        >
          <span className="text-base leading-none">{selectedRegion.flag}</span>
          <span>{selectedRegion.code}</span>
          <ChevronDown className={cn(
            "ml-1 h-3 w-3 shrink-0 opacity-50 transition-transform duration-200",
            open ? "rotate-180" : "rotate-0"
          )} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0 bg-white dark:bg-zinc-950 border-border shadow-2xl rounded-xl overflow-hidden" align="end">
        <div className="p-4 border-b border-border bg-gray-50/50 dark:bg-zinc-900/50">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Your Currency and Region</h3>
        </div>
        <Command className="bg-transparent">
          <CommandInput 
            placeholder="Search country or region..." 
            className="h-12 border-none focus:ring-0 text-sm font-medium"
          />
          <CommandList className="max-h-[350px] scrollbar-hide">
            <CommandEmpty className="py-10 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
              No region found.
            </CommandEmpty>
            <CommandGroup className="p-2">
              <div className="px-2 py-2 mb-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400/80">Select Region/Currency</p>
              </div>
              {regions.map((region) => (
                <CommandItem
                  key={region.code}
                  value={`${region.country} ${region.code}`}
                  onSelect={() => handleSelect(region)}
                  className={cn(
                    "flex items-center justify-between px-3 py-3 mb-1 rounded-lg cursor-pointer transition-all duration-200 group aria-selected:bg-black aria-selected:text-white",
                    selectedRegion.code === region.code ? "bg-gray-100 dark:bg-zinc-900" : "hover:bg-gray-50 dark:hover:bg-zinc-900/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl group-aria-selected:scale-110 transition-transform">{region.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold tracking-tight">
                        {region.country}
                        {region.isRecommended && (
                          <span className="ml-2 text-[9px] font-black uppercase tracking-tighter text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">Recommended</span>
                        )}
                      </span>
                      <span className="text-[10px] font-medium opacity-50 group-aria-selected:opacity-80">
                        {region.currency} ({region.symbol})
                      </span>
                    </div>
                  </div>
                  {selectedRegion.code === region.code && (
                    <Check className="h-4 w-4 shrink-0" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 border-t border-border">
          <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
            Prices will be displayed in <span className="font-bold text-primary dark:text-foreground">{selectedRegion.currency} ({selectedRegion.symbol})</span>. 
            Final totals at checkout will reflect this selection.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
