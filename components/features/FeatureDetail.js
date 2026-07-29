import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import FeatureHeader from './FeatureHeader';
import FeatureOverview from './FeatureOverview';
import FeatureCapabilities from './FeatureCapabilities';
import TechnicalDetails from './TechnicalDetails';

const TechnicalDetailItem = ({ title, items, type = 'list' }) => {
    if (type === 'list') {
        return (
            <div className="space-y-3">
                <h4 className="text-lg font-medium text-gray-700">{title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-orange-50/50 hover:from-blue-100/50 hover:to-orange-100/50 transition-all duration-300"
                        >
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-brand to-orange-400"></span>
                            <span className="text-gray-700">{item}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'object') {
        return (
            <div className="space-y-3">
                <h4 className="text-lg font-medium text-gray-700">{title}</h4>
                <div className="grid grid-cols-1 gap-3">
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-orange-50/50 hover:from-blue-100/50 hover:to-orange-100/50 transition-all duration-300"
                        >
                            <div className="font-medium text-gray-800 mb-2">{item.name}</div>
                            <div className="flex flex-wrap gap-2">
                                {item.features.map((feature, featureIdx) => (
                                    <span
                                        key={featureIdx}
                                        className="px-3 py-1 text-sm rounded-full bg-white/50 text-gray-600 border border-gray-200/50"
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

const FeatureDetail = ({ feature, onClose }) => {
    if (!feature) return null;

    // Extract the details from the feature object
    const { details } = feature;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 overflow-y-auto"
            >
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="min-h-screen px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="relative inline-block w-full max-w-7xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Content */}
                        <div className="relative overflow-hidden">
                            {/* Background Elements */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50"></div>
                            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-200/20 via-transparent to-transparent"></div>

                            <div className="relative px-6 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
                                <FeatureHeader feature={feature} />

                                <div className="mt-8 space-y-12">
                                    {details?.overview && (
                                        <FeatureOverview overview={details.overview} />
                                    )}

                                    {details?.capabilities && details.capabilities.length > 0 && (
                                        <FeatureCapabilities capabilities={details.capabilities} />
                                    )}

                                    {details?.technical && (
                                        <TechnicalDetails technical={details.technical} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FeatureDetail; 