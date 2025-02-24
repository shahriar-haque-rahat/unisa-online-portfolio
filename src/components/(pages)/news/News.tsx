'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverWrapper } from '@/components/shared/motion-wrapper/HoverWrapper';
import NewsModal from './NewsModal';
import { PrimaryButton } from '@/components/shared/Button';

export interface NewsPost {
    id: number;
    title: string;
    author: string;
    timestamp: string;
    content: string;
    imageSrc: string[]; // Array of image URLs
}

const newsData: NewsPost[] = [
    {
        id: 1,
        title: "Exciting New Initiative Launched",
        author: "Jane Doe",
        timestamp: "2025-02-24 09:15 AM",
        content:
            "We're excited to announce a new initiative that will help students connect and collaborate on innovative projects. Stay tuned for more updates!We're excited to announce a new initiative that will help students connect and collaborate on innovative projects. Stay tuned for more updates!We're excited to announce a new initiative that will help students connect and collaborate on innovative projects. Stay tuned for more updates!We're excited to announce a new initiative that will help students connect and collaborate on innovative projects. Stay tuned for more updates!We're excited to announce a new initiative that will help students connect and collaborate on innovative projects. Stay tuned for more updates!We're excited to announce a new initiative that will help students connect and collaborate on innovative projects. Stay tuned for more updates!We're excited to announce a new initiative that will help students connect and collaborate on innovative projects. Stay tuned for more updates!We're excited to announce a new initiative that will help students connect and collaborate on innovative projects. Stay tuned for more updates!We're excited to announce a new initiative that will help students connect and collaborate on innovative projects. Stay tuned for more updates!",
        imageSrc: ["/images/dummy-image-2.png"],
    },
    {
        id: 2,
        title: "Campus Update: New Facilities",
        author: "John Smith",
        timestamp: "2025-02-23 03:30 PM",
        content:
            "Our campus is growing! We have recently opened new state-of-the-art facilities that provide students with the resources needed to excel academically.",
        imageSrc: ["/images/dummy-image.jpg", "/images/dummy-image.jpg"],
    },
    {
        id: 3,
        title: "Research Breakthrough in Renewable Energy",
        author: "Alice Johnson",
        timestamp: "2025-02-22 11:00 AM",
        content:
            "Our research team has made a significant breakthrough in renewable energy technology. This innovation could pave the way for more sustainable energy solutions worldwide.",
        imageSrc: ["/images/dummy-image-2.png", "/images/dummy-image.jpg", "/images/dummy-image.jpg"],
    },
    {
        id: 4,
        title: "Scholarship Opportunities for 2025",
        author: "Michael Brown",
        timestamp: "2025-02-21 08:45 AM",
        content:
            "Several new scholarship opportunities have been announced for the upcoming academic year. Check out our website for application details and deadlines.",
        imageSrc: [],
    },
];

const truncateText = (text: string, wordLimit: number): string => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
};

const News: React.FC = () => {
    const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="space-y-6">
                <AnimatePresence>
                    {newsData.map((post) => {
                        const truncatedText = truncateText(post.content, 40);

                        return (
                            <HoverWrapper key={post.id}>
                                <div className="relative bg-white shadow-md flex gap-4 group">
                                    {/* Text Content */}
                                    <div className="w-4/6 flex flex-col justify-center p-8">
                                        <h3 className="text-xl font-bold text-primary">{post.title}</h3>
                                        <div className="text-gray-500 text-sm mb-2">
                                            By {post.author} • {post.timestamp}
                                        </div>
                                        <p className="text-gray-700">{truncatedText}</p>
                                    </div>

                                    {/* Image Section */}
                                    {post.imageSrc.length > 0 && (
                                        <div className="w-2/6">
                                            <div className="aspect-square">
                                                <img
                                                    src={post.imageSrc[0]}
                                                    alt={`${post.title} image 1`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30"
                                    >
                                        <PrimaryButton onClick={() => setSelectedPost(post)} className="text-2xl">
                                            Full Post
                                        </PrimaryButton>
                                    </motion.div>
                                </div>
                            </HoverWrapper>
                        )
                    })}
                </AnimatePresence>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedPost && (
                    <NewsModal post={selectedPost} onClose={() => setSelectedPost(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default News;
