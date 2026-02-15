import React from 'react';
import SectionTitle from '../common/SectionTitle';
import GlassCard from '../common/GlassCard';
import { DevicePhoneMobileIcon, CodeBracketIcon, SparklesIcon } from '@heroicons/react/24/outline';

const ServicesSection = () => {
    const services = [
        {
             title: "UI/UX Design",
             icon: <SparklesIcon className="w-10 h-10"/>,
             desc: "Designing intuitive, accessible, and beautiful user interfaces with a focus on user experience."
        },
        {
             title: "Web Development",
             icon: <CodeBracketIcon className="w-10 h-10"/>,
             desc: "Building fast, responsive, and scalable websites using modern technologies like React & Tailwind."
        },
        {
             title: "Backend Development",
             icon: <DevicePhoneMobileIcon className="w-10 h-10"/>,
             desc: "Creating robust APIs and server-side logic to power your applications securely."
        }
    ];

  return (
    <section id="services" className="py-20 px-4 md:px-20 max-w-7xl mx-auto">
      <SectionTitle label="04. Services" title="What I Can Do" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
            <GlassCard key={index} className="text-center group hover:bg-white/5" title={service.title} icon={service.icon}>
                <p className="text-gray-400 text-sm font-inter leading-relaxed">{service.desc}</p>
            </GlassCard>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;