-- Lamssé Luxe: Phase 9 Database Migration
-- Premium Details, Color Hex Swatches & Wishlist

-- 1. Add color hex swatches, material, and occasion to the products table
ALTER TABLE public.products
ADD COLUMN color_codes text[] DEFAULT '{}'::text[],
ADD COLUMN material text DEFAULT NULL,
ADD COLUMN occasion text DEFAULT NULL;

-- Example of how to backfill existing variants if necessary (Wait for admin portal though):
-- UPDATE public.products SET material = '100% Cotton', occasion = 'Casual outings' WHERE id = 'xxx';
