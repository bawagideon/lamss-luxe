import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Region = {
  code: string;
  country: string;
  currency: string;
  symbol: string;
  flag: string;
  exchangeRate: number; // Relative to CAD
  isRecommended?: boolean;
};

export const regions: Region[] = [
  { 
    code: 'CAD', 
    country: 'Canada', 
    currency: 'CAD', 
    symbol: '$', 
    flag: '🇨🇦',
    exchangeRate: 1,
    isRecommended: true 
  },
  { 
    code: 'USD', 
    country: 'United States', 
    currency: 'USD', 
    symbol: '$', 
    flag: '🇺🇸',
    exchangeRate: 0.74
  },
  { 
    code: 'GBP', 
    country: 'United Kingdom', 
    currency: 'GBP', 
    symbol: '£', 
    flag: '🇬🇧',
    exchangeRate: 0.58
  },
  { 
    code: 'NGN', 
    country: 'Nigeria', 
    currency: 'NGN', 
    symbol: '₦', 
    flag: '🇳🇬',
    exchangeRate: 1100
  },
  { 
    code: 'GHS', 
    country: 'Ghana', 
    currency: 'GHS', 
    symbol: 'GH₵', 
    flag: '🇬🇭',
    exchangeRate: 10
  },
];

interface RegionState {
  region: Region;
  setRegion: (region: Region) => void;
}

export const useRegion = create<RegionState>()(
  persist(
    (set) => ({
      region: regions[0], // Default to Canada
      setRegion: (region) => set({ region }),
    }),
    {
      name: 'lamss-luxe-region',
    }
  )
);
