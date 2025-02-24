"use client";

import React from "react";

const FullScreenLoading: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-primary"></div>
        </div>
    );
};

export default FullScreenLoading;
