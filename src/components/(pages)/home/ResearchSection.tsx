'use client'

import React from "react";
import Image from "next/image";
import image from 'public/images/dummy-image.jpg'
import { SecondaryButton } from "@/components/shared/Button";

const ResearchSection: React.FC = () => {
    const handleDetailsClick = () => {
        console.log("Details button clicked");
    };

    const paragraph = `As a UDST student, you may need certain letters or official documentation related to your student record and financial matters.
        Our services include requests for Diplomas/Certificates, graduation letters, name changes, and more. Keep your records accurate and up-to-date.`;

    const truncatedText = paragraph.split(" ").slice(0, 20).join(" ") + "...";

    return (
        <div className="max-w-lg relative mb-20">
            {/* Image Section */}
            <div className="relative w-[90%] h-72">
                <Image
                    src={image}
                    alt="Request Letters"
                    layout="fill"
                    objectFit="cover"
                />
            </div>

            {/* Text Content Overlapping Image */}
            <div className=" flex flex-col justify-between absolute w-[70%] min-h-44 -bottom-20 right-0 bg-white p-4 shadow-md">
                <span>
                    <h2 className="text-xl font-semibold text-primary">
                        Request Letters and Records
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm">{truncatedText}</p>
                </span>

                {/* Details Button */}
                <div className="flex justify-end">
                    <SecondaryButton onClick={handleDetailsClick} className="text-sm">
                        Details
                    </SecondaryButton>
                </div>
            </div>
        </div>
    );
};

export default ResearchSection;
