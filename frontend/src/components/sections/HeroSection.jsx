import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 md:px-20 relative">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Left Content */}
        <div className="order-2 md:order-1">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-cyber-neon font-mono text-lg mb-4 text-glow tracking-widest">
              Hi, I'm
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-poppins leading-tight">
              Developer <span className="text-gray-500">Name</span>
            </h1>
            <h3 className="text-2xl md:text-3xl text-gray-400 mb-8 font-mono">
              <span className="text-cyber-neon">&lt;</span>
              Full Stack Developer
              <span className="text-cyber-neon">/&gt;</span>
            </h3>
            <p className="text-gray-400 text-lg max-w-xl mb-10 leading-relaxed">
              I build exceptional digital experiences. Currently, I'm focused on accessible, human-centered products at <span className="text-cyber-neon border-b border-cyber-neon/30">Company</span>.
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => document.getElementById('projects').scrollIntoView()}>
                View Work
              </Button>
              <Button size="lg" className="border-white text-white hover:bg-white/10">
                Contact Me
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Right Content (Floating Glass Card) */}
        <div className="order-1 md:order-2 flex justify-center relative">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative z-10 w-80 h-80 md:w-96 md:h-96"
          >
             {/* Abstract Code Block Visual */}
             <div className="glass-panel w-full h-full rounded-2xl p-6 flex items-center justify-center border-2 border-white/5 relative overflow-hidden bg-cyber-dark1/50">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-neon to-transparent opacity-50"></div>
                
                <div className="font-mono text-sm text-gray-500 w-full">
                  <div className="mb-2"><span className="text-brandBlue">const</span> developer = <span className="text-yellow-400">{"{"}</span></div>
                  <div className="pl-4 mb-1">name: <span className="text-green-400">"Your Name"</span>,</div>
                  <div className="pl-4 mb-1">skills: [<span className="text-green-400">"React"</span>, <span className="text-green-400">"Node"</span>],</div>
                  <div className="pl-4 mb-1">hardWorker: <span className="text-blue-400">true</span>,</div>
                  <div className="pl-4 mb-1">problemSolver: <span className="text-blue-400">true</span>,</div>
                  <div className="pl-4 mb-1">hireable: <span className="text-red-400 hover:text-red-300 cursor-pointer animate-pulse">function()</span></div>
                  <div><span className="text-yellow-400">{"}"}</span>;</div>
                </div>

                {/* Glow behind */}
                <div className="absolute -z-10 bg-cyber-neon/20 w-40 h-40 blur-[80px] rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;