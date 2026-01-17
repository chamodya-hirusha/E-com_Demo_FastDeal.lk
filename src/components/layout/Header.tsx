import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [demoCredentials, setDemoCredentials] = useState({ username: '', password: '' });
  const [showBanner, setShowBanner] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { totalItems, setIsOpen } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Always show banner at the top
        setShowBanner(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide banner
        setShowBanner(false);
      } else {
        // Scrolling up - show banner
        setShowBanner(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleAdminLogin = async () => {
    const DEMO_EMAIL = 'demouser@admin.com';
    const DEMO_PASSWORD = 'user12345';

    try {
      // Try to sign in with demo credentials
      let { data, error } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });

      // If account doesn't exist, create it
      if (error && error.message.includes('Invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD,
        });

        if (!signUpError && signUpData.user) {
          // Add admin role
          await supabase.from('user_roles').insert([{ user_id: signUpData.user.id, role: 'admin' }]);
        }
      }

      toast.success('Logging in as admin...');
      setAdminLoginOpen(false);
      // Force reload to apply admin privileges
      window.location.href = '/admin/dashboard';
    } catch (e) {
      console.error('Login error:', e);
      toast.error('Login failed');
    }
  };

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
    <header className="sticky top-0 z-50 bg-primary shadow-lg">
      {/* Top banner */}
      <div
        className={`bg-accent text-center overflow-hidden transition-all duration-300 ${showBanner ? 'py-1.5 opacity-100' : 'py-0 opacity-0 h-0'
          }`}
      >
        <p className="text-sm font-semibold text-accent-foreground animate-pulse-deal">
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
          <div className="flex items-center gap-2">
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
                <Dialog open={adminLoginOpen} onOpenChange={setAdminLoginOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden sm:inline-flex bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-transparent hover:border-primary-foreground/60"
                    >
                      Admin Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Admin Login</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-username">Username</Label>
                        <Input
                          id="admin-username"
                          placeholder="demouser"
                          value={demoCredentials.username}
                          onChange={(e) => setDemoCredentials({ ...demoCredentials, username: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-password">Password</Label>
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="user12345"
                          value={demoCredentials.password}
                          onChange={(e) => setDemoCredentials({ ...demoCredentials, password: e.target.value })}
                        />
                      </div>
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        <p className="font-semibold mb-1">Demo Credentials:</p>
                        <p>Username: <code className="bg-background px-2 py-1 rounded">demouser</code></p>
                        <p>Password: <code className="bg-background px-2 py-1 rounded">user12345</code></p>
                      </div>
                      <Button onClick={handleAdminLogin} className="w-full gradient-primary">
                        Login
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
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
      <nav className="hidden md:block bg-primary/90 border-t border-primary-foreground/10">
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