'use client';

import React from 'react';
import { motion, Transition } from 'framer-motion';

const dotVariants = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.2, 1] },
};

const transition = (delay: number): Transition => ({
    duration: 0.6,
    repeat: Infinity,
    repeatType: 'loop',
    ease: 'easeInOut',
    delay,
});

const NavLoading = () => {
    return (
        <div className="flex items-center justify-center space-x-1">
            <motion.div
                className="w-2 h-2 bg-primary rounded-full"
                variants={dotVariants}
                initial="initial"
                animate="animate"
                transition={transition(0)}
            />
            <motion.div
                className="w-2 h-2 bg-primary rounded-full"
                variants={dotVariants}
                initial="initial"
                animate="animate"
                transition={transition(0.1)}
            />
            <motion.div
                className="w-2 h-2 bg-primary rounded-full"
                variants={dotVariants}
                initial="initial"
                animate="animate"
                transition={transition(0.2)}
            />
        </div>
    );
};

export default NavLoading;
