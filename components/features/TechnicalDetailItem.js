import React from 'react';
import { motion } from 'framer-motion';

const TechnicalDetailItem = ({ title, items, type = 'list' }) => {
    if (!items || !Array.isArray(items)) {
        return null;
    }

    if (type === 'list') {
        return (
            <div className="space-y-4">
                <h4 className="text-xl font-medium text-gray-700">{title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-orange-50/50 hover:from-blue-100/50 hover:to-orange-100/50 transition-all duration-300"
                        >
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-brand to-orange-400"></span>
                            <span className="text-lg text-gray-700">{item}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'object') {
        return (
            <div className="space-y-4">
                <h4 className="text-xl font-medium text-gray-700">{title}</h4>
                <div className="grid grid-cols-1 gap-4">
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="p-5 rounded-xl bg-gradient-to-r from-blue-50/50 to-orange-50/50 hover:from-blue-100/50 hover:to-orange-100/50 transition-all duration-300"
                        >
                            <div className="text-xl font-medium text-gray-800 mb-3">{item.name}</div>
                            <div className="flex flex-wrap gap-3">
                                {item.features?.map((feature, featureIdx) => (
                                    <span
                                        key={featureIdx}
                                        className="px-4 py-2 text-base rounded-full bg-white/50 text-gray-600 border border-gray-200/50"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

export default TechnicalDetailItem; 