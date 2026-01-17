import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, Category } from '@/types';

export const useProducts = (categorySlug?: string) => {
  return useQuery({
    queryKey: ['products', categorySlug],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (categorySlug) {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single();
        
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        price: Number(item.price),
        original_price: item.original_price ? Number(item.original_price) : null,
        images: item.images || [],
      })) as Product[];
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('active', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        price: Number(item.price),
        original_price: item.original_price ? Number(item.original_price) : null,
        images: item.images || [],
      })) as Product[];
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        price: Number(data.price),
        original_price: data.original_price ? Number(data.original_price) : null,
        images: data.images || [],
      } as Product;
    },
    enabled: !!slug,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return data as Category[];
    },
  });
};