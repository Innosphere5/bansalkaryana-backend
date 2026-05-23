-- Create Products Table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    mrp DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock_quantity INTEGER DEFAULT 0,
    unit TEXT,
    image_url TEXT,
    cloudinary_public_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to auto-update updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Common Categories
INSERT INTO categories (name) VALUES 
('Rice'),
('Flours'),
('Dals & Pulses'),
('Edible Oils'),
('Spices & Masalas'),
('Coffee & Tea'),
('Shampoo'),
('Soap'),
('Detergent'),
('Soft Drink'),
('Refined Oil'),
('Cleaning Needs')
ON CONFLICT (name) DO NOTHING;

-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    items JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-update orders.updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- RLS Policies for Orders Table
-- ============================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read orders
CREATE POLICY "Allow public read on orders"
ON orders FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anyone to insert orders
CREATE POLICY "Allow public insert on orders"
ON orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to update orders
CREATE POLICY "Allow public update on orders"
ON orders FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Allow anyone to delete orders
CREATE POLICY "Allow public delete on orders"
ON orders FOR DELETE
TO anon, authenticated
USING (true);

-- ============================================
-- RLS Policies for Products Table
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on products"
ON products FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow public insert on products"
ON products FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public update on products"
ON products FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete on products"
ON products FOR DELETE
TO anon, authenticated
USING (true);

-- ============================================
-- RLS Policies for Categories Table
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on categories"
ON categories FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow public insert on categories"
ON categories FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public update on categories"
ON categories FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete on categories"
ON categories FOR DELETE
TO anon, authenticated
USING (true);
