import React from 'react';
import { motion } from 'framer-motion';
import TechnicalDetailItem from './TechnicalDetailItem';

const TechnicalDetails = ({ technical }) => {
    if (!technical) return null;

    const renderSection = (title, content, type = 'list') => {
        if (!content) return null;
        return (
            <div className="space-y-6">
                <h4 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {title}
                </h4>
                {typeof content === 'object' && !Array.isArray(content) ? (
                    Object.entries(content).map(([key, value], idx) => (
                        <TechnicalDetailItem
                            key={idx}
                            title={key.charAt(0).toUpperCase() + key.slice(1)}
                            items={value}
                            type={type}
                        />
                    ))
                ) : (
                    <TechnicalDetailItem
                        title={title}
                        items={content}
                        type={type}
                    />
                )}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Technical Details
            </h3>

            {technical.components && (
                <div className="space-y-6">
                    {technical.components.basic && renderSection('Basic Components', technical.components.basic, 'object')}
                    {technical.components.pro && renderSection('Pro Components', technical.components.pro, 'object')}
                </div>
            )}

            {technical.features && renderSection('Features', technical.features)}
            {technical.supportedFormats && renderSection('Supported Formats', technical.supportedFormats)}

            {technical.storage && (
                <div className="space-y-6">
                    <h4 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Storage
                    </h4>
                    <div className="p-5 rounded-xl bg-gradient-to-r from-blue-50/50 to-orange-50/50">
                        <div className="text-xl font-medium text-gray-800 mb-3">{technical.storage.type}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {technical.storage.features?.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 text-lg text-gray-600"
                                >
                                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-brand to-orange-400"></span>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {technical.optimization && renderSection('Optimization', technical.optimization)}
            {technical.aiModels && renderSection('AI Models', technical.aiModels)}
            {technical.fieldTypes && renderSection('Field Types', technical.fieldTypes)}
            {technical.integrations && renderSection('Integrations', technical.integrations)}
            {technical.validation && renderSection('Validation', technical.validation)}
            {technical.formats && renderSection('Formats', technical.formats)}
        </motion.div>
    );
};

export default TechnicalDetails; 