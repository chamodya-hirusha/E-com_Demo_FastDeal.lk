import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Package, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBanner, setShowBanner] = useState(true);
  const lastScrollY = useRef(0);
  const { totalItems, setIsOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - lastScrollY.current;

          const thresholdDown = 60;
          const thresholdUp = 30;

          if (currentScrollY <= 50) {
            setShowBanner(true);
          } else if (Math.abs(scrollDelta) > (scrollDelta > 0 ? thresholdDown : thresholdUp)) {
            if (currentScrollY > lastScrollY.current) {
              setShowBanner(false);
            } else {
              setShowBanner(true);
            }
            lastScrollY.current = currentScrollY;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg isolate transform-gpu will-change-transform">
      {/* Top banner */}
      <div
        className={`bg-accent text-center overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out ${showBanner ? 'max-h-12 opacity-100 py-1.5' : 'max-h-0 opacity-0 py-0'
          }`}
      >
        <p className="text-sm font-semibold text-accent-foreground">
          🎉 Special Friday Deals - Up to 50% OFF! Free Delivery on Orders Over Rs. 5,000
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary-foreground">
              Fast<span className="text-accent">Deal</span>.lk
            </h1>
          </Link>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-primary-foreground/20"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link to="/wishlist">
                <Heart className="h-6 w-6" />
                {wishlist.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </Button>
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="w-full cursor-pointer">
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="w-full cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="w-full cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      My Wishlist
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="w-full cursor-pointer font-semibold text-primary">
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">

                <Button
                  variant="secondary"
                  size="sm"
                  asChild
                  className="hidden sm:inline-flex"
                >
                  <Link to="/auth">Sign In</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full text-primary-foreground"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-primary-foreground/10 bg-primary">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link
              to="/products"
              className="block py-2 text-primary-foreground hover:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Products
            </Link>
            <Link
              to="/products?category=kitchen-items"
              className="block py-2 text-primary-foreground hover:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kitchen Items
            </Link>
            <Link
              to="/products?category=bags"
              className="block py-2 text-primary-foreground hover:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bags
            </Link>
            <Link
              to="/products?category=cctv-cameras"
              className="block py-2 text-primary-foreground hover:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              CCTV Cameras
            </Link>
            <Link
              to="/products?category=vacuum-cleaners"
              className="block py-2 text-primary-foreground hover:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Vacuum Cleaners
            </Link>
            <Link
              to="/wishlist"
              className="block py-2 text-primary-foreground hover:text-accent font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Wishlist ({wishlist.length})
            </Link>
            {!user && (
              <Link
                to="/auth"
                className="block py-2 text-accent font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </nav>
      )}

      {/* Category Navigation - Desktop */}
      <nav className="hidden md:block bg-primary border-t border-primary-foreground/10">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-6 py-2">
            <li>
              <Link
                to="/products"
                className="text-sm font-medium text-primary-foreground hover:text-accent transition-colors"
              >
                All Products
              </Link>
            </li>
            <li>
              <Link
                to="/products?category=kitchen-items"
                className="text-sm font-medium text-primary-foreground hover:text-accent transition-colors"
              >
                Kitchen Items
              </Link>
            </li>
            <li>
              <Link
                to="/products?category=bags"
                className="text-sm font-medium text-primary-foreground hover:text-accent transition-colors"
              >
                Bags
              </Link>
            </li>
            <li>
              <Link
                to="/products?category=cctv-cameras"
                className="text-sm font-medium text-primary-foreground hover:text-accent transition-colors"
              >
                CCTV Cameras
              </Link>
            </li>
            <li>
              <Link
                to="/products?category=vacuum-cleaners"
                className="text-sm font-medium text-primary-foreground hover:text-accent transition-colors"
              >
                Vacuum Cleaners
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;