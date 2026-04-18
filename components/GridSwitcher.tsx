"use client";

import { useUIStore } from "@/store/useUIStore";
import { motion } from "framer-motion";

export function GridSwitcher() {
  const { gridColumns, setGridColumns } = useUIStore();

  const options = [
    { cols: 2, icon: (
      <div className="flex gap-[2.5px]">
        <div className="w-[5px] h-[9px] bg-current rounded-[0.5px]" />
        <div className="w-[5px] h-[9px] bg-current rounded-[0.5px]" />
      </div>
    )},
    { cols: 3, icon: (
      <div className="flex gap-[2px]">
        <div className="w-[3px] h-[9px] bg-current rounded-[0.5px]" />
        <div className="w-[3px] h-[9px] bg-current rounded-[0.5px]" />
        <div className="w-[3px] h-[9px] bg-current rounded-[0.5px]" />
      </div>
    )},
    { cols: 4, icon: (
      <div className="flex gap-[1.5px]">
        <div className="w-[2px] h-[9px] bg-current rounded-[0.5px]" />
        <div className="w-[2px] h-[9px] bg-current rounded-[0.5px]" />
        <div className="w-[2px] h-[9px] bg-current rounded-[0.5px]" />
        <div className="w-[2px] h-[9px] bg-current rounded-[0.5px]" />
      </div>
    )},
  ];

  return (
    <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-[4px] border border-border/40 scale-90 md:scale-100">
      {options.map((opt) => (
        <button
          key={opt.cols}
          onClick={() => setGridColumns(opt.cols)}
          className={`relative px-2.5 py-1.5 transition-colors duration-300 ${
            gridColumns === opt.cols ? "text-primary dark:text-zinc-100" : "text-zinc-400 hover:text-primary"
          }`}
          aria-label={`${opt.cols} columns`}
        >
          {gridColumns === opt.cols && (
            <motion.div
              layoutId="grid-active-indicator"
              className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-[3px] shadow-sm z-0"
              transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
            />
          )}
          <div className="relative z-10">{opt.icon}</div>
        </button>
      ))}
    </div>
  );
}
