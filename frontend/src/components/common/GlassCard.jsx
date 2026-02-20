import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", hoverEffect = false, ...props }) => {
  return (
    <motion.div
        {...props}
        whileHover={hoverEffect ? { y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" } : {}}
        className={`backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-2xl shadow-soft ${className}`}
    >
        {children}
    </motion.div>
  );
};

export default GlassCard;