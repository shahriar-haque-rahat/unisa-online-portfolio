'use client'

import React from "react";
import Image from "next/image";
import { SecondaryButton } from "@/components/shared/Button";

// Dummy data for research sections
const researches = [
    {
        id: 1,
        imageSrc: '/images/dummy-image.jpg', // Image path for the section
        title: "Request Letters and Records",
        description: `As a UDST student, you may need certain letters or official documentation related to your student record and financial matters.
        Our services include requests for Diplomas/Certificates, graduation letters, name changes, and more. Keep your records accurate and up-to-date.`,
        buttonLabel: "Details",
        handleDetailsClick: () => console.log("Details button clicked for Request Letters and Records"),
    },
    {
        id: 2,
        imageSrc: '/images/dummy-image.jpg', // Replace with other images as needed
        title: "Transcript Requests",
        description: `Need your official transcripts for your academic progress? We facilitate easy and quick transcript requests to support your academic or career goals.`,
        buttonLabel: "Details",
        handleDetailsClick: () => console.log("Details button clicked for Transcript Requests"),
    },
    {
        id: 3,
        imageSrc: '/images/dummy-image.jpg', // Replace with other images as needed
        title: "Name Change Requests",
        description: `Official name changes can be a necessary part of student documentation. Learn how to submit requests to keep your records updated.`,
        buttonLabel: "Details",
        handleDetailsClick: () => console.log("Details button clicked for Name Change Requests"),
    },
    {
        id: 4,
        imageSrc: '/images/dummy-image.jpg', // Replace with other images as needed
        title: "Name Change Requests",
        description: `Official name changes can be a necessary part of student documentation. Learn how to submit requests to keep your records updated.`,
        buttonLabel: "Details",
        handleDetailsClick: () => console.log("Details button clicked for Name Change Requests"),
    },
    {
        id: 5,
        imageSrc: '/images/dummy-image.jpg', // Replace with other images as needed
        title: "Name Change Requests",
        description: `Official name changes can be a necessary part of student documentation. Learn how to submit requests to keep your records updated.`,
        buttonLabel: "Details",
        handleDetailsClick: () => console.log("Details button clicked for Name Change Requests"),
    },
];

const ResearchSection: React.FC = () => {
    return (
        <div className=" flex flex-wrap justify-center lg:justify-between">
            {researches.slice(0, 2).map((research) => {
                const truncatedText = research.description.split(" ").slice(0, 20).join(" ") + "...";

                return (
                    <div key={research.id} className=" relative">
                        {/* Image Section */}
                        <img
                            src={research.imageSrc}
                            alt={research.title}
                            className="md:w-[calc(100%-40px)] h-[400px] xl:h-[500px] md:m-10 object-cover object-center"
                        />

                        {/* Text Content Overlapping Image */}
                        <div className="absolute bottom-0 left-0 md:mr-[20%] xl:mr-[30%] flex flex-col justify-between bg-primary text-white p-4 shadow-md">
                            <span>
                                <h2 className="text-xl font-semibold">{research.title}</h2>
                                <p className="mt-2 text-sm">{truncatedText}</p>
                            </span>

                            {/* Details Button */}
                            <div className="flex justify-end">
                                <SecondaryButton onClick={research.handleDetailsClick}>
                                    {research.buttonLabel}
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ResearchSection;
