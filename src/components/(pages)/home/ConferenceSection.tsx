'use client'

import { PrimaryButton } from '@/components/shared/Button';
import React from 'react';
import SectionHeader from './SectionHeader';
import { useRouter } from 'next/navigation';


const ConferenceSection = ({ data }: any) => {
    const router = useRouter();

    const handleDetails = (link: string) => {
        window.open(link, '_blank');
    };

    return (
        <>
            <div className=" space-y-6">
                <SectionHeader>Conference</SectionHeader>
                {data.conferenceData.slice(0, 2).map((conference: any) => {
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
                                <PrimaryButton onClick={() => handleDetails(conference.link)} className="text-sm">
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
