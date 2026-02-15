import React from 'react';

const SectionTitle = ({ label, title }) => {
  return (
    <div className="mb-12 text-center" data-aos="fade-up">
      {label && (
        <span className="block text-cyber-neon font-mono text-sm tracking-widest mb-2 uppercase text-glow">
          {label}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl font-bold text-white font-poppins relative inline-block">
        {title}
        <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-neon to-transparent opacity-70"></span>
      </h2>
    </div>
  );
};

export default SectionTitle;