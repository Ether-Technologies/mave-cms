import React from 'react';
import { motion } from 'framer-motion';

const FeatureOverview = ({ overview }) => {
    if (!overview) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose max-w-none mb-8"
        >
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                Overview
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed">{overview}</p>
        </motion.div>
    );
};

export default FeatureOverview; 