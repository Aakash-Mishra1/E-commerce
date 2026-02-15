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
              <Button variant="primary" className="bg-white text-blue-600 hover:bg-gray-100 border-none shadow-xl transform active:scale-95 transition-all">
                Grab Deal Now
              </Button>
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
