// components/dashboard/SEOCard.js
import React from "react";
import { motion } from "framer-motion";
import { GlobalOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

export default function SEOCard() {
    const keywords = [
        { keyword: "headless cms", rank: 3, change: -2, trend: "down" },
        { keyword: "content management", rank: 5, change: 1, trend: "up" },
        { keyword: "api first cms", rank: 8, change: 0, trend: "neutral" },
        { keyword: "modern cms", rank: 12, change: 4, trend: "up" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"
        >
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">SEO Performance</h3>
                <p className="text-gray-600 text-sm">Search engine optimization insights</p>
            </div>

            {/* SEO Health Score */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">SEO Health Score</span>
                    <span className="text-2xl font-bold text-[#3498db]">82%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "82%" }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="bg-gradient-to-r from-[#3498db] to-[#2980b9] h-2 rounded-full"
                    ></motion.div>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <GlobalOutlined className="text-[#3498db]" />
                    82% of your pages are fully optimized
                </p>
            </div>

            {/* Top Performing Keywords */}
            <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Top Performing Keywords</h4>
                <div className="space-y-3">
                    {keywords.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                            <div className="flex-1">
                                <span className="font-medium text-gray-800">{item.keyword}</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-gray-600">#{item.rank}</span>
                                    {item.trend !== "neutral" && (
                                        <div className={`flex items-center gap-1 text-xs ${item.trend === "up" ? "text-green-600" : "text-red-600"
                                            }`}>
                                            {item.trend === "up" ? (
                                                <ArrowUpOutlined />
                                            ) : (
                                                <ArrowDownOutlined />
                                            )}
                                            {Math.abs(item.change)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
