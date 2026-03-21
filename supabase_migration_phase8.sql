-- Lamssé Luxe: Phase 8 Database Migration
-- The Fashion Nova Upgrade (Variants & Multi-Angle Images)

-- 1. Add variants and image angles to the products table
ALTER TABLE public.products
ADD COLUMN sizes text[] DEFAULT '{}'::text[],
ADD COLUMN colors text[] DEFAULT '{}'::text[],
ADD COLUMN image_front text,
ADD COLUMN image_side text,
ADD COLUMN image_back text;

-- (Optional) If we want to rename the existing image_url to image_main, we can do it via:
-- ALTER TABLE public.products RENAME COLUMN image_url TO image_main;
-- But it's safer to keep image_url as the main image and just add the front/side/back arrays for backward compatibility. We will use image_url as the primary.

-- 2. Add selected variant tracking to the orders table
ALTER TABLE public.orders
ADD COLUMN selected_size text,
ADD COLUMN selected_color text;

-- 3. Update existing records (Optional: seed some default values if needed)
-- UPDATE public.products SET sizes = '{"XS", "S", "M", "L", "XL"}' WHERE sizes = '{}';

-- End of migration
