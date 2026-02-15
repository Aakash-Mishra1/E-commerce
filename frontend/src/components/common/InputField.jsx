import React from 'react';

const InputField = ({ type = "text", placeholder, onChange, value, className = "" }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={`w-full bg-transparent border-b-2 border-white/20 p-3 text-white font-mono placeholder-gray-500 focus:outline-none focus:border-cyber-neon focus:shadow-[0_4px_10px_-4px_#00BFFF] transition-all duration-300 ${className}`}
    />
  );
};

export default InputField;