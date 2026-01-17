import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isFavorite = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
  };

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <Card className="group overflow-hidden shadow-product hover:shadow-product-hover transition-all duration-300 border-0">
      <Link to={`/product/${product.slug}`} className="block md:contents">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1 z-10">
            {discountPercentage > 0 && (
              <Badge className="bg-destructive text-destructive-foreground font-bold text-xs md:text-sm">
                -{discountPercentage}%
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-accent text-accent-foreground font-bold text-xs md:text-sm">
                Hot Deal
              </Badge>
            )}
          </div>

          {/* Wishlist Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all ${isFavorite ? 'text-destructive' : 'text-muted-foreground'
              }`}
            onClick={toggleWishlist}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <Badge variant="secondary" className="text-sm md:text-base font-semibold">
                Out of Stock
              </Badge>
            </div>
          )}

          {/* Quick actions overlay - Desktop only */}
          <div className="hidden md:flex absolute inset-0 items-center justify-center gap-2 bg-foreground/60 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10"
              asChild
            >
              <Link to={`/product/${product.slug}`}>
                <Eye className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="icon"
              className="h-10 w-10 gradient-primary"
              onClick={(e) => {
                e.preventDefault();
                if (!isOutOfStock) addToCart(product);
              }}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <CardContent className="p-3 md:p-4">
          <h3 className="font-medium text-sm md:text-base line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>

          {product.category && (
            <p className="text-xs text-muted-foreground mt-1">
              {product.category.name}
            </p>
          )}

          <div className="mt-2 md:mt-3 flex items-center gap-2 flex-wrap">
            <span className="font-bold text-base md:text-lg text-primary">
              {formatPrice(product.price)}
            </span>
            {product.original_price && (
              <span className="text-xs md:text-sm text-muted-foreground line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
        </CardContent>
      </Link>

      {/* Add to Cart button - Desktop only */}
      <CardContent className="hidden md:block p-4 pt-0">
        <Button
          className="w-full gradient-primary"
          size="sm"
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;