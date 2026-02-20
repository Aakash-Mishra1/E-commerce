import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const Banner = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-3xl mt-24 border border-white/5 mx-auto max-w-7xl">
      
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent"></div>
        
        <div className="absolute inset-0 mix-blend-overlay bg-blue-900/30"></div>
      </div>

     
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-softCyan font-medium tracking-wide uppercase mb-4"
        >
          Welcome to ShopVerse
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight max-w-3xl"
        >
          Elevate Your <br/>
          <span className="text-cyan-400 drop-shadow-lg">Digital Lifestyle</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white text-lg mb-8 max-w-lg font-medium drop-shadow-md"
        >
          Your one-stop destination for everything you love. Shop the latest trends, discover unbeatable deals, and experience seamless shopping delivered to your doorstep.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <Link to="/login">
             <Button size="lg" variant="primary">Shop Now</Button>
          </Link>
          <Link to="/shop?category=Gaming">
             <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white/10">View Details</Button>
          </Link>
        </motion.div>
      </div>

      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-brandBlue/20 blur-[100px] rounded-full pointer-events-none"></div>
    </div>
  );
};

export default Banner;
