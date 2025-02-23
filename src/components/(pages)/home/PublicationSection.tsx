'use client'

import { PrimaryButton, SecondaryButton } from '@/components/shared/Button';
import React from 'react';
import SectionHeader from './SectionHeader';

// Dummy data for publications
const publicationData = [
    {
        id: 1,
        title: "Request Letters and Records",
        description: `As a UDST student, you may need certain letters or official documentation related to your student record and financial matters. Our services include requests for Diplomas/Certificates, graduation letters, name changes, and more. Keep your records accurate and up-to-date.`,
    },
    {
        id: 2,
        title: "Transcript Requests",
        description: `Need your official transcripts for your academic progress? We facilitate easy and quick transcript requests to support your academic or career goals.`,
    },
    {
        id: 3,
        title: "Name Change Requests",
        description: `Official name changes can be a necessary part of student documentation. Learn how to submit requests to keep your records updated.`,
    },
    {
        id: 4,
        title: "Name Change Requests",
        description: `Official name changes can be a necessary part of student documentation. Learn how to submit requests to keep your records updated.`,
    },
    {
        id: 5,
        title: "Name Change Requests",
        description: `Official name changes can be a necessary part of student documentation. Learn how to submit requests to keep your records updated.`,
    },
];

const handleDetailsClick = () => {
    console.log("Details")
}

const handleShowMore = () => {
    console.log("Show More")
}

const PublicationSection: React.FC = () => {
    return (
        <div className="space-y-6">
            <SectionHeader>Publication</SectionHeader>
            {publicationData.slice(0, 2).map((publication) => {
                const truncatedText = publication.description.split(" ").slice(0, 60).join(" ") + "...";

                return (
                    <div
                        key={publication.id}
                        className="bg-primary text-white w-full p-8 min-h-56 shadow-md flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-xl font-semibold">{publication.title}</h2>
                            <p className="mt-2 text-sm">{truncatedText}</p>
                        </div>

                        {/* Details Button */}
                        <div className="flex justify-end">
                            <SecondaryButton onClick={handleDetailsClick}>
                                Details
                            </SecondaryButton>
                        </div>
                    </div>
                );
            })}

            <div className=' flex justify-center'>
                <PrimaryButton onClick={handleShowMore} className="text-lg">
                    Show More
                </PrimaryButton>
            </div>
        </div>
    );
};

export default PublicationSection;
