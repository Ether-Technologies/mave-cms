import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const FeatureCard = ({ feature, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            onClick={() => onClick(feature)}
            className="group relative p-6 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200/50 hover:border-blue-200/50 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer overflow-hidden"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Content */}
            <div className="relative z-10">
                <div className="mb-4 flex justify-center">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100/50 to-white border border-blue-200/50 group-hover:border-blue-300/50 transition-all duration-300">
                        <Image
                            src={feature.icon}
                            alt={feature.title}
                            width={48}
                            height={48}
                            className="filter brightness-0 opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                        />
                    </div>
                </div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 text-center group-hover:from-brand-dark group-hover:to-blue-500 transition-all duration-300">
                    {feature.title}
                </h3>
                <p className="text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                </p>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand/0 via-brand/0 to-brand/0 group-hover:from-brand/5 group-hover:via-brand/5 group-hover:to-brand/5 transition-all duration-300"></div>
        </motion.div>
    );
};

export default FeatureCard; 