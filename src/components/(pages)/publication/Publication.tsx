'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrimaryButton } from '@/components/shared/Button';
import { HoverWrapper } from '@/components/shared/motion-wrapper/HoverWrapper';

// Dummy data for journals
const journalData = [
    {
        id: 1,
        imageSrc: '/images/dummy-image.jpg',
        title: "Request Letters and Records",
        authors: "Andrew Balch, Maria A, Cardei, Afsaneh Doryab",
        publicationDate: "17 Oct 2024",
        description: `As a UDST student, you may need certain letters or official documentation related to your student record and financial matters. Our services include requests for Diplomas/Certificates, graduation letters, name changes, and more. Keep your records accurate and up-to-date.`,
        link: "/link",
    },
    {
        id: 2,
        imageSrc: '/images/dummy-image.jpg',
        title: "Transcript Requests",
        authors: "Jason Donald Chin, Matthew Clark, Afsaneh Doryab",
        publicationDate: "20 Feb 2024",
        description: `Need your official transcripts for your academic progress? We facilitate easy and quick transcript requests to support your academic or career goals.`,
        link: "/link",
    },
    {
        id: 3,
        imageSrc: '/images/dummy-image.jpg',
        title: "Name Change Requests",
        authors: "John Doe, Jane Smith",
        publicationDate: "10 Mar 2024",
        description: `Official name changes can be a necessary part of student documentation. Learn how to submit requests to keep your records updated.`,
        link: "/link",
    },
    {
        id: 4,
        imageSrc: '/images/dummy-image.jpg',
        title: "Additional Records Requests",
        authors: "Chris Evans, Morgan Lee",
        publicationDate: "05 Apr 2024",
        description: `Find out how to request other official documents to maintain your records accurately, including forms for various administrative needs.`,
        link: "/link",
    },
    {
        id: 5,
        imageSrc: '/images/dummy-image.jpg',
        title: "Graduation Letters",
        authors: "Sarah Connor, Kyle Reese",
        publicationDate: "01 May 2024",
        description: `Graduation letters serve as proof of completing all necessary credits. Learn how to request them and ensure your academic journey is well documented.`,
        link: "/link",
    },
];

// Dummy data for conferences
const conferenceData = [
    {
        id: 1,
        imageSrc: '/images/dummy-image.jpg',
        title: "Request Letters and Records - Conference Edition",
        authors: "Alice Brown, Bob White",
        publicationDate: "17 Oct 2023",
        description: `As a UDST student, you may need certain letters or official documentation related to your student record and financial matters. Keep your records accurate and up-to-date.`,
        link: "/link",
    },
    {
        id: 2,
        imageSrc: '/images/dummy-image.jpg',
        title: "Transcript Requests - Seminar",
        authors: "Dr. Transcript, Ms. Request",
        publicationDate: "20 Nov 2023",
        description: `Need your official transcripts for your academic progress? We facilitate easy and quick transcript requests to support your academic or career goals.`,
        link: "/link",
    },
    {
        id: 3,
        imageSrc: '/images/dummy-image.jpg',
        title: "Name Change Requests - Workshop",
        authors: "John Appleseed, Lucy Orman",
        publicationDate: "10 Dec 2023",
        description: `Official name changes can be a necessary part of student documentation. Learn how to submit requests to keep your records updated.`,
        link: "/link",
    },
];

// Helper function to truncate description
const truncateText = (text: string, wordLimit: number): string => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
};

const Publication: React.FC = () => {
    // State to manage which tab is active: "journal" or "conference"
    const [activeTab, setActiveTab] = useState<'journal' | 'conference'>('journal');

    // Handle tab switch
    const handleTabClick = (tab: 'journal' | 'conference') => {
        setActiveTab(tab);
    };

    // Decide which data to show based on activeTab
    const dataToShow = activeTab === 'journal' ? journalData : conferenceData;

    const handleDoi = () => {
        console.log("Details")
    }

    return (
        <div className="">
            {/* Tabs */}
            <div className="mb-6 inline-flex gap-4 bg-white p-2 rounded-full shadow-sm">
                <button
                    onClick={() => handleTabClick('journal')}
                    className={`relative px-6 py-2 font-medium transition-colors duration-300 ${activeTab === 'journal' ? 'text-white' : 'text-gray-800'}`}
                >
                    {activeTab === 'journal' && (
                        <motion.div
                            layoutId="underline"
                            className="absolute inset-0 bg-primary rounded-full"
                        />
                    )}
                    <span className="relative">Journals</span>
                </button>
                <button
                    onClick={() => handleTabClick('conference')}
                    className={`relative px-6 py-2 font-medium transition-colors duration-300 ${activeTab === 'conference' ? 'text-white' : 'text-gray-800'}`}
                >
                    {activeTab === 'conference' && (
                        <motion.div
                            layoutId="underline"
                            className="absolute inset-0 bg-primary rounded-full"
                        />
                    )}
                    <span className="relative">Conferences</span>
                </button>
            </div>

            {/* Publication Cards with animation */}
            <AnimatePresence mode="wait">
                {/* Wrap the active tab content in a motion.div with a unique key */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                >
                    {dataToShow.map((item) => {
                        const truncatedDescription = truncateText(item.description, 30);

                        return (
                            <HoverWrapper>
                                <div
                                    key={item.id}
                                    className="flex flex-col sm:flex-row bg-white shadow-md overflow-hidden"
                                >
                                    {/* Left image */}
                                    <div className="sm:w-1/4 w-full h-40 sm:h-auto flex-shrink-0">
                                        <img
                                            src={item.imageSrc}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Right content */}
                                    <div className="sm:w-3/4 w-full p-4 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                                {item.title}
                                            </h3>
                                            {/* Authors & Date */}
                                            <p className="text-gray-500 text-sm mb-3">
                                                {item.authors} &nbsp;|&nbsp; {item.publicationDate}
                                            </p>
                                            <p className="text-gray-600 mb-3">
                                                {truncatedDescription}
                                            </p>
                                        </div>
                                        <div className=' w-full flex justify-end'>
                                            <PrimaryButton onClick={handleDoi} className="text-lg">
                                                DOI
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                </div>
                            </HoverWrapper>
                        );
                    })}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Publication;
