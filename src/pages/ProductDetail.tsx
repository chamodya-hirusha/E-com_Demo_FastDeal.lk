import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ChevronLeft, Truck, Shield, RotateCcw, Share2, MessageCircle, Heart } from 'lucide-react';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ProductGrid from '@/components/products/ProductGrid';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug || '');
  const { data: relatedProducts } = useProducts(product?.category?.slug);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
  };

  if (isLoading) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/products">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </>
    );
  }

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} - ${formatPrice(product.price)}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Product link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleWhatsAppContact = () => {
    const whatsappNumber = '94771234567'; // Replace with your actual WhatsApp number
    const message = encodeURIComponent(
      `Hi! I'm interested in ${product.name}\nPrice: ${formatPrice(product.price)}\nLink: ${window.location.href}`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const related = relatedProducts
    ?.filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground mb-4 md:mb-8 overflow-x-auto scrollbar-hide whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-primary flex-shrink-0">Home</Link>
          <span className="flex-shrink-0">/</span>
          <Link to="/products" className="hover:text-primary flex-shrink-0">Products</Link>
          {product.category && (
            <>
              <span className="flex-shrink-0">/</span>
              <Link
                to={`/products?category=${product.category.slug}`}
                className="hover:text-primary flex-shrink-0"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span className="flex-shrink-0">/</span>
          <span className="text-foreground truncate max-w-[150px] md:max-w-none">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-xl bg-muted">
              <img
                src={product.image_url || '/placeholder.svg'}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <Badge className="bg-destructive text-destructive-foreground font-bold text-lg px-3 py-1">
                  -{discountPercentage}% OFF
                </Badge>
              )}
              {product.featured && (
                <Badge className="bg-accent text-accent-foreground font-bold">
                  🔥 Hot Deal
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">{product.name}</h1>

            {product.category && (
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">{product.category.name}</p>
            )}

            {/* Share and Contact Buttons */}
            <div className="flex gap-2 md:gap-3 mb-4 md:mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex-1 md:flex-none border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/20"
              >
                <Share2 className="h-4 w-4 md:mr-2 text-blue-600 dark:text-blue-400" />
                <span className="hidden md:inline">Share</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleWhatsAppContact}
                className="flex-1 md:flex-none border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950/20"
              >
                <MessageCircle className="h-4 w-4 md:mr-2 text-green-600 dark:text-green-400" />
                <span className="hidden md:inline">Contact Seller</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={`flex-1 md:flex-none border-pink-200 hover:bg-pink-50 dark:border-pink-800 dark:hover:bg-pink-950/20 ${isInWishlist(product.id) ? 'text-destructive bg-pink-50' : ''
                  }`}
              >
                <Heart className={`h-4 w-4 md:mr-2 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                <span className="hidden md:inline">
                  {isInWishlist(product.id) ? 'Wishlisted' : 'Add to Wishlist'}
                </span>
              </Button>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <span className="text-2xl md:text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-base md:text-xl text-muted-foreground line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
              {discountPercentage > 0 && (
                <Badge variant="secondary" className="text-xs md:text-sm text-success font-semibold">
                  Save {formatPrice(product.original_price! - product.price)}
                </Badge>
              )}
            </div>

            {/* Koko Option */}
            <div className="bg-success/5 border border-success/20 rounded-lg p-2.5 md:p-3 mb-3 md:mb-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs md:text-sm font-medium text-foreground">Pay in 3 interest-free installments</span>
                <span className="text-base md:text-lg font-bold text-success">
                  {formatPrice(product.price / 3)}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Available with</span>
                <img src="/koko-logo.png" alt="Koko" className="h-5 md:h-6 w-auto" />
              </div>
            </div>

            {/* Mint Pay Option */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-2.5 md:p-3 mb-4 md:mb-6 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs md:text-sm font-medium text-foreground">Pay in 4 interest-free installments</span>
                <span className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(product.price / 4)}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Available with</span>
                <img src="/image.webp" alt="Mint Pay" className="h-5 md:h-6 w-auto" />
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-4 md:mb-6">
              {isOutOfStock ? (
                <Badge variant="destructive" className="text-xs md:text-sm">Out of Stock</Badge>
              ) : product.stock_quantity < 10 ? (
                <Badge variant="secondary" className="text-xs md:text-sm text-accent-foreground bg-accent/20">
                  Only {product.stock_quantity} left in stock!
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs md:text-sm text-success bg-success/10">
                  In Stock
                </Badge>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-4 md:mb-6">
                <h3 className="text-sm md:text-base font-semibold mb-2">Description</h3>
                <p className="text-sm md:text-base text-muted-foreground">{product.description}</p>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {/* Quantity Selector */}
              <div className="flex items-center justify-center md:justify-start">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() =>
                      setQuantity(Math.min(product.stock_quantity, quantity + 1))
                    }
                    disabled={isOutOfStock || quantity >= product.stock_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <Button
                  className="w-full md:flex-1 gradient-primary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>

                <Button
                  className="w-full md:flex-1 bg-foreground text-background hover:bg-foreground/90 font-bold"
                  size="lg"
                  onClick={() => {
                    addToCart(product, quantity);
                    navigate('/checkout');
                  }}
                  disabled={isOutOfStock}
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm">Free Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-sm">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related && related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </>
  );
};

export default ProductDetail;