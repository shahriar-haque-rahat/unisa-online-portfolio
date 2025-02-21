import React from 'react';
import BannerSection from './BannerSection';
import ResearchSection from './ResearchSection';
import PublicationSection from './PublicationSection';
import ProjectSection from './ProjectSection';
import ConferenceSection from './ConferenceSection';
import TeamSection from './TeamSection';

const Home = () => {
    return (
        <div className="space-y-12">
            <BannerSection />
            <div className=' pb-1'><ResearchSection /></div>
            <ProjectSection />
            <PublicationSection />
            <ConferenceSection />
            <TeamSection />
        </div>
    );
};

export default Home;
