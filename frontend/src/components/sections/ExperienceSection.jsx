import React from 'react';
import SectionTitle from '../common/SectionTitle';
import GlassCard from '../common/GlassCard';

const ExperienceSection = () => {
  const experiences = [
    {
      role: "Senior Frontend Developer",
      company: "Tech Corp",
      period: "2023 - Present",
      description: "Leading the frontend team in building a scalable e-commerce platform using React, Next.js, and TailwindCSS.",
      skills: ["React", "Redux", "TypeScript"]
    },
    {
      role: "Full Stack Developer",
      company: "Startup Inc",
      period: "2021 - 2023",
      description: "Developed and maintained full-stack applications using MERN stack. Implemented real-time features using Socket.io.",
      skills: ["Node.js", "MongoDB", "Express"]
    },
    {
      role: "Junior Web Developer",
      company: "Web Agency",
      period: "2020 - 2021",
      description: "Collaborated with designers to implement pixel-perfect user interfaces. Optimized website performance and accessibility.",
      skills: ["HTML", "CSS", "JavaScript"]
    }
  ];

  return (
    <section id="experience" className="py-20 px-4 md:px-20 max-w-5xl mx-auto">
      <SectionTitle label="06. Experience" title="Where I've Worked" />
      
      <div className="relative border-l-2 border-cyber-neon/30 ml-4 md:ml-10 space-y-12 pl-10">
        {experiences.map((exp, index) => (
          <div key={index} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[51px] top-0 w-5 h-5 rounded-full bg-cyber-dark1 border-2 border-cyber-neon group-hover:bg-cyber-neon group-hover:box-glow transition-all duration-300"></div>
            
            <GlassCard className="relative hover:bg-white/5 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:justify-between mb-2">
                <h3 className="text-xl font-bold text-white font-poppins">{exp.role} <span className="text-cyber-neon">@ {exp.company}</span></h3>
                <span className="font-mono text-sm text-gray-400 mt-1 md:mt-0">{exp.period}</span>
              </div>
              
              <p className="text-gray-300 mb-4 font-inter leading-relaxed">{exp.description}</p>
              
              <div className="flex flex-wrap gap-3">
                {exp.skills.map((skill, i) => (
                  <span key={i} className="text-xs font-mono text-cyber-neon bg-cyber-neon/10 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;