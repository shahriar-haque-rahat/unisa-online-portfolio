'use client'

import Image from 'next/image';
import React from 'react';
import { PrimaryButton } from '@/components/shared/Button';
import SectionHeader from './SectionHeader';

const ProjectSection = ({data}: any) => {
    const handleDetailsClick = () =>{
        
    }
    return (
        <div className="space-y-6">
            <SectionHeader>Project</SectionHeader>
            {data.projectData.slice(0, 2).map((project: any, index: any) => {
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
                                <h2 className="text-xl font-semibold text-primary">
                                    {project.title}
                                </h2>
                                <p className="text-gray-600 mt-2 text-sm">{truncatedText}</p>
                            </div>

                            {/* Button positioned at the bottom right */}
                            <div className="mt-4 flex justify-end">
                                <PrimaryButton onClick={handleDetailsClick} className="text-sm">
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
