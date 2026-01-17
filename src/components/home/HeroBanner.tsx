import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className="text-center md:text-left">
            <div className="inline-block mb-3 md:mb-4">
              <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-accent text-accent-foreground font-bold text-xs md:text-sm">
                🔥 Friday Special Deals
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground mb-4 md:mb-6 leading-tight">
              Up to <span className="text-accent">50% OFF</span> on All Products
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-primary-foreground/80 mb-6 md:mb-8 max-w-lg mx-auto md:mx-0">
              Shop the best deals on Kitchen Items, Bags, CCTV Cameras, Vacuum Cleaners and more.
              Free delivery on orders over Rs. 5,000!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base md:text-lg px-6 md:px-8"
                asChild
              >
                <Link to="/products">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 font-semibold"
                asChild
              >
                <Link to="/products?featured=true">View Deals</Link>
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 text-primary-foreground">
              <Truck className="h-8 w-8 lg:h-10 lg:w-10 text-accent mb-3 lg:mb-4" />
              <h3 className="font-semibold text-base lg:text-lg mb-2">Free Delivery</h3>
              <p className="text-xs lg:text-sm text-primary-foreground/70">
                On orders over Rs. 5,000 across Sri Lanka
              </p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 text-primary-foreground">
              <Shield className="h-8 w-8 lg:h-10 lg:w-10 text-accent mb-3 lg:mb-4" />
              <h3 className="font-semibold text-base lg:text-lg mb-2">Secure Payment</h3>
              <p className="text-xs lg:text-sm text-primary-foreground/70">
                100% secure online payment
              </p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 text-primary-foreground">
              <Clock className="h-8 w-8 lg:h-10 lg:w-10 text-accent mb-3 lg:mb-4" />
              <h3 className="font-semibold text-base lg:text-lg mb-2">24/7 Support</h3>
              <p className="text-xs lg:text-sm text-primary-foreground/70">
                Dedicated support anytime
              </p>
            </div>
            <div className="bg-accent/20 backdrop-blur-sm rounded-xl p-4 lg:p-6 text-primary-foreground border-2 border-accent">
              <span className="text-3xl lg:text-4xl font-bold text-accent">50%</span>
              <h3 className="font-semibold text-base lg:text-lg mb-2">OFF Today</h3>
              <p className="text-xs lg:text-sm text-primary-foreground/70">
                Limited time offer!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;