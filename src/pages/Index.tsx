import Layout from '@/components/layout/Layout';
import HeroBanner from '@/components/home/HeroBanner';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoBanner from '@/components/home/PromoBanner';

const Index = () => {
  return (
    <Layout>
      <HeroBanner />
      <PromoBanner />
      <CategorySection />
      <FeaturedProducts />
    </Layout>
  );
};

export default Index;