import React from 'react';
import SectionTitle from '../common/SectionTitle';
import GlassCard from '../common/GlassCard';
import { CubeIcon, CommandLineIcon, ServerIcon, PaintBrushIcon } from '@heroicons/react/24/outline';

const SkillsSection = () => {
    const skills = [
        { name: "React", icon: <CubeIcon className="w-8 h-8"/> },
        { name: "Node.js", icon: <ServerIcon className="w-8 h-8"/> },
        { name: "Tailwind", icon: <PaintBrushIcon className="w-8 h-8"/> },
        { name: "Javascript", icon: <CommandLineIcon className="w-8 h-8"/> },
        { name: "MongoDB", icon: <ServerIcon className="w-8 h-8"/> },
        { name: "Express", icon: <ServerIcon className="w-8 h-8"/> },
        { name: "Git", icon: <CommandLineIcon className="w-8 h-8"/> },
        { name: "Figma", icon: <PaintBrushIcon className="w-8 h-8"/> },
    ];

  return (
    <section id="skills" className="py-20 px-4 md:px-20 max-w-7xl mx-auto">
      <SectionTitle label="02. Skills" title="Technical Arsenal" />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {skills.map((skill, index) => (
            <GlassCard key={index} className="flex flex-col items-center justify-center text-center group cursor-default">
                <div className="group-hover:text-cyber-neon transition-colors duration-300 mb-3 text-gray-400">
                    {skill.icon}
                </div>
                <h4 className="font-mono text-lg text-gray-200 group-hover:text-white">{skill.name}</h4>
            </GlassCard>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;