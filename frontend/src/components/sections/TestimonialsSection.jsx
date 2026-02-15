import React, { useState } from 'react';
import SectionTitle from '../common/SectionTitle';
import GlassCard from '../common/GlassCard';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

const TestimonialsSection = () => {
  const testimonials = [
    {
        name: "John Doe",
        role: "CEO, TechStart",
        text: "One of the best developers I've worked with. Delivered the project on time and exceeded expectations."
    },
    {
        name: "Jane Smith",
        role: "Product Manager, Innovate",
        text: "Their attention to detail and ability to translate complex requirements into user-friendly interfaces is unmatched."
    },
    {
        name: "Mike Johnson",
        role: "Founder, CreativeStudio",
        text: "A true professional. Excellent communication skills and top-notch technical expertise."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 px-4 md:px-20 max-w-4xl mx-auto">
      <SectionTitle label="07. Testimonials" title="What People Say" />
      
      <div className="relative">
        <div className="overflow-hidden">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                >
                    <GlassCard className="text-center py-10 px-8">
                       <div className="flex justify-center gap-1 mb-6 text-yellow-400">
                           {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5"/>)}
                       </div>
                       <p className="text-xl md:text-2xl text-gray-200 italic font-inter leading-relaxed mb-6">"{testimonials[currentIndex].text}"</p>
                       <div>
                           <h4 className="font-bold text-white font-poppins">{testimonials[currentIndex].name}</h4>
                           <span className="text-cyber-neon font-mono text-sm">{testimonials[currentIndex].role}</span>
                       </div>
                    </GlassCard>
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Arrows */}
        <button 
            onClick={prevTestimonial}
            className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-cyber-neon/20 hover:text-cyber-neon transition-all duration-300"
        >
            <ChevronLeftIcon className="w-6 h-6 text-gray-300" />
        </button>
        <button 
            onClick={nextTestimonial}
            className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-cyber-neon/20 hover:text-cyber-neon transition-all duration-300"
        >
            <ChevronRightIcon className="w-6 h-6 text-gray-300" />
        </button>

         <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-cyber-neon w-6' : 'bg-gray-600'}`}
                />
            ))}
         </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;