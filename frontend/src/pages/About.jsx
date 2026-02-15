import React from 'react';
import AppWrapper from '../components/layout/AppWrapper';
import AboutSection from '../components/sections/AboutSection';
import SkillsSection from '../components/sections/SkillsSection';

const About = () => {
    return (
        <AppWrapper>
             <div className="pt-10 max-w-7xl mx-auto">
                <AboutSection />
                <SkillsSection />
             </div>
        </AppWrapper>
    );
};

export default About;