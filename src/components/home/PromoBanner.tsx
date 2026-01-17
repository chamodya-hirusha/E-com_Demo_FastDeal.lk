import { Link } from 'react-router-dom';
import { Truck, RotateCcw, Shield, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'On orders over Rs. 5,000',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '7-day return policy',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure checkout',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated support team',
  },
];

const PromoBanner = () => {
  return (
    <section className="py-6 md:py-8 bg-card border-y">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-center gap-2 md:gap-4">
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-xs md:text-sm truncate">{feature.title}</h3>
                <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;