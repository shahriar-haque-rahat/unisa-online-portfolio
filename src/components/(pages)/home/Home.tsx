import React from 'react';
import BannerSection from './BannerSection';
import ResearchSection from './ResearchSection';
import JournalSection from './JournalSection';
import ProjectSection from './ProjectSection';
import ConferenceSection from './ConferenceSection';
import TeamSection from './TeamSection';

const Home = () => {
    return (
        <div className="space-y-16 max-w-7xl mx-auto">
            <BannerSection />
            <section className=' px-4 space-y-16 '>
                <ResearchSection />
                <ProjectSection />
                <JournalSection />
                <ConferenceSection />
                <TeamSection />
            </section>
        </div>
    );
};

export default Home;
