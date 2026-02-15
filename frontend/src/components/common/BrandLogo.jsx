import React from 'react';

const BrandLogo = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="simpleGrad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4FC3F7" />
          <stop offset="1" stopColor="#1A73E8" />
        </linearGradient>
      </defs>
      
      {/* Handle */}
      <path 
        d="M9 8V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V8" 
        stroke="url(#simpleGrad)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Bag Body - Simple Rounded Rect */}
      <rect 
        x="5" 
        y="8" 
        width="14" 
        height="13" 
        rx="3" 
        fill="url(#simpleGrad)" 
      />
      
      {/* Simple 'V' cut-out for Verse */}
      <path 
        d="M9.5 13L12 16L14.5 13" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BrandLogo;
