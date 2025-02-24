import React from 'react';

interface MotionWrapperProps {
    children: React.ReactNode;
}

const Header: React.FC<MotionWrapperProps> = ({ children }) => {
    return (
        <h1 className=' text-3xl text-center font-semibold text-primary mb-10 '>
            {children}
        </h1>
    );
};

export default Header;
