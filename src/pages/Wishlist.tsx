import { Link } from 'react-router-dom';
import { Heart, ChevronLeft, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const formatPrice = (price: number) => {
        return `Rs. ${price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/products">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">My Wishlist</h1>
                <Badge variant="secondary" className="text-lg px-3">
                    {wishlist.length} Items
                </Badge>
            </div>

            {wishlist.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-muted">
                    <Heart className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
                    <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Save items you love to find them easily later.
                    </p>
                    <Button asChild size="lg" className="gradient-primary">
                        <Link to="/products">Explore Products</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((product) => (
                        <Card key={product.id} className="group overflow-hidden border-0 shadow-product hover:shadow-product-hover transition-all duration-300">
                            <div className="relative aspect-square overflow-hidden bg-muted">
                                <img
                                    src={product.image_url || '/placeholder.svg'}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeFromWishlist(product.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                {product.stock_quantity <= 0 && (
                                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                                        <Badge variant="secondary">Out of Stock</Badge>
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-lg line-clamp-1 mb-1 hover:text-primary transition-colors">
                                    <Link to={`/product/${product.slug}`}>{product.name}</Link>
                                </h3>
                                <p className="text-primary font-bold text-xl mb-4">
                                    {formatPrice(product.price)}
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        asChild
                                    >
                                        <Link to={`/product/${product.slug}`}>View</Link>
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="w-full gradient-primary"
                                        onClick={() => addToCart(product)}
                                        disabled={product.stock_quantity <= 0}
                                    >
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Add
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
