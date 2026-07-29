import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const FeatureHeader = ({ feature }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-6 mb-8"
        >
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={40}
                    height={40}
                    className="filter brightness-0 opacity-60"
                />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-brand-dark to-orange-500 bg-clip-text text-transparent">
                {feature.title}
            </h2>
        </motion.div>
    );
};

export default FeatureHeader; 