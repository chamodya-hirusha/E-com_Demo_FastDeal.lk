import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeaturedProducts } from '@/hooks/useProducts';
import ProductGrid from '@/components/products/ProductGrid';

const FeaturedProducts = () => {
  const { data: products, isLoading } = useFeaturedProducts();

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-destructive text-destructive-foreground text-[10px] md:text-xs font-bold animate-pulse">
                HOT DEALS
              </span>
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">Featured Products</h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Don't miss out on these amazing deals!
            </p>
          </div>
          <Button variant="outline" size="sm" className="w-full md:w-auto text-xs md:text-sm" asChild>
            <Link to="/products?featured=true">
              View All Deals <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
            </Link>
          </Button>
        </div>

        <ProductGrid products={products || []} isLoading={isLoading} />
      </div>
    </section>
  );
};

export default FeaturedProducts;