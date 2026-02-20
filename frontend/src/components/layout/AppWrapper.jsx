import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const AppWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-brandBlue selection:text-white">
      <Navbar />

      <main className="flex-grow relative overflow-hidden">
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brandBlue/5 blur-[100px]"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-softCyan/5 blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 w-full">
            {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppWrapper;