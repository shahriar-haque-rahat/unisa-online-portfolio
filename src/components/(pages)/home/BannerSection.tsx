'use client'

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
    image: string;
    title: string;
    description: string;
}

// Dummy data – in your production code this can be passed as props
const bannerData: Slide[] = [
    {
        image: '/images/slide1.jpg',
        title: 'Professional Design',
        description: 'Crafting engaging and modern designs for your portfolio.',
    },
    {
        image: '/images/slide2.jpg',
        title: 'Responsive Layout',
        description: 'Built with Tailwind CSS for a fully responsive experience.',
    },
    {
        image: '/images/slide3.jpg',
        title: 'Smooth Animations',
        description: 'Enhanced with Framer Motion for seamless slide transitions.',
    },
];

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

const BannerSection: React.FC = () => {
    // State: [current page index, direction of swipe]
    const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

    // Calculate current slide index dynamically
    const index = ((page % bannerData.length) + bannerData.length) % bannerData.length;

    // Function to change the slide, accepts 1 for next, -1 for previous
    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    // Auto-advance slide every 3 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 3000);
        return () => clearInterval(timer);
    }, [page]);

    // Variants for slide transition
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        }),
    };

    return (
        <div className="w-full h-96 relative overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={page}
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
                    className="absolute w-full h-full"
                >
                    <div
                        className="w-full h-full bg-cover bg-center flex flex-col justify-center items-center bg-gray-900 bg-blend-multiply"
                        style={{ backgroundImage: `url(${bannerData[index].image})` }}
                    >
                        <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-4">
                            {bannerData[index].title}
                        </h2>
                        <p className="text-xl text-white drop-shadow-md">
                            {bannerData[index].description}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default BannerSection;
