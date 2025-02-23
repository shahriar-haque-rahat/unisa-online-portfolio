'use client'

import Image from 'next/image';
import React from 'react';
import { PrimaryButton } from '@/components/shared/Button';
import SectionHeader from './SectionHeader';

// Dummy data for project sections
const projectData = [
    {
        id: 1,
        title: "Academic Awards",
        description: `UDST offers opportunities to students to receive a number of academic awards. The academic awards do not require an application 
        and are determined based on academic performance in terms of students’ weighted averages. Some academic awards are determined based on academic 
        performance coupled with other specific criteria such as contribution to university life, faculty recommendation, etc. Full information about 
        academic awards is available at the Admissions & Registration Directorate.`,
        buttonLabel: "READ MORE",
        imageSrc: "/images/dummy-image.jpg", // Example image path
        handleDetailsClick: () => console.log("Details button clicked for Academic Awards"),
    },
    {
        id: 2,
        title: "Research Opportunities",
        description: `UDST provides various research opportunities for students across multiple disciplines. These opportunities help students develop critical research skills 
        and contribute to academic progress. Full details about research programs are available through the Research and Development Office.`,
        buttonLabel: "READ MORE",
        imageSrc: "/images/dummy-image.jpg", // Example image path
        handleDetailsClick: () => console.log("Details button clicked for Research Opportunities"),
    },
];

const ProjectSection: React.FC = () => {
    return (
        <div className="space-y-6">
            <SectionHeader>Project</SectionHeader>
            {projectData.map((project, index) => {
                const truncatedText = project.description.split(" ").slice(0, 80).join(" ") + "...";

                // Determine the layout: Image on the right or left depending on the section index
                const isImageOnRight = index % 2 === 0;

                return (
                    <div
                        key={project.id}
                        className={`flex ${isImageOnRight ? 'flex-row-reverse' : 'flex-row'} shadow-md mb-10`}
                    >
                        {/* Text Section */}
                        <div className="w-3/5 p-8 bg-white flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-blue-700">
                                    {project.title}
                                </h2>
                                <p className="text-gray-600 mt-2 text-sm">{truncatedText}</p>
                            </div>

                            {/* Button positioned at the bottom right */}
                            <div className="mt-4 flex justify-end">
                                <PrimaryButton onClick={project.handleDetailsClick} className="text-sm">
                                    {project.buttonLabel}
                                </PrimaryButton>
                            </div>
                        </div>

                        {/* Image Section */}
                        <div className="relative w-2/5 h-72">
                            <Image
                                src={project.imageSrc}
                                alt={project.title}
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProjectSection;
