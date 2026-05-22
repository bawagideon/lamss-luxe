    -- Lamssé Luxe: Phase 10 Database Migration
    -- Manual Fulfillment, Shipment Tracking & Detailed Newsletter Audience

    -- 1. Add manual courier tracking fields to the orders table
    ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS order_status text DEFAULT 'Processing',
    ADD COLUMN IF NOT EXISTS tracking_number text DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS tracking_carrier text DEFAULT 'Canada Post';

    -- 2. Add expected legacy columns to prevent webhook and dashboard query failures
    ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS customer_email text DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS total_amount numeric DEFAULT 0.00;

    -- 3. Add expected legacy price column to order_items
    ALTER TABLE public.order_items
    ADD COLUMN IF NOT EXISTS price numeric DEFAULT 0.00;

    -- 4. Add detailed waitlist inputs to the newsletter_subscribers table
    ALTER TABLE public.newsletter_subscribers
    ADD COLUMN IF NOT EXISTS name text DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS city text DEFAULT NULL;

    -- 5. Force Supabase API (PostgREST) to instantly refresh its schema cache
    NOTIFY pgrst, 'reload schema';

