import React from 'react';
import { motion } from 'framer-motion';

const SystemRequirements = () => {
    const requirements = {
        minimum: {
            title: "Minimum Requirements",
            icon: "💻",
            gradient: "from-brand to-orange-400",
            specs: [
                { name: "CPU", value: "2 cores", icon: "⚡" },
                { name: "RAM", value: "4 GB", icon: "🧠" },
                { name: "Storage", value: "20 GB SSD", icon: "💾" },
                { name: "OS", value: "Ubuntu 18.04+, Windows 10+, macOS 10.15+", icon: "🖥️" },
                { name: "Browser", value: "Modern browsers with V8 engine", icon: "🌐" }
            ]
        },
        recommended: {
            title: "Recommended Requirements",
            icon: "🚀",
            gradient: "from-orange-400 to-blue-500",
            specs: [
                { name: "CPU", value: "4 cores", icon: "⚡" },
                { name: "RAM", value: "8 GB", icon: "🧠" },
                { name: "Storage", value: "50 GB SSD", icon: "💾" },
                { name: "OS", value: "Ubuntu 20.04+, Windows 11, macOS 11+", icon: "🖥️" },
                { name: "Browser", value: "Latest Google Chrome", icon: "🌐" }
            ]
        }
    };

    const deploymentOptions = [
        {
            title: "Deployment Options",
            icon: "🚢",
            gradient: "from-brand to-blue-600",
            items: [
                { name: "Cloud deployment", icon: "☁️" },
                { name: "On-premise installation", icon: "🏢" },
                { name: "Docker containerization", icon: "🐳" },
                { name: "CI/CD pipeline integration", icon: "🔄" },
                { name: "Automated deployment", icon: "🤖" }
            ]
        },
        {
            title: "Integration Capabilities",
            icon: "🔌",
            gradient: "from-orange-500 to-brand",
            items: [
                { name: "Third-party API integration", icon: "🔗" },
                { name: "Custom plugin system", icon: "🧩" },
                { name: "Webhook support", icon: "🎣" },
                { name: "External service connectivity", icon: "🌐" },
                { name: "Social media integration", icon: "📱" },
                { name: "Payment gateway integration", icon: "💳" }
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-200/20 via-transparent to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-dark to-orange-500 bg-clip-text text-transparent text-center mb-16"
                >
                    System Requirements & Deployment
                </motion.h2>

                {/* Requirements Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
                >
                    {[requirements.minimum, requirements.recommended].map((req, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group relative p-6 md:p-8 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200/50 hover:border-blue-200/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${req.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-4xl md:text-5xl">{req.icon}</div>
                                    <h3 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-brand-dark group-hover:to-orange-500 transition-all duration-300">
                                        {req.title}
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    {req.specs.map((spec, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            viewport={{ once: true }}
                                            className="flex items-center justify-between p-4 md:p-5 rounded-xl bg-gradient-to-r from-blue-50/50 to-orange-50/50 hover:from-blue-100/50 hover:to-orange-100/50 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl md:text-3xl">{spec.icon}</span>
                                                <span className="text-lg md:text-xl text-gray-600">{spec.name}</span>
                                            </div>
                                            <span className="text-base md:text-lg text-gray-800 font-medium">{spec.value}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Deployment Options Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    {deploymentOptions.map((option, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group relative p-6 md:p-8 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200/50 hover:border-blue-200/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-4xl md:text-5xl">{option.icon}</div>
                                    <h3 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-brand-dark group-hover:to-orange-500 transition-all duration-300">
                                        {option.title}
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {option.items.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            viewport={{ once: true }}
                                            className="flex items-center gap-3 p-4 md:p-5 rounded-xl bg-gradient-to-r from-blue-50/50 to-orange-50/50 hover:from-blue-100/50 hover:to-orange-100/50 transition-all duration-300"
                                        >
                                            <span className="text-2xl md:text-3xl">{item.icon}</span>
                                            <span className="text-lg md:text-xl text-gray-700">{item.name}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default SystemRequirements; 