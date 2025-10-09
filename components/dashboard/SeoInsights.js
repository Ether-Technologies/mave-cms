// components/dashboard/SeoInsights.js
import React from "react";
import { motion } from "framer-motion";
import { GlobalOutlined, ArrowUpOutlined } from "@ant-design/icons";

export default function SeoInsights() {
    const keywords = [
        { term: "headless cms", rank: 3, change: "+2" },
        { term: "content management", rank: 5, change: "+1" },
        { term: "api first cms", rank: 8, change: "0" },
        { term: "modern cms", rank: 12, change: "+4" },
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

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">SEO Health Score</span>
                        <span className="text-2xl font-bold text-[#fcb813]">82%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "82%" }}
                            transition={{ delay: 0.6, duration: 1 }}
                            className="bg-gradient-to-r from-[#fcb813] to-[#e3a611] h-2 rounded-full"
                        ></motion.div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <GlobalOutlined className="text-[#fcb813]" />
                        82% of your pages are fully optimized
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-medium mb-3 text-gray-700">Top Performing Keywords</h4>
                    <div className="space-y-2">
                        {keywords.map((keyword, index) => (
                            <motion.div
                                key={keyword.term}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                className="flex items-center justify-between text-sm"
                            >
                                <span className="text-gray-600">{keyword.term}</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-800">#{keyword.rank}</span>
                                    {keyword.change !== "0" && (
                                        <span className="text-xs text-[#fcb813] flex items-center">
                                            <ArrowUpOutlined className="h-3 w-3" />
                                            {keyword.change}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
