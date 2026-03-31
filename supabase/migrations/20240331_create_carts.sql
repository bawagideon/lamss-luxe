-- SQL MIGRATION: CREATE CARTS TABLE
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL, -- Logical reference to product
  variant_id TEXT NOT NULL, -- Composite ID: `${productId}-${size}-${color}`
  quantity INTEGER DEFAULT 1,
  metadata JSONB, -- Optional data (name, price, image)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own carts"
ON carts FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- UPSERT FUNCTION for easy syncing
CREATE OR REPLACE FUNCTION sync_cart_item(
  p_user_id UUID,
  p_product_id UUID,
  p_variant_id TEXT,
  p_quantity INTEGER,
  p_metadata JSONB
) RETURNS VOID AS $$
BEGIN
  INSERT INTO carts (user_id, product_id, variant_id, quantity, metadata)
  VALUES (p_user_id, p_product_id, p_variant_id, p_quantity, p_metadata)
  ON CONFLICT (user_id, variant_id) -- Requires unique constraint
  DO UPDATE SET 
    quantity = carts.quantity + EXCLUDED.quantity,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- WISHLIST TABLE
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wishlist"
ON wishlist FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
