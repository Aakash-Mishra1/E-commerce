import React, { useEffect } from 'react';
import AppWrapper from '../components/layout/AppWrapper';
import Banner from '../components/home/Banner';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedProducts from '../components/home/FeaturedProducts';
import PromoBanner from '../components/home/PromoBanner';
import ServiceFeatures from '../components/home/ServiceFeatures';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AppWrapper>
      {/* Background Image Overlay */}
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.25,
          zIndex: -1
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">
        <Banner />
        <ServiceFeatures />
        <CategoryGrid />
        
        {/* Amazon-style Product Rows */}
        <FeaturedProducts title="Best Sellers" category={null} />
        <PromoBanner />
        <FeaturedProducts title="Top Audio Gear" category="Audio" />
        <FeaturedProducts title="Pro Gaming Setup" category="Gaming" />
      </div>
    </AppWrapper>
  );
};

export default Home;