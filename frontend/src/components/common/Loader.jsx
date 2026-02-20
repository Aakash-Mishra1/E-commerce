import React from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <div className="relative">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           className="w-16 h-16 rounded-full border-4 border-t-brandBlue border-r-transparent border-b-brandBlue border-l-transparent absolute inset-0"
        />
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 relative z-10">
           <ShoppingBagIcon className="w-8 h-8 text-brandBlue animate-pulse" />
        </div>
      </div>
      <p className="text-gray-400 font-poppins text-sm animate-pulse tracking-wider">{text}</p>
    </div>
  );
};

export default Loader;