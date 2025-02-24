'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { NewsPost } from './News';
import { FiArrowLeftCircle, FiArrowRightCircle } from 'react-icons/fi';

interface NewsModalProps {
    post: NewsPost;
    onClose: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({ post, onClose }) => {
    const images = post.imageSrc;
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderContainerRef = useRef<HTMLDivElement>(null);
    const [sliderWidth, setSliderWidth] = useState(0);

    // Set the slider width once the component mounts.
    useEffect(() => {
        if (sliderContainerRef.current) {
            setSliderWidth(sliderContainerRef.current.offsetWidth);
        }
    }, []);

    // Handle drag end to change slide if drag offset passes a threshold.
    const handleDragEnd = (event: any, info: any) => {
        const offsetX = info.offset.x;
        if (Math.abs(offsetX) > 50) {
            if (offsetX < 0 && currentIndex < images.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else if (offsetX > 0 && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }
        }
    };

    // Arrow button handlers.
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white p-6 max-w-5xl w-full max-h-[80vh] relative overflow-hidden"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3 }}
            >
                <button
                    onClick={onClose}
                    style={{
                        background: "none",
                        border: "none",
                        color: "gray",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                    }}
                    className="absolute top-2 right-4"
                >
                    &times;
                </button>
                {/* Text Container with increased height and vertical scrolling */}
                <h3 className="text-2xl font-bold text-primary mb-4">{post.title}</h3>
                <div className="text-gray-500 text-sm mb-2">
                    By {post.author} • {post.timestamp}
                </div>
                <div className="max-h-40 overflow-y-auto pr-2">

                    <p className="text-gray-700 mb-4">{post.content}</p>
                </div>
                {images.length > 0 && (
                    <div className="relative mt-4 bg-black" ref={sliderContainerRef}>
                        <motion.div
                            className="flex"
                            drag="x"
                            dragConstraints={{ left: -sliderWidth * (images.length - 1), right: 0 }}
                            onDragEnd={handleDragEnd}
                            animate={{ x: -currentIndex * sliderWidth }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            {images.map((src, index) => (
                                <div
                                    key={index}
                                    className="min-w-full flex items-center justify-center"
                                    style={{ height: '400px' }}
                                >
                                    <img
                                        src={src}
                                        alt={`${post.title} image ${index + 1}`}
                                        className="object-contain"
                                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                                    />
                                </div>
                            ))}
                        </motion.div>
                        {/* Left Arrow */}
                        {currentIndex > 0 && (
                            <button
                                onClick={handlePrev}
                                className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white p-2"
                            >
                                <FiArrowLeftCircle size={32} />
                            </button>
                        )}
                        {/* Right Arrow */}
                        {currentIndex < images.length - 1 && (
                            <button
                                onClick={handleNext}
                                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white p-2"
                            >
                                <FiArrowRightCircle size={32} />
                            </button>
                        )}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default NewsModal;
