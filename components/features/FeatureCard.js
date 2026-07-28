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
            className="group relative p-6 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer overflow-hidden"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200/50 via-white to-gray-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Content */}
            <div className="relative z-10">
                <div className="mb-4 flex justify-center">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-gray-200/50 to-white border border-gray-300/50 group-hover:border-gray-400/50 transition-all duration-300">
                        <Image
                            src={feature.icon}
                            alt={feature.title}
                            width={48}
                            height={48}
                            className="filter brightness-0 opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                        />
                    </div>
                </div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 text-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300">
                    {feature.title}
                </h3>
                <p className="text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                </p>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200/0 via-gray-300/0 to-gray-300/0 group-hover:from-gray-200/5 group-hover:via-gray-300/5 group-hover:to-gray-300/5 transition-all duration-300"></div>
        </motion.div>
    );
};

export default FeatureCard; 