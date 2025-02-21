'use client'

import { PrimaryButton } from '@/components/shared/Button';
import React from 'react';

const PublicationSection = () => {
    const handleDetailsClick = () => {
        console.log("Details button clicked");
    };

    const paragraph = `As a UDST student, you may need certain letters or official documentation related to your student record and financial matters.
        Our services include requests for Diplomas/Certificates, graduation letters, name changes, and more. Keep your records accurate and up-to-date.`;

    const truncatedText = paragraph.split(" ").slice(0, 60).join(" ") + "...";

    return (
        <div className="max-w-7xl bg-white w-full p-8 min-h-56 shadow-md flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-semibold text-primary">
                    Request Letters and Records
                </h2>
                <p className="text-gray-600 mt-2 text-sm">{truncatedText}</p>
            </div>

            {/* Details Button */}
            <div className="flex justify-end ">
                <PrimaryButton onClick={handleDetailsClick} className="text-sm">
                    Details
                </PrimaryButton>
            </div>
        </div>

    );
};

export default PublicationSection;
