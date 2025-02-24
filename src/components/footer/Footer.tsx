import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className=' flex flex-col md:flex-row gap-10 justify-center items-center md:justify-between'>
                    <div className=" space-y-10 md:w-1/2">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold">Research Team</h2>
                            <p className="text-gray-400 text-sm">
                                Advancing knowledge through innovative research and collaboration.
                            </p>
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-semibold mb-2">Our Mission</h3>
                            <p className="text-gray-400 text-sm">
                                We strive to push the boundaries of knowledge by exploring
                                new frontiers in science and technology. Through
                                collaboration, we aim to share our findings to benefit
                                society as a whole.
                            </p>
                        </div>
                    </div>

                    <div className=" space-y-10 md:w-1/2">
                        <div className="flex flex-wrap justify-center md:justify-end space-x-4">
                            <Link href="/home" className="hover:text-gray-300 text-sm">
                                Home
                            </Link>
                            <Link href="/news" className="hover:text-gray-300 text-sm">
                                News
                            </Link>
                            <Link href="/project" className="hover:text-gray-300 text-sm">
                                Project
                            </Link>
                            <Link href="/publication" className="hover:text-gray-300 text-sm">
                                Publication
                            </Link>
                            <Link href="/research" className="hover:text-gray-300 text-sm">
                                Research
                            </Link>
                            <Link href="/team" className="hover:text-gray-300 text-sm">
                                Team
                            </Link>
                            <Link href="/contact" className="hover:text-gray-300 text-sm">
                                Contact
                            </Link>
                        </div>

                        <div className="text-center md:text-right">
                            <h3 className="text-lg font-semibold mb-2">Contact Info</h3>
                            <p className="text-gray-400 text-sm">Email: info@researchteam.com</p>
                            <p className="text-gray-400 text-sm">Phone: +1 (123) 456-7890</p>
                            <p className="text-gray-400 text-sm">
                                Address: 123 Research Blvd, Innovation City, Country
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 border-t border-gray-800 pt-4 text-center text-gray-500 text-xs">
                    © {new Date().getFullYear()} Research Team. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
