import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order, CartItem } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface CreateOrderInput {
  items: CartItem[];
  shippingAddress: string;
  shippingCity: string;
  notes?: string;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
}

export const useOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(order => ({
        ...order,
        total_amount: Number(order.total_amount),
        order_items: order.order_items.map((item: { unit_price: string | number }) => ({
          ...item,
          unit_price: Number(item.unit_price),
        })),
      })) as Order[];
    },
    enabled: !!user,
  });
};

export const useCreateOrder = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const totalAmount = input.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          guest_email: input.guestEmail || null,
          guest_name: input.guestName || null,
          guest_phone: input.guestPhone || null,
          shipping_address: input.shippingAddress,
          shipping_city: input.shippingCity,
          total_amount: totalAmount,
          notes: input.notes || null,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = input.items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};