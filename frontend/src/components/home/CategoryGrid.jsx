import React from 'react';
import { Link } from 'react-router-dom';
import { ComputerDesktopIcon, CameraIcon, SpeakerWaveIcon, ClockIcon, CpuChipIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';
import GlassCard from '../common/GlassCard';

const CategoryGrid = () => {
    const categories = [
        { name: "Computers", icon: <CpuChipIcon className="w-8 h-8"/>, color: "text-blue-400" },
        { name: "Audio", icon: <SpeakerWaveIcon className="w-8 h-8"/>, color: "text-indigo-400" },
        { name: "Gaming", icon: <PuzzlePieceIcon className="w-8 h-8"/>, color: "text-green-400" },
        { name: "Photography", icon: <CameraIcon className="w-8 h-8"/>, color: "text-cyan-400" },
        { name: "Wearables", icon: <ClockIcon className="w-8 h-8"/>, color: "text-yellow-400" },
        { name: "Monitors", icon: <ComputerDesktopIcon className="w-8 h-8"/>, color: "text-red-400" },
    ];

  return (
    <div className="py-12" data-aos="fade-up" data-aos-delay="200">
      <h2 className="text-2xl font-bold text-white mb-8 font-poppins px-2 border-l-4 border-brandBlue pl-4">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {categories.map((cat, index) => (
            <Link key={index} to={`/shop?category=${cat.name}`}>
                <GlassCard hoverEffect={true} className="flex flex-col items-center justify-center p-6 cursor-pointer group hover:bg-white/5 transition-colors h-full">
                    <div className={`mb-3 transition-transform duration-300 group-hover:scale-110 ${cat.color}`}>
                        {cat.icon}
                    </div>
                    <h4 className="font-medium text-gray-300 group-hover:text-white transition-colors">{cat.name}</h4>
                </GlassCard>
            </Link>
        ))}
      </div>
    </div>
  );
};


export default CategoryGrid;
