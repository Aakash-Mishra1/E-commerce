import React from 'react';

const InputField = ({ type = "text", placeholder, label, onChange, value, className = "", required = false }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-gray-400 text-sm font-medium mb-2 ml-1">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        required={required}
        className={`w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brandBlue focus:ring-1 focus:ring-brandBlue transition-all ${className}`}
      />
    </div>
  );
};

export default InputField;