import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant = 'primary', size = 'sm', className = "", ...props }) => {
  const sizeClasses = size === 'lg' ? 'px-8 py-3 text-lg' : 'px-5 py-2';
  
  const variants = {
    primary: "bg-brandBlue text-white hover:bg-blue-600 shadow-lg shadow-brandBlue/30",
    secondary: "bg-transparent text-brandBlue border border-brandBlue hover:bg-brandBlue/10",
    success: "bg-successGreen text-white hover:bg-green-600 shadow-lg shadow-green-500/30",
    danger: "bg-saleRed text-white hover:bg-red-600 shadow-lg shadow-red-500/30"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2 ${variants[variant] || variants.primary} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;