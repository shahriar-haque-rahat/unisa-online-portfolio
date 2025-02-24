'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { SecondaryButton } from '@/components/shared/Button';

interface ProjectData {
    id: number;
    title: string;
    description: string;
    imageSrc: string;
}

const projectData: ProjectData[] = [
    {
        id: 1,
        title: "Academic Awards",
        description: `UDST offers opportunities to students to receive a number of academic awards. The academic awards do not require an application and are determined based on academic performance in terms of students’ weighted averages. Some academic awards are determined based on academic performance coupled with other specific criteria such as contribution to university life, faculty recommendation, etc. Full information about academic awards is available at the Admissions & Registration Directorate.`,
        imageSrc: "/images/dummy-image.jpg",
    },
    {
        id: 2,
        title: "Research Opportunities",
        description: `as.`,
        imageSrc: "/images/dummy-image.jpg",
    },
    {
        id: 3,
        title: "Scholarship Programs",
        description: `UDST offers multiple scholarship programs for deserving students. These programs are designed to reward academic excellence and to support students in financial need. Learn more about how you can apply for a scholarship today.`,
        imageSrc: "/images/dummy-image.jpg",
    },
    {
        id: 4,
        title: "Student Exchange",
        description: `UDST has partnerships with universities around the world, providing students with opportunities for exchange programs. Broaden your horizons by studying abroad while earning credits towards your UDST degree.`,
        imageSrc: "/images/dummy-image.jpg",
    },
    {
        id: 5,
        title: "Internship Programs",
        description: `UDST partners with leading companies in various industries to provide internship opportunities. Gain real-world experience and boost your resume before graduation.`,
        imageSrc: "/images/dummy-image.jpg",
    },
    {
        id: 6,
        title: "Online Learning",
        description: `UDST provides flexible online learning options for students who need to balance work, family, or other commitments. Access a range of courses and resources from anywhere in the world.`,
        imageSrc: "/images/dummy-image.jpg",
    },
];

// Helper to truncate text (optional)
const truncateText = (text: string, wordLimit: number): string => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
};

const handleDetails = () => {
    console.log("SHOW MORE clicked");
};


const Project: React.FC = () => {
    return (
        <section className="">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projectData.map((project) => {
                        const truncatedText = truncateText(project.description, 20);

                        return (
                            <div className="relative overflow-hidden h-64 w-full group shadow-md" >
                                {/* Background image */}
                                <img
                                    src={project.imageSrc}
                                    alt={project.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* Bottom drawer */}
                                <div className="absolute inset-0 flex flex-col justify-end">
                                    <div className="bg-[#3c87ff] bg-opacity-60 text-white p-4 transform translate-y-[70%] group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-lg font-semibold mb-3">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm mb-3 min-h-20">{truncatedText}</p>
                                        <SecondaryButton className="text-sm" onClick={handleDetails}>
                                            SHOW MORE
                                        </SecondaryButton>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Project;
