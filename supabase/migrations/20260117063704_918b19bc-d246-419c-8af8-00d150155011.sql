-- Fix permissive RLS policies for orders and order_items
-- Drop the overly permissive INSERT policies
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;

-- Create proper INSERT policies
-- For orders: authenticated users can create orders for themselves, or guest orders (no user_id)
CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (
    user_id IS NULL OR auth.uid() = user_id
  );

-- For order_items: only allow insertion if the order belongs to the current user or is a guest order
CREATE POLICY "Users can insert order items for their orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id IS NULL OR orders.user_id = auth.uid())
    )
  );