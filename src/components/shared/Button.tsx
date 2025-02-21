'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface PrimaryButtonProps {
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}

export interface PrimaryButtonProps {
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    children = '',
    onClick,
    className = '',
}) => {
    return (
        <div className="inline-block">
            <motion.button
                onClick={onClick}
                className={`relative p-1 bg-transparent text-white focus:outline-none`}
                whileHover="hover"
            >
                <div className={`bg-primary py-2 px-3 ${className}`}>{children}</div>
                <motion.span
                    className="absolute border border-primary pointer-events-none"
                    // Use a negative inset so the border covers the very edge.
                    style={{ inset: '-1px' }}
                    initial={{
                        // Start with a collapsed border line; note the offsets to match the inset.
                        clipPath: 'polygon(50% -1px, 50% -1px, 50% calc(100% + 1px), 50% calc(100% + 1px))',
                    }}
                    variants={{
                        hover: {
                            // Expand the clipPath so the border fully outlines the button.
                            clipPath: 'polygon(-1px -1px, calc(100% + 1px) -1px, calc(100% + 1px) calc(100% + 1px), -1px calc(100% + 1px))',
                        },
                    }}
                    transition={{ duration: 0.3 }}
                />
            </motion.button>
        </div>
    );
};

export const SecondaryButton: React.FC<PrimaryButtonProps> = ({
    children = '',
    onClick,
    className = '',
}) => {
    return (
        <div className="inline-block">
            <motion.button
                onClick={onClick}
                className={`relative py-2 px-3 bg-transparent text-primary focus:outline-none`}
                whileHover="hover"
            >
                <div className={` ${className}`}>{children}</div>
                <motion.span
                    className="absolute border border-primary pointer-events-none"
                    // Use a negative inset so the border covers the very edge.
                    style={{ inset: '-1px' }}
                    initial={{
                        // Start with a collapsed border line; note the offsets to match the inset.
                        clipPath: 'polygon(50% -1px, 50% -1px, 50% calc(100% + 1px), 50% calc(100% + 1px))',
                    }}
                    variants={{
                        hover: {
                            // Expand the clipPath so the border fully outlines the button.
                            clipPath: 'polygon(-1px -1px, calc(100% + 1px) -1px, calc(100% + 1px) calc(100% + 1px), -1px calc(100% + 1px))',
                        },
                    }}
                    transition={{ duration: 0.3 }}
                />
            </motion.button>
        </div>
    );
};
