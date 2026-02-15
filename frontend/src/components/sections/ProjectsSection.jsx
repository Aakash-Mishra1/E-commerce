import React from 'react';
import SectionTitle from '../common/SectionTitle';
import GlassCard from '../common/GlassCard';

const ProjectsSection = () => {
  const projects = [
    {
      title: "Project Alpha",
      description: "A high-end e-commerce platform built with React, Node.js and MongoDB. Features include real-time inventory, secure payments, and a custom admin dashboard.",
      tech: ["React", "Express", "MongoDB", "Tailwind"],
      image: "https://via.placeholder.com/600x400",
      liveLink: "#",
      githubLink: "#",
    },
    {
      title: "Cyber Chat App",
      description: "Real-time messaging application with end-to-end encryption. Uses Socket.io for instant communication and supports multimedia sharing.",
      tech: ["Socket.io", "React", "Node.js"],
      image: "https://via.placeholder.com/600x400",
      liveLink: "#",
      githubLink: "#",
    },
     {
      title: "Portfolio v1",
      description: "My previous portfolio website showcasing my early work. Focuses on simple design and fast load times with static site generation.",
      tech: ["HTML", "SCSS", "JavaScript"],
      image: "https://via.placeholder.com/600x400",
      liveLink: "#",
      githubLink: "#",
    },
  ];

  return (
    <section id="projects" className="py-20 px-4 md:px-20 max-w-7xl mx-auto">
      <SectionTitle label="03. Work" title="Some Things I've Built" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <GlassCard key={index} className="flex flex-col h-full group p-0 overflow-hidden">
             {/* Image container with overlay */}
            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-cyber-dark1/50 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                <img src={project.image} alt={project.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold font-poppins text-white mb-3 group-hover:text-cyber-neon transition-colors">{project.title}</h3>
                <div className="bg-cyber-dark2/50 p-4 rounded-lg mb-4 text-gray-400 text-sm flex-grow font-inter leading-relaxed shadow-inner">
                    {project.description}
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6 font-mono text-xs text-cyber-neon/80">
                    {project.tech.map(t => <span key={t}>{t}</span>)}
                </div>

                <div className="flex gap-4 mt-auto">
                    <a href={project.githubLink} className="text-gray-300 hover:text-white transition-colors" aria-label="Github"><i className="w-6 h-6 border rounded-full flex items-center justify-center">G</i></a>
                    <a href={project.liveLink} className="text-gray-300 hover:text-white transition-colors" aria-label="External Link"><i className="w-6 h-6 border rounded-full flex items-center justify-center">↗</i></a>
                </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;