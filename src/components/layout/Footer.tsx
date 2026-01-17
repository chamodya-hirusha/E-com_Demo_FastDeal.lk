import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background border-t border-background/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-2xl font-bold mb-4">
              Fast<span className="text-accent">Deal</span>.lk
            </h2>
            <p className="text-background/70 mb-6 max-w-xs md:max-w-none">
              Your trusted online store for quality products at the best prices.
              Fast delivery across Sri Lanka.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background/10 p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background/10 p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background/10 p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-background/70 hover:text-accent transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=kitchen-items" className="text-background/70 hover:text-accent transition-colors">
                  Kitchen Items
                </Link>
              </li>
              <li>
                <Link to="/products?category=bags" className="text-background/70 hover:text-accent transition-colors">
                  Bags
                </Link>
              </li>
              <li>
                <Link to="/products?category=cctv-cameras" className="text-background/70 hover:text-accent transition-colors">
                  CCTV Cameras
                </Link>
              </li>
              <li>
                <Link to="/products?category=vacuum-cleaners" className="text-background/70 hover:text-accent transition-colors">
                  Vacuum Cleaners
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4 text-accent">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/auth" className="text-background/70 hover:text-accent transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-background/70 hover:text-accent transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-accent transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-accent transition-colors">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-accent transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <Link to="/admin" className="text-background/70 hover:text-accent transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4 text-accent">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-accent" />
                </div>
                <span className="text-background/70">+94 77 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-accent" />
                </div>
                <span className="text-background/70">info@fastdeal.lk</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center mt-1">
                  <MapPin className="h-4 w-4 text-accent" />
                </div>
                <span className="text-background/70">
                  123 Main Street,<br />
                  Colombo 03, Sri Lanka
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} FastDeal.lk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;