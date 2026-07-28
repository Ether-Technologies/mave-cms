import React from 'react';
import { motion } from 'framer-motion';

const BusinessBenefits = () => {
    const benefits = [
        {
            title: "Cost Efficiency",
            icon: "💰",
            gradient: "from-gray-600 to-emerald-500",
            items: [
                "Reduced operational costs",
                "Lower maintenance expenses",
                "Optimized resource utilization",
                "Scalable pricing model",
                "ROI-focused solutions"
            ]
        },
        {
            title: "Time Savings",
            icon: "⏰",
            gradient: "from-gray-100 to-gray-300",
            items: [
                "Automated workflows",
                "Streamlined processes",
                "Quick deployment",
                "Rapid integration",
                "Efficient task management"
            ]
        },
        {
            title: "Enhanced Productivity",
            icon: "📈",
            gradient: "from-gray-100 to-pink-500",
            items: [
                "Improved team collaboration",
                "Better resource allocation",
                "Increased output quality",
                "Optimized workflows",
                "Enhanced decision making"
            ]
        },
        {
            title: "Business Growth",
            icon: "🌱",
            gradient: "from-gray-200 to-gray-300",
            items: [
                "Market expansion",
                "Revenue growth",
                "Customer acquisition",
                "Brand development",
                "Competitive advantage"
            ]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className="relative py-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-white to-gray-200"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-600/20 via-transparent to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-600 to-gray-200 bg-clip-text text-transparent text-center mb-16"
                >
                    Business Benefits
                </motion.h2>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group relative p-6 md:p-8 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-4xl md:text-5xl">{benefit.icon}</div>
                                    <h3 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-gray-600 group-hover:to-gray-200 transition-all duration-300">
                                        {benefit.title}
                                    </h3>
                                </div>

                                <ul className="space-y-4">
                                    {benefit.items.map((item, idx) => (
                                        <motion.li
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            viewport={{ once: true }}
                                            className="flex items-center gap-3 p-4 md:p-5 rounded-xl bg-gradient-to-r from-gray-600/50 to-gray-200/50 hover:from-gray-600/50 hover:to-gray-200/50 transition-all duration-300"
                                        >
                                            <span className="text-lg md:text-xl text-gray-700">{item}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default BusinessBenefits; 