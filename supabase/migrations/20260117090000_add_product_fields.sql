-- Add facebook_post_link column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS facebook_post_link TEXT;

-- Add product_status column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_status TEXT DEFAULT 'active' CHECK (product_status IN ('active', 'inactive'));

-- Add product_images column to store multiple images (JSON array)
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_images JSONB DEFAULT '[]'::jsonb;

-- Update existing products to have default status
UPDATE products SET product_status = 'active' WHERE product_status IS NULL;
