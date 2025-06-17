import React from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';

const Portfolio = () => {
    const features = [
        {
            icon: "/icons/mave/component.svg",
            title: "Advanced Page Builder",
            description: "16+ pre-built components with drag-and-drop interface and real-time preview capabilities.",
            gradient: "from-blue-500/20 to-purple-500/20"
        },
        {
            icon: "/icons/mave/creatorstudio.svg",
            title: "Custom Model Generator",
            description: "Create custom models for e-commerce, blogs, or news portals with flexible field types.",
            gradient: "from-green-500/20 to-teal-500/20"
        },
        {
            icon: "/icons/mave/media.svg",
            title: "Media Management",
            description: "Advanced media library with cloud storage integration and image optimization.",
            gradient: "from-yellow-500/20 to-orange-500/20"
        },
        {
            icon: "/icons/mave/tools.svg",
            title: "AI Integration",
            description: "Smart content generation and optimization with AI-powered assistance.",
            gradient: "from-purple-500/20 to-pink-500/20"
        },
        {
            icon: "/icons/mave/settings.svg",
            title: "Enterprise Security",
            description: "SSL encryption, role-based access control, and GDPR compliance.",
            gradient: "from-red-500/20 to-orange-500/20"
        },
        {
            icon: "/icons/mave/browser.svg",
            title: "Cloud-Native",
            description: "Built for modern cloud infrastructures with high availability and resilience.",
            gradient: "from-indigo-500/20 to-blue-500/20"
        },
        {
            icon: "/icons/mave/headphones2.svg",
            title: "Responsive Design",
            description: "Fully responsive components that work seamlessly across all devices.",
            gradient: "from-pink-500/20 to-red-500/20"
        },
        {
            icon: "/icons/mave/documentation.svg",
            title: "Customizable UI",
            description: "Flexible theming and styling options with modern design patterns.",
            gradient: "from-teal-500/20 to-green-500/20"
        }
    ];

    return (
        <>
            <Head>
                <title>Mave CMS - Portfolio</title>
                <meta name="description" content="Explore the powerful features of Mave CMS - A modern headless content management system" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
                {/* Hero Section */}
                <div className="relative h-screen flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center z-10 px-4"
                    >
                        <Image
                            src="/images/ui/mave_new_logo.png"
                            alt="Mave Logo"
                            width={300}
                            height={100}
                            className="mx-auto mb-8"
                        />
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                            Mave CMS
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8">
                            A Modern Headless Content Management System
                        </p>
                        <div className="flex justify-center gap-4">
                            <a
                                href="https://github.com/atiqisrak/mave-cms"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-white/10 backdrop-blur-lg rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                            >
                                View on GitHub
                            </a>
                            <a
                                href="https://mavecms.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-theme rounded-lg text-white hover:bg-theme-dark transition-all duration-300"
                            >
                                Visit Website
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="max-w-7xl mx-auto px-4 py-20">
                    <h2 className="text-4xl font-bold text-white text-center mb-16">
                        Powerful Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`p-6 rounded-2xl bg-gradient-to-br ${feature.gradient} backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300`}
                            >
                                <div className="mb-4 flex justify-center">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        width={48}
                                        height={48}
                                        className="filter brightness-0 invert"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2 text-center">{feature.title}</h3>
                                <p className="text-gray-300 text-center">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Tech Stack Section */}
                <div className="max-w-7xl mx-auto px-4 py-20">
                    <h2 className="text-4xl font-bold text-white text-center mb-16">
                        Built with Modern Technologies
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {['React', 'Next.js', 'Laravel', 'MySQL', 'Docker', 'GraphQL', 'Tailwind CSS', 'Ant Design'].map((tech, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 text-center"
                            >
                                <span className="text-white text-lg font-medium">{tech}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer className="py-8 text-center text-gray-400">
                    <p>© 2024 Mave CMS. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
};

export default Portfolio; 