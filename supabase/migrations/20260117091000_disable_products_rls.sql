-- Disable RLS on products table for admin operations
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Or alternatively, create a policy that allows all operations
-- This is useful for demo/development purposes
DROP POLICY IF EXISTS "Allow all operations on products" ON products;

CREATE POLICY "Allow all operations on products"
ON products
FOR ALL
USING (true)
WITH CHECK (true);

-- Enable RLS (if you want to use the policy above)
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
