import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Region = {
  code: string;
  country: string;
  currency: string;
  symbol: string;
  flag: string;
  isRecommended?: boolean;
};

export const regions: Region[] = [
  { 
    code: 'CAD', 
    country: 'Canada', 
    currency: 'CAD', 
    symbol: '$', 
    flag: '🇨🇦',
    isRecommended: true 
  },
  { 
    code: 'USD', 
    country: 'United States', 
    currency: 'USD', 
    symbol: '$', 
    flag: '🇺🇸' 
  },
  { 
    code: 'GBP', 
    country: 'United Kingdom', 
    currency: 'GBP', 
    symbol: '£', 
    flag: '🇬🇧' 
  },
  { 
    code: 'NGN', 
    country: 'Nigeria', 
    currency: 'NGN', 
    symbol: '₦', 
    flag: '🇳🇬' 
  },
  { 
    code: 'GHS', 
    country: 'Ghana', 
    currency: 'GHS', 
    symbol: 'GH₵', 
    flag: '🇬🇭' 
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
