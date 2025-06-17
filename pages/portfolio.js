import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import FeatureCard from '../components/features/FeatureCard';
import FeatureDetail from '../components/features/FeatureDetail';
import TechnicalCapabilities from '../components/features/TechnicalCapabilities';
import SystemRequirements from '../components/features/SystemRequirements';
import BusinessBenefits from '../components/features/BusinessBenefits';
import { features } from '../data/features';

const Portfolio = () => {
    const [selectedFeature, setSelectedFeature] = useState(null);

    return (
        <>
            <Head>
                <title>Mave CMS - Portfolio</title>
                <meta name="description" content="Explore the powerful features of Mave CMS - A modern headless content management system" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
                {/* Hero Section */}
                <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/30 via-transparent to-purple-100/30"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-200/20 via-transparent to-transparent"></div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 text-center px-4 max-w-4xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="mb-12"
                        >
                            <Image
                                src="/images/ui/mave_new_logo.png"
                                alt="Mave Logo"
                                width={300}
                                height={100}
                                className="mx-auto"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="space-y-6"
                        >
                            <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                                AI Powered Modern Headless Content Management System
                            </p>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Built on MACH (Microservices, API-first, Cloud-native, Headless) architecture principles.
                                Designed to provide developers and content creators with a powerful platform for managing content across various applications.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="flex justify-center gap-6 mt-12"
                        >
                            <motion.div

                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-lg rounded-xl text-gray-700 hover:bg-white/90 transition-all duration-300 border border-gray-200/50 shadow-lg hover:shadow-xl"
                            >
                                <img src="/images/ui/github.png" alt="GitHub" className="w-6 h-6" />
                                <a href="https://github.com/atiqisrak/mave-cms" target="_blank" rel="noopener noreferrer">
                                    View on GitHub
                                </a>
                            </motion.div>
                            <motion.a
                                href="https://mavecms.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl text-white hover:shadow-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Visit Website
                            </motion.a>
                        </motion.div>
                    </motion.div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
                </div>

                {/* Features Grid */}
                <div className="relative py-20">
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-yellow-50/50 to-white"></div>
                    <div className="max-w-7xl mx-auto px-4 relative">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent text-center mb-16"
                        >
                            Powerful Features
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <FeatureCard
                                    key={index}
                                    feature={feature}
                                    onClick={setSelectedFeature}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Technical Capabilities */}
                <TechnicalCapabilities />

                {/* System Requirements & Deployment */}
                <SystemRequirements />

                {/* Business Benefits & Use Cases */}
                <BusinessBenefits />

                {/* Feature Detail Modal */}
                <FeatureDetail
                    feature={selectedFeature}
                    onClose={() => setSelectedFeature(null)}
                />
            </div>
        </>
    );
};

export default Portfolio; 