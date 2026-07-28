import React from 'react';
import { motion } from 'framer-motion';

const FeatureCapabilities = ({ capabilities }) => {
    if (!capabilities || !Array.isArray(capabilities)) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 mb-8"
        >
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Capabilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {capabilities.map((capability, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 p-5 rounded-xl bg-gradient-to-r from-gray-200/50 to-gray-300/50 hover:from-gray-200/50 hover:to-gray-300/50 transition-all duration-300"
                    >
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-gray-200 to-gray-300"></span>
                        <span className="text-xl text-gray-700">{capability}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default FeatureCapabilities; 