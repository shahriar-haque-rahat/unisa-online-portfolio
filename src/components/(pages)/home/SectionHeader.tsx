import React from 'react';

interface MotionWrapperProps {
    children: React.ReactNode;
}

const SectionHeader: React.FC<MotionWrapperProps> = ({ children }) => {
    return (
        <h1 className=' text-3xl font-medium text-primary'>
            <span className='w-1 h-full bg-primary mr-3'>.</span>
            {children}
        </h1>
    );
};

export default SectionHeader;
