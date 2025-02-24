'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrimaryButton } from '@/components/shared/Button';
import { HoverWrapper } from '@/components/shared/motion-wrapper/HoverWrapper';

// Helper function to truncate description
const truncateText = (text: string, wordLimit: number): string => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
};

const Publication = ({ data }: any) => {
    // State to manage which tab is active: "journal" or "conference"
    const [activeTab, setActiveTab] = useState<'journal' | 'conference'>('journal');

    // Handle tab switch
    const handleTabClick = (tab: 'journal' | 'conference') => {
        setActiveTab(tab);
    };

    // Decide which data to show based on activeTab
    const dataToShow = activeTab === 'journal' ? data.journalData : data.conferenceData;

    const handleDoi = () => {
        console.log("Details")
    }

    return (
        <>
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
                        {dataToShow.map((item: any) => {
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
        </>
    );
};

export default Publication;
