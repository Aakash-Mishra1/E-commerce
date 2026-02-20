import React from 'react';
import SectionTitle from '../common/SectionTitle';
import GlassCard from '../common/GlassCard';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4 md:px-20 max-w-7xl mx-auto">
      <SectionTitle label="01. About Me" title="Know Who I Am" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      
        <GlassCard className="prose prose-invert max-w-none">
          <p className="text-gray-300 text-lg mb-6 leading-relaxed font-inter">
            Hello! My name is <span className="text-cyber-neon font-bold">Name</span> and I enjoy creating things that live on the internet. My interest in web development started back in 2012 when I decided to try editing custom Tumblr themes — turns out hacking together HTML & CSS was fun!
          </p>
          <p className="text-gray-300 text-lg mb-6 leading-relaxed font-inter">
            Fast-forward to today, and I've had the privilege of working at an <span className="text-cyber-neon">advertising agency</span>, a <span className="text-cyber-neon">start-up</span>, a <span className="text-cyber-neon">huge corporation</span>, and a <span className="text-cyber-neon">student-led design studio</span>.
          </p>

           <div className="grid grid-cols-2 gap-4 mt-8 font-mono text-sm">
              <div className="flex items-center text-gray-400"><span className="text-cyber-neon mr-2">▹</span> JavaScript (ES6+)</div>
              <div className="flex items-center text-gray-400"><span className="text-cyber-neon mr-2">▹</span> TypeScript</div>
              <div className="flex items-center text-gray-400"><span className="text-cyber-neon mr-2">▹</span> React</div>
              <div className="flex items-center text-gray-400"><span className="text-cyber-neon mr-2">▹</span> Node.js</div>
           </div>
        </GlassCard>

        <div className="relative group mx-auto w-72 h-72 md:w-80 md:h-80">
          <div className="absolute inset-0 rounded-lg border-2 border-cyber-neon translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
          <div className="absolute inset-0 bg-cyber-neon/20 rounded-lg group-hover:bg-transparent transition-colors z-10 w-full h-full"></div>
          <img 
            src="https://via.placeholder.com/400" 
            alt="Profile" 
            className="rounded-lg w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 relative z-0" 
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;