'use client'

import React from 'react';
import { SecondaryButton } from '@/components/shared/Button';

// Helper to truncate text (optional)
const truncateText = (text: string, wordLimit: number): string => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
};

const handleDetails = () => {
    console.log("SHOW MORE clicked");
};


const Project = ({ data }: any) => {

    return (
        <>
            <section className="">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.projectData.map((project: any) => {
                            const truncatedText = truncateText(project.description, 20);

                            return (
                                <div className="relative overflow-hidden h-64 w-full group shadow-md" >
                                    {/* Background image */}
                                    <img
                                        src={project.imageSrc || ''}
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
        </>
    );
};

export default Project;
