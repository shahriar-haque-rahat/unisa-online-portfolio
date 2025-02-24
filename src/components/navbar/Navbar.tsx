'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { FaFacebookF, FaGoogle, FaLinkedinIn } from 'react-icons/fa6';
import { BsTwitterX } from 'react-icons/bs';
import NavLoading from '../shared/Loading/NavLoading';

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch('/data/data.json')
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData))
            .catch((err) => console.error('Error fetching data:', err));
    }, []);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const routes = [
        { name: 'Home', path: '/' },
        { name: 'Project', path: '/project' },
        { name: 'Research', path: '/research' },
        { name: 'Publication', path: '/publication' },
        { name: 'News', path: '/news' },
        { name: 'Team', path: '/team' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (route: string) => pathname === route;

    // Helper function to map social names to icons
    const getSocialIcon = (name: string) => {
        switch (name) {
            case 'LinkedIn': return <FaLinkedinIn className="h-5 w-5" />;
            case 'Facebook': return <FaFacebookF className="h-5 w-5" />;
            case 'Google': return <FaGoogle className="h-5 w-5" />;
            case 'X': return <BsTwitterX className="h-5 w-5" />;
            default: return null;
        }
    };

    return (
        <>
            <header className="px-4 bg-white shadow-md fixed w-full h-16 top-0 left-0 z-50">
                <div className="max-w-7xl mx-auto mt-4 flex items-center justify-between">
                    {/* Logo Section with Animation */}
                    <div className='w-40 flex justify-start items-center'>
                        {data ?
                            <motion.div
                                className="text-xl font-semibold text-primary cursor-pointer"
                                onClick={() => router.push('/')}
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <img src={data.logo} alt="logo" className="h-10 w-auto" /> {/* Add size constraints */}
                            </motion.div>
                            : <NavLoading />
                        }
                    </div>

                    {/* Desktop Navigation (Center) */}
                    <nav className="hidden md:flex space-x-8 justify-center flex-1 h-10">
                        {routes.map((route) => (
                            <motion.a
                                key={route.path}
                                onClick={() => router.push(route.path)}
                                className={`cursor-pointer ${isActive(route.path)
                                    ? 'text-primary font-bold border-b-2 border-primary'
                                    : 'text-gray-600 opacity-80'
                                    } hover:text-primary font-medium transition-colors relative`}
                                whileHover={{ y: -2 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                {route.name}
                                <motion.div
                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                                    initial={{ scaleX: 0 }}
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                />
                            </motion.a>
                        ))}
                    </nav>

                    {/* Desktop Social Links (Right) */}
                    <div className=' w-40 flex justify-end items-center'>
                        {data ? <div className="hidden md:flex space-x-4">
                            {data.socialLinks.map((social: any) => (
                                <motion.a
                                    key={social.name}
                                    href={social.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-primary"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    {getSocialIcon(social.name)}
                                </motion.a>
                            ))}
                        </div>
                            : <NavLoading />
                        }
                    </div>

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

                            <nav className="flex flex-col h-full gap-10 py-4 px-6">
                                {/* Navigation Items */}
                                <div className="space-y-4">
                                    {routes.map((route, index) => (
                                        <motion.a
                                            key={route.path}
                                            onClick={() => {
                                                router.push(route.path);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`block text-gray-600 cursor-pointer ${isActive(route.path)
                                                ? 'font-bold text-xl text-primary border-b-2 border-primary'
                                                : ''
                                                } hover:bg-gray-100`}
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1, type: 'spring', stiffness: 150 }}
                                        >
                                            {route.name}
                                        </motion.a>
                                    ))}
                                </div>

                                {/* Social Icons at Bottom */}
                                {data ?
                                    <div className="flex space-x-6 justify-center pb-6">
                                        {data.socialLinks.map((social: any, index: number) => (
                                            <motion.a
                                                key={social.name}
                                                href={social.path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 hover:text-primary"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: routes.length * 0.1 + index * 0.1, type: 'spring', stiffness: 150 }}
                                            >
                                                {getSocialIcon(social.name)}
                                            </motion.a>
                                        ))}
                                    </div>
                                    : <NavLoading />
                                }
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
};

export default Navbar;
