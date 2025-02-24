'use client'

import React from 'react';
import { SecondaryButton } from '@/components/shared/Button';

const researchData = [
    {
        id: 1,
        imageSrc: '/images/dummy-image.jpg',
        title: "Request Letters and Records",
        description: `As a UDST student, you may need certain letters or official documentation related to your student record and financial matters.
        Our services include requests for Diplomas/Certificates, graduation letters, name changes, and more. Keep your records accurate and up-to-date.`,
        publicationName: "Journal of University Services",
        publicationDate: "January 15, 2023",
    },
    {
        id: 2,
        imageSrc: '/images/dummy-image.jpg',
        title: "Transcript Requests",
        description: `Need your official transcripts for your academic progress? We facilitate easy and quick transcript requests to support your academic or career goals.`,
        publicationName: "Transcript Studies Quarterly",
        publicationDate: "February 20, 2023",
    },
    {
        id: 3,
        imageSrc: '/images/dummy-image.jpg',
        title: "Name Change Requests",
        description: `Official name changes can be a necessary part of student documentation. Learn how to submit requests to keep your records updated.`,
        publicationName: "Research Digest",
        publicationDate: "March 10, 2023",
    },
    {
        id: 4,
        imageSrc: '/images/dummy-image.jpg',
        title: "Name Change Requests",
        description: `Official name changes can be a necessary part of student documentation. Learn how to submit requests to keep your records updated.`,
        publicationName: "Academic Record Review",
        publicationDate: "April 05, 2023",
    },
    {
        id: 5,
        imageSrc: '/images/dummy-image.jpg',
        title: "Name Change Requests",
        description: `Official name changes can be a necessary part of student documentation. Learn how to submit requests to keep your records updated.`,
        publicationName: "Name Change & Identity",
        publicationDate: "May 01, 2023",
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
                    {researchData.map((research) => {
                        const truncatedText = truncateText(research.description, 20);

                        return (
                            <div className="relative overflow-hidden h-64 w-full group shadow-md" >
                                {/* Background image */}
                                <img
                                    src={research.imageSrc}
                                    alt={research.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* Bottom drawer */}
                                <div className="absolute inset-0 flex flex-col justify-end">
                                    <div className="bg-[#3c87ff] bg-opacity-60 text-white p-4 transform translate-y-[70%] group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-lg font-semibold mb-3">
                                            {research.title}
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
