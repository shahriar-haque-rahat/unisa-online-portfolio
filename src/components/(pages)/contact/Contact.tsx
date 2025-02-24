'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/shared/Header';
import { FaGoogle, FaLinkedinIn, FaLocationDot, FaPhone } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { FaFacebookF } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';

const Contact = ({data}: any) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    const buttonHoverVariants = {
        hover: { scale: 1.05, transition: { duration: 0.2 } },
    };

    // Helper function to map labels to icons
    const getContactIcon = (label: any) => {
        switch (label) {
            case 'Address': return <FaLocationDot className="w-5 h-5 text-gray-600" />;
            case 'Phone': return <FaPhone className="w-5 h-5 text-gray-600" />;
            case 'Email': return <MdEmail className="w-5 h-5 text-gray-600" />;
            default: return null;
        }
    };

    const getSocialIcon = (name: any) => {
        switch (name) {
            case 'LinkedIn': return <FaLinkedinIn className="w-5 h-5" />;
            case 'Facebook': return <FaFacebookF className="w-5 h-5" />;
            case 'Google': return <FaGoogle className="w-5 h-5" />;
            case 'X': return <BsTwitterX className="w-5 h-5" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.h1
                    className="text-4xl font-bold text-gray-800 mb-6 text-center"
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                >
                    <Header>Contact Us</Header>
                </motion.h1>
                <motion.p
                    className="text-gray-600 mb-8 text-center"
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                >
                    Wish to enquire about research, publications, or anything else? You can walk in during office hours, give us a call, or simply submit the form here.
                </motion.p>

                <motion.div
                    className="flex flex-col lg:flex-row gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {/* Contact Information */}
                    <motion.div
                        className="w-full lg:w-1/2 bg-gray-50 shadow-md p-6"
                        variants={itemVariants}
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Contact Information
                        </h2>
                        <motion.div
                            className="space-y-4"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                            {data.contactInfo.map((item: any, index: any) => (
                                <motion.div
                                    key={index}
                                    className="flex items-center gap-2"
                                    variants={itemVariants}
                                >
                                    {getContactIcon(item.label)}
                                    <div>
                                        <span className="font-medium text-gray-700">
                                            {item.label}:
                                        </span>
                                        {item.link ? (
                                            <a
                                                href={item.link}
                                                className="text-gray-600 ml-2 hover:text-primary transition duration-300"
                                            >
                                                {item.value}
                                            </a>
                                        ) : (
                                            <span className="text-gray-600 ml-2">
                                                {item.value}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            className="mt-6"
                            initial="hidden"
                            animate="visible"
                            variants={itemVariants}
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Follow Us
                            </h3>
                            <div className="flex flex-wrap justify-start gap-4">
                                {data.socialLinks.map((social: any, index: any) => (
                                    <motion.a
                                        key={index}
                                        href={social.path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-primary"
                                        whileHover={buttonHoverVariants.hover}
                                    >
                                        {getSocialIcon(social.name)}
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        className="w-full lg:w-1/2 bg-gray-50 shadow-md p-6"
                        variants={itemVariants}
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Send Us a Message
                        </h2>
                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                            <motion.div variants={itemVariants}>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Full name"
                                    className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Subject"
                                    className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Your message"
                                    className="w-full p-3 border border-gray-300 h-32 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                ></textarea>
                            </motion.div>
                            <motion.button
                                type="submit"
                                className="w-full bg-primary text-white p-3 hover:bg-primary transition duration-300"
                                whileHover={buttonHoverVariants.hover}
                            >
                                Submit
                            </motion.button>
                        </motion.form>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;