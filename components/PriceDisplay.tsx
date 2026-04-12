"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRegion } from '@/store/useRegion';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  priceCAD: number;
  className?: string;
  currencyClassName?: string;
}

export function PriceDisplay({ priceCAD, className, currencyClassName }: PriceDisplayProps) {
  const { region } = useRegion();
  const [displayPrice, setDisplayPrice] = useState(priceCAD * region.exchangeRate);
  const [isCalculating, setIsCalculating] = useState(false);
  const prevRegionCode = useRef(region.code);

  useEffect(() => {
    if (prevRegionCode.current !== region.code) {
      // Start "calculating" animation
      setIsCalculating(true);
      
      const timer = setTimeout(() => {
        setDisplayPrice(priceCAD * region.exchangeRate);
        setIsCalculating(false);
        prevRegionCode.current = region.code;
      }, 800); // 800ms "calculation" period

      return () => clearTimeout(timer);
    } else {
      setDisplayPrice(priceCAD * region.exchangeRate);
    }
  }, [priceCAD, region]);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <AnimatePresence mode="wait">
        {isCalculating ? (
          <motion.div
            key="calculating"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex gap-0.5"
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: [4, 12, 4],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{ 
                  duration: 0.6, 
                  repeat: Infinity, 
                  delay: i * 0.1 
                }}
                className="w-1 bg-primary rounded-full"
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="price"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-baseline gap-0.5"
          >
            <span className={cn("text-[0.7em] font-black opacity-60", currencyClassName)}>
              {region.symbol}
            </span>
            <motion.span
              key={displayPrice}
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              className="tabular-nums"
            >
              {displayPrice.toLocaleString(undefined, {
                minimumFractionDigits: region.code === 'NGN' ? 0 : 2,
                maximumFractionDigits: region.code === 'NGN' ? 0 : 2,
              })}
            </motion.span>
            <span className="text-[10px] font-black opacity-30 ml-1 uppercase tracking-tighter">
              {region.code}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
