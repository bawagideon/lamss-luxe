-- Products (admin adds/edits these)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,  -- e.g., 120.00
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  category TEXT,  -- 'dresses', 'two-piece', 'tops', 'premium'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders (created on checkout start, updated on webhook)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),  -- optional if guest checkout
  stripe_session_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'shipped', 'cancelled')),
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,  -- store full address from Stripe
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items (line items per order)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10,2) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read
CREATE POLICY "Public profiles are viewable by everyone."
ON products FOR SELECT USING (true);

-- Orders: Authenticated users can read their own (or allow service role full access)
CREATE POLICY "Users can view their own orders."
ON orders FOR SELECT USING (auth.uid() = user_id);

-- Seed a few test products
INSERT INTO products (name, description, price, image_url, stock, category)
VALUES 
  ('The Soft Life Slip Dress', 'Silky smooth, perfect for queens. Curated elegance for the modern woman.', 120.00, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop', 50, 'dresses'),
  ('Midnight Silk Two-Piece', 'Bold and empowering. A statement piece designed to turn heads.', 145.00, 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=800&auto=format&fit=crop', 30, 'two-piece'),
  ('Luxe Corset Top', 'Define your silhouette with this structured perfection.', 85.00, 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=800&auto=format&fit=crop', 40, 'tops');
