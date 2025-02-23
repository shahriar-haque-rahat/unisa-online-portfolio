'use client'

import { motion, MotionProps } from 'framer-motion';

interface MotionWrapperProps extends MotionProps {
    children: React.ReactNode;
    className?: string;
}

// Render Wrapper: Applies a fade-in and slight slide-up animation when the component is rendered
export const RenderWrapper: React.FC<MotionWrapperProps> = ({ children, className, ...rest }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} // Initially hidden and slightly below
            animate={{ opacity: 1, y: 0 }}   // Fade-in and move to its normal position
            exit={{ opacity: 0, y: 20 }}     // Fade-out and move down when leaving
            transition={{ duration: 0.5 }}
            className={className}
            {...rest}
        >
            {children}
        </motion.div>
    );
};
