import React from 'react';
import { motion } from 'framer-motion';

const TechnicalCapabilities = () => {
    const capabilities = [
        {
            title: "Frontend Technologies",
            icon: "🎨",
            gradient: "from-yellow-400 to-orange-400",
            items: [
                { name: "React", version: "18.2.0", features: ["Hooks", "Context API", "Suspense"] },
                { name: "Next.js", version: "12.3.4", features: ["SSR", "SSG", "API Routes"] },
                { name: "Ant Design", version: "Latest", features: ["Components", "Themes", "Icons"] },
                { name: "Tailwind CSS", version: "Latest", features: ["Utility-first", "Customization", "Responsive"] }
            ],
            subcategories: [
                {
                    title: "Rich Text Editors",
                    icon: "📝",
                    items: ["TinyMCE", "TipTap", "Froala Editor", "Quill"]
                }
            ]
        },
        {
            title: "Backend Infrastructure",
            icon: "⚙️",
            gradient: "from-orange-400 to-yellow-500",
            items: [
                { name: "Laravel", version: "Latest", features: ["Eloquent", "Blade", "Artisan"] },
                { name: "MySQL Database", version: "8.0+", features: ["Transactions", "Indexing", "Replication"] },
                { name: "RESTful API", version: "Latest", features: ["CRUD", "Authentication", "Rate Limiting"] },
                { name: "GraphQL", version: "Latest", features: ["Schema", "Resolvers", "Subscriptions"] }
            ]
        },
        {
            title: "Development Tools",
            icon: "🛠️",
            gradient: "from-yellow-500 to-orange-500",
            items: [
                { name: "Jenkins CI/CD", version: "Latest", features: ["Pipelines", "Plugins", "Automation"] },
                { name: "Docker", version: "Latest", features: ["Containers", "Images", "Networks"] },
                { name: "Nginx", version: "Latest", features: ["Load Balancing", "Caching", "SSL"] },
                { name: "GitHub", version: "Latest", features: ["Actions", "Packages", "Pages"] }
            ]
        },
        {
            title: "Security Features",
            icon: "🔒",
            gradient: "from-orange-500 to-yellow-400",
            items: [
                { name: "SSL/TLS Encryption", version: "Latest", features: ["HTTPS", "Certificates", "Ciphers"] },
                { name: "Role-Based Access Control", version: "Latest", features: ["Permissions", "Roles", "Policies"] },
                { name: "GDPR Compliance", version: "Latest", features: ["Data Protection", "Privacy", "Consent"] },
                { name: "CCPA Compliance", version: "Latest", features: ["Data Rights", "Disclosure", "Opt-out"] },
                { name: "Secure Credential Storage", version: "Latest", features: ["Encryption", "Hashing", "Salting"] }
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
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-orange-50"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-200/20 via-transparent to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent text-center mb-16"
                >
                    Technical Capabilities
                </motion.h2>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    {capabilities.map((capability, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group relative p-6 md:p-8 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200/50 hover:border-yellow-200/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${capability.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-4xl md:text-5xl">{capability.icon}</div>
                                    <h3 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-yellow-600 group-hover:to-orange-500 transition-all duration-300">
                                        {capability.title}
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    {capability.items.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            viewport={{ once: true }}
                                            className="p-4 md:p-5 rounded-xl bg-gradient-to-r from-yellow-50/50 to-orange-50/50 hover:from-yellow-100/50 hover:to-orange-100/50 transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-lg md:text-xl font-medium text-gray-800">{item.name}</span>
                                                <span className="text-sm md:text-base text-gray-500">{item.version}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {item.features.map((feature, featureIdx) => (
                                                    <span
                                                        key={featureIdx}
                                                        className="px-3 py-1.5 text-sm md:text-base rounded-full bg-white/50 text-gray-600 border border-gray-200/50"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {capability.subcategories?.map((sub, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            viewport={{ once: true }}
                                            className="mt-6 pt-6 border-t border-gray-100"
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="text-2xl md:text-3xl">{sub.icon}</div>
                                                <h4 className="text-lg md:text-xl font-medium text-gray-700">{sub.title}</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {sub.items.map((item, itemIdx) => (
                                                    <span
                                                        key={itemIdx}
                                                        className="px-3 py-1.5 text-sm md:text-base rounded-full bg-gradient-to-r from-yellow-50 to-orange-50 text-gray-600 border border-gray-200/50"
                                                    >
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
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

export default TechnicalCapabilities; 