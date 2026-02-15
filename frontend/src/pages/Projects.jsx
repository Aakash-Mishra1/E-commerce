import React from 'react';
import AppWrapper from '../components/layout/AppWrapper';
import ProjectsSection from '../components/sections/ProjectsSection';

const Projects = () => {
    return (
        <AppWrapper>
            <div className="pt-10">
                <ProjectsSection />
            </div>
        </AppWrapper>
    );
};

export default Projects;