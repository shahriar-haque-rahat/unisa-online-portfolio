'use client'

import Image from 'next/image';
import React from 'react';
import image from 'public/images/dummy-image.jpg';
import { PrimaryButton } from '@/components/shared/Button';

const ProjectSection = () => {
    const handleDetailsClick = () => {
        console.log("Details button clicked");
    };

    const paragraph = `UDST offers opportunities to students to receive a number of academic awards. The academic awards do not require an application 
        and are determined based on academic performance in terms of students’ weighted averages. Some academic awards are determined based on academic 
        performance coupled with other specific criteria such as contribution to university life, faculty recommendation, etc. Full information about 
        academic awards is available at the Admissions & Registration Directorate.`;

    const truncatedText = paragraph.split(" ").slice(0, 80).join(" ") + "...";

    return (
        <div className="max-w-7xl mx-auto flex flex-row shadow-md">
            {/* Text Section */}
            <div className="w-3/5 p-8 bg-white flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-blue-700">
                        Academic Awards
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm">{truncatedText}</p>
                </div>

                {/* Button positioned at the bottom right */}
                <div className="mt-4 flex justify-end">
                    <PrimaryButton onClick={handleDetailsClick} className="text-sm">
                        READ MORE
                    </PrimaryButton>
                </div>
            </div>

            {/* Image Section */}
            <div className="relative w-2/5 h-72">
                <Image
                    src={image}
                    alt="Academic Awards"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
        </div>
    );
};

export default ProjectSection;
