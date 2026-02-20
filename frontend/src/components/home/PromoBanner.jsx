import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const PromoBanner = () => {
  return (
    <div className="py-16" data-aos="fade-up">
      <div className="relative overflow-hidden rounded-3xl bg-brandBlue">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brandBlue/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 md:p-16">
          <div className="text-center md:text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white text-xs font-bold tracking-wider mb-4 border border-white/20 backdrop-blur-sm">
                LIMITED OFFER This Weekend!
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Get <span className="text-gold">30% Off</span> On All Accessories
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto md:mx-0">
              Upgrade your setup with our premium collection of headphones, keyboards, and more.
            </p>
            <Link to="/deals">
              <button className="bg-white text-brandBlue font-extrabold px-8 py-4 rounded-full shadow-2xl hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-300 transform flex items-center gap-2 mx-auto md:mx-0">
                <span className="text-lg">Grab Deal Now</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </Link>
            <div className="mt-8 flex items-center justify-center md:justify-start gap-4 text-white/60 text-sm">
                <span>Free Shipping</span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span>30-Day Returns</span>
            </div>
          </div>
          
          <div className="relative hidden md:block h-64 md:h-96">
            <motion.img 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                src="https://pngimg.com/d/headphones_PNG101984.png" 
                alt="Headphones" 
                className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl filter brightness-110"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
