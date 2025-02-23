'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
    {
        title: 'Slide One',
        subtitle: 'This is the first slide with a stunning image.',
        buttonText: 'Learn More',
        imageUrl: 'https://via.placeholder.com/1920x1080/111111/FFFFFF?text=Slide+1',
    },
    {
        title: 'Slide Two',
        subtitle: 'Experience the beauty of our second slide.',
        buttonText: 'Discover',
        imageUrl: 'https://via.placeholder.com/1920x1080/222222/FFFFFF?text=Slide+2',
    },
    {
        title: 'Slide Three',
        subtitle: 'Our third slide is designed to captivate your audience.',
        buttonText: 'Get Started',
        imageUrl: 'https://via.placeholder.com/1920x1080/333333/FFFFFF?text=Slide+3',
    },
];

interface Slide {
    title: string;
    subtitle: string;
    buttonText?: string;
    imageUrl: string;
}

interface BannerSliderProps {
    slides: Slide[];
    autoPlayDelay?: number; // in milliseconds
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
    }),
};

const BannerSlider: React.FC<BannerSliderProps> = ({ autoPlayDelay = 5000 }) => {
    // "page" is a counter that can exceed the number of slides. We use modulus to determine the slide index.
    const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
    const slideIndex = ((page % slides.length) + slides.length) % slides.length; // ensures non-negative index
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    const resetAutoPlay = () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        autoPlayRef.current = setInterval(() => {
            paginate(1);
        }, autoPlayDelay);
    };

    useEffect(() => {
        resetAutoPlay();
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [page, autoPlayDelay]);

    const handleMouseEnter = () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };

    const handleMouseLeave = () => {
        resetAutoPlay();
    };

    return (
        <div
            className="relative w-full overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={page}
                    className="w-full relative"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);
                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                >
                    {/* Background image */}
                    <img
                        src={slides[slideIndex].imageUrl}
                        alt={slides[slideIndex].title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    {/* Slide content */}
                    <div className="relative z-10 max-w-7xl mx-auto text-center py-24 px-6">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white">
                            {slides[slideIndex].title}
                        </h1>
                        <p className="mt-4 text-lg sm:text-xl text-white">
                            {slides[slideIndex].subtitle}
                        </p>
                        {slides[slideIndex].buttonText && (
                            <div className="mt-6">
                                <button className="bg-secondary text-white px-6 py-3 rounded-md text-lg hover:bg-secondary-dark transition-all duration-300">
                                    {slides[slideIndex].buttonText}
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Process Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {slides.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-3 h-3 rounded-full ${idx === slideIndex ? 'bg-white' : 'bg-gray-500'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerSlider;
