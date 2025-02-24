'use client'

import { PrimaryButton, SecondaryButton } from '@/components/shared/Button';
import React from 'react';
import SectionHeader from './SectionHeader';
import { useRouter } from 'next/navigation';

const handleDetails = () => {
    console.log("Details")
}

const JournalSection = ({data}: any) => {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <SectionHeader>Journal</SectionHeader>
            {data.journalData.slice(0, 2).map((journal: any) => {
                const truncatedText = journal.description.split(" ").slice(0, 60).join(" ") + "...";

                return (
                    <div
                        key={journal.id}
                        className="bg-primary text-white w-full p-8 min-h-56 shadow-md flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-xl font-semibold">{journal.title}</h2>
                            <p className="mt-2 text-sm">{truncatedText}</p>
                        </div>

                        {/* Details Button */}
                        <div className="flex justify-end">
                            <SecondaryButton onClick={handleDetails}>
                                Details
                            </SecondaryButton>
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
    );
};

export default JournalSection;
