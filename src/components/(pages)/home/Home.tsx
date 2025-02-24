'use client';

import React from 'react';
import BannerSection from './BannerSection';
import ResearchSection from './ResearchSection';
import JournalSection from './JournalSection';
import ProjectSection from './ProjectSection';
import ConferenceSection from './ConferenceSection';
import TeamSection from './TeamSection';
import CounterSection from './CounterSection';

const Home = ({ data }: any) => {
    return (
        <>
            <div className="space-y-16 max-w-7xl mx-auto">
                <BannerSection data={data} />
                <section className="px-4 space-y-16">
                    <CounterSection data={data} />
                    <ResearchSection data={data} />
                    <ProjectSection data={data} />
                    <JournalSection data={data} />
                    <ConferenceSection data={data} />
                    <TeamSection data={data} />
                </section>
            </div>
        </>
    );
};

export default Home;
