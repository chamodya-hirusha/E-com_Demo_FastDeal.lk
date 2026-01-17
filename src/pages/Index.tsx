import HeroBanner from '@/components/home/HeroBanner';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoBanner from '@/components/home/PromoBanner';

const Index = () => {
  return (
    <>
      <HeroBanner />
      <PromoBanner />
      <CategorySection />
      <FeaturedProducts />
    </>
  );
};

export default Index;