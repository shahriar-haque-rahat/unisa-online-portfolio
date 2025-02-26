'use client';

import React, { useEffect, useState } from 'react';
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

const truncateText = (text: string, wordLimit: number): string => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
};

const News = ({ data }: any) => {
    const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div className="space-y-6">
                    <AnimatePresence>
                        {data.newsData.map((post: any) => {
                            const truncatedText = truncateText(post.content, 40);

                            return (
                                <HoverWrapper key={post.id}>
                                    <div className="relative bg-white shadow-md flex flex-col md:flex-row gap-4 group">
                                        {/* Text Content */}
                                        <div className="md:w-4/6 flex flex-col justify-center p-8">
                                            <h3 className="text-xl font-bold text-primary">{post.title}</h3>
                                            <div className="text-gray-500 text-sm mb-2">
                                                By {post.author} • {post.timestamp}
                                            </div>
                                            <p className="text-gray-700">{truncatedText}</p>
                                        </div>

                                        {/* Image Section */}
                                        {post.imageSrc.length > 0 && (
                                            <div className="md:w-2/6">
                                                <div className="aspect-square">
                                                    <img
                                                        src={post.imageSrc[0] || ''}
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
        </>
    );
};

export default News;
