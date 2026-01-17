-- Quick Fix for RLS Error on Products Table
-- Run this SQL in your Supabase SQL Editor

-- Option 1: Completely disable RLS (simplest for demo/development)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS enabled but allow all operations
-- Uncomment the lines below instead of using Option 1

-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- 
-- DROP POLICY IF EXISTS "Allow all operations on products" ON products;
-- 
-- CREATE POLICY "Allow all operations on products"
-- ON products
-- FOR ALL
-- USING (true)
-- WITH CHECK (true);

-- After running this, you should be able to add products without errors!
