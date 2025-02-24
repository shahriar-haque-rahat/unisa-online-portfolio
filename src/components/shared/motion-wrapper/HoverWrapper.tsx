'use client'

import { motion, MotionProps } from 'framer-motion';

interface MotionWrapperProps extends MotionProps {
    children: React.ReactNode;
    className?: string;
}

// Hover Wrapper: Applies a zoom effect on hover
export const HoverWrapper: React.FC<MotionWrapperProps> = ({ children, className, ...rest }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className={className}
            {...rest}
        >
            {children}
        </motion.div>
    );
};
