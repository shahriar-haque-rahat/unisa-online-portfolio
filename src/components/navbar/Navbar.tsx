'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname(); // to check the active route

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const routes = [
        { name: 'Home', path: '/' },
        { name: 'Project', path: '/project' },
        { name: 'Research', path: '/research' },
        { name: 'Publication', path: '/publication' },
        { name: 'Conference', path: '/conference' },
        { name: 'News', path: '/news' },
        { name: 'Team', path: '/team' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (route: string) => pathname === route;

    return (
        <header className="bg-white shadow-md fixed w-full h-16 top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto mt-4 flex items-center justify-between">
                {/* Logo Section */}
                <div className="text-xl font-semibold text-primary">
                    <a href="/">Logo</a>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8">
                    {routes.map((route) => (
                        <motion.a
                            key={route.path}
                            href={route.path}
                            className={`${isActive(route.path)
                                    ? 'text-primary bg-white font-bold border-b-2 border-primary'
                                    : 'text-gray-600 opacity-80'
                                } hover:text-primary font-medium transition-colors relative`}
                            whileHover={{ y: -2 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            {route.name}
                            {/* Add border animation on hover */}
                            <motion.div
                                className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                            />
                        </motion.a>
                    ))}
                </nav>

                {/* Mobile Hamburger Icon */}
                <div className="md:hidden flex items-center">
                    <button onClick={toggleMenu} className="text-primary hover:text-primary">
                        <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-6 w-6"
                            animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </motion.svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="md:hidden fixed top-0 right-0 h-full w-3/4 bg-white shadow-lg z-40"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                        {/* Close Button */}
                        <div className="flex justify-end p-4">
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-primary">
                                <motion.svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="h-6 w-6"
                                    whileHover={{ rotate: 90 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </motion.svg>
                            </button>
                        </div>

                        <nav className="space-y-4 py-4 px-6">
                            {routes.map((route, index) => (
                                <motion.a
                                    key={route.path}
                                    href={route.path}
                                    className={`block text-gray-600 ${isActive(route.path)
                                            ? 'font-bold bg-white text-xl text-primary border-b-2 border-primary'
                                            : ''
                                        } hover:bg-gray-100`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 150 }}
                                >
                                    {route.name}
                                </motion.a>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
