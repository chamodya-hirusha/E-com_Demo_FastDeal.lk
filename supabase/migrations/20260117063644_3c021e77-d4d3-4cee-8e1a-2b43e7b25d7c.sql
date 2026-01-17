-- Create enums
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email TEXT,
  guest_name TEXT,
  guest_phone TEXT,
  status order_status NOT NULL DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles (admin only management)
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert roles" ON public.user_roles
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update roles" ON public.user_roles
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete roles" ON public.user_roles
  FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert categories" ON public.categories
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update categories" ON public.categories
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete categories" ON public.categories
  FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for products (public read active products, admin write)
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (active = true OR public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert products" ON public.products
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update products" ON public.products
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete products" ON public.products
  FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete orders" ON public.orders
  FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for order_items
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );

CREATE POLICY "Anyone can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can update order items" ON public.order_items
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete order items" ON public.order_items
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_featured ON public.products(featured) WHERE featured = true;
CREATE INDEX idx_products_active ON public.products(active) WHERE active = true;
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- Insert sample categories
INSERT INTO public.categories (name, slug, description, image_url) VALUES
  ('Kitchen Items', 'kitchen-items', 'High-quality kitchen appliances and accessories', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'),
  ('Bags', 'bags', 'Stylish and durable bags for every occasion', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'),
  ('CCTV Cameras', 'cctv-cameras', 'Security cameras for home and business', 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400'),
  ('Vacuum Cleaners', 'vacuum-cleaners', 'Powerful vacuum cleaners for spotless cleaning', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400');

-- Insert sample products
INSERT INTO public.products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, featured) 
SELECT 
  c.id,
  'Electric Kettle 1.5L',
  'electric-kettle-1-5l',
  'Fast boiling stainless steel electric kettle with auto shut-off',
  2499.00,
  2999.00,
  50,
  'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80',
  true
FROM public.categories c WHERE c.slug = 'kitchen-items';

INSERT INTO public.products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, featured)
SELECT 
  c.id,
  'Non-Stick Frying Pan',
  'non-stick-frying-pan',
  'Premium non-stick coating frying pan 28cm',
  1899.00,
  2499.00,
  30,
  'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400',
  false
FROM public.categories c WHERE c.slug = 'kitchen-items';

INSERT INTO public.products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, featured)
SELECT 
  c.id,
  'Leather Laptop Bag',
  'leather-laptop-bag',
  'Premium leather bag fits up to 15.6 inch laptops',
  4999.00,
  6499.00,
  25,
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
  true
FROM public.categories c WHERE c.slug = 'bags';

INSERT INTO public.products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, featured)
SELECT 
  c.id,
  'Travel Backpack 40L',
  'travel-backpack-40l',
  'Waterproof travel backpack with multiple compartments',
  3499.00,
  4299.00,
  40,
  'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=400',
  false
FROM public.categories c WHERE c.slug = 'bags';

INSERT INTO public.products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, featured)
SELECT 
  c.id,
  'HD WiFi Security Camera',
  'hd-wifi-security-camera',
  '1080p HD camera with night vision and motion detection',
  5999.00,
  7999.00,
  35,
  'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400',
  true
FROM public.categories c WHERE c.slug = 'cctv-cameras';

INSERT INTO public.products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, featured)
SELECT 
  c.id,
  '4K PTZ Camera System',
  '4k-ptz-camera-system',
  'Professional 4K camera with pan-tilt-zoom and 360° coverage',
  12999.00,
  15999.00,
  15,
  'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400',
  false
FROM public.categories c WHERE c.slug = 'cctv-cameras';

INSERT INTO public.products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, featured)
SELECT 
  c.id,
  'Cordless Vacuum Cleaner',
  'cordless-vacuum-cleaner',
  'Powerful cordless vacuum with 45 min battery life',
  8999.00,
  11999.00,
  20,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  true
FROM public.categories c WHERE c.slug = 'vacuum-cleaners';

INSERT INTO public.products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, featured)
SELECT 
  c.id,
  'Robot Vacuum Cleaner',
  'robot-vacuum-cleaner',
  'Smart robot vacuum with app control and auto-charging',
  15999.00,
  19999.00,
  12,
  'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400',
  false
FROM public.categories c WHERE c.slug = 'vacuum-cleaners';