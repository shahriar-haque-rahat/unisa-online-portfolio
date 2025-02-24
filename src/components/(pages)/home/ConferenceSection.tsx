'use client'

import { PrimaryButton } from '@/components/shared/Button';
import React from 'react';
import SectionHeader from './SectionHeader';
import { useRouter } from 'next/navigation';

// Dummy data for conferences
const conferenceData = [
    {
        id: 1,
        title: "Request Letters and Records",
        description: `As a UDST student, you may need certain letters or official documentation related to your student record and financial matters. Our services include requests for Diplomas/Certificates, graduation letters, name changes, and more. Keep your records accurate and up-to-date.`,
        link: "/link",
    },
    {
        id: 2,
        title: "Transcript Requests",
        description: `Need your official transcripts for your academic progress? We facilitate easy and quick transcript requests to support your academic or career goals.`,
        link: "/link",
    },
    {
        id: 3,
        title: "Name Change Requests",
        description: `Official name changes can be a necessary part of student documentation. Learn how to submit requests to keep your records updated.`,
        link: "/link",
    },
];

const handleDetails = () => {
    console.log("Details")
}


const ConferenceSection: React.FC = () => {
    const router = useRouter();

    return (
        <>
            <div className=" space-y-6">
                <SectionHeader>Conference</SectionHeader>
                {conferenceData.slice(0, 2).map((conference) => {
                    const truncatedText = conference.description.split(" ").slice(0, 60).join(" ") + "...";

                    return (
                        <div
                            key={conference.id}
                            className="bg-white w-full p-8 min-h-56 shadow-md flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-xl font-semibold text-primary">{conference.title}</h2>
                                <p className="text-gray-600 mt-2 text-sm">{truncatedText}</p>
                            </div>

                            {/* Details Button */}
                            <div className="flex justify-end">
                                <PrimaryButton onClick={handleDetails} className="text-sm">
                                    Details
                                </PrimaryButton>
                            </div>
                        </div>
                    );
                })}

                <div className=' flex justify-center'>
                    <PrimaryButton onClick={() => router.push('/publication')} className="text-lg">
                        Show More
                    </PrimaryButton>
                </div>
            </div>
        </>
    );
};

export default ConferenceSection;
