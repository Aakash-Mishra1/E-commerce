import React from 'react';
import { TruckIcon, ShieldCheckIcon, CurrencyDollarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import GlassCard from '../common/GlassCard';

const ServiceFeatures = () => {
  const features = [
    {
      icon: <TruckIcon className="w-8 h-8"/>,
      title: "Free Shipping",
      desc: "On all orders over $99"
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8"/>,
      title: "Secure Payment",
      desc: "100% secure payment"
    },
    {
      icon: <CurrencyDollarIcon className="w-8 h-8"/>,
      title: "Money Back",
      desc: "30 days guarantee"
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-8 h-8"/>,
      title: "24/7 Support",
      desc: "Dedicated support"
    }
  ];

  return (
    <div className="py-12" data-aos="fade-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <GlassCard key={index} className="flex flex-col items-center text-center p-6 group hover:bg-white/5 transition-all duration-300 border-none">
            <div className="mb-4 text-brandBlue group-hover:scale-110 transition-transform duration-300 bg-brandBlue/10 p-3 rounded-full">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-poppins">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default ServiceFeatures;
