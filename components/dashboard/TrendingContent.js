// components/dashboard/TrendingContent.js
import React from "react";
import { motion } from "framer-motion";
import { EyeOutlined, ShareAltOutlined } from "@ant-design/icons";

export default function TrendingContent() {
    const trendingItems = [
        {
            title: "Getting Started with Headless CMS",
            views: "3.2K",
            shares: 245,
            type: "Post",
        },
        {
            title: "API Documentation Guide",
            views: "2.8K",
            shares: 189,
            type: "Page",
        },
        {
            title: "Best Practices for Content Management",
            views: "2.1K",
            shares: 156,
            type: "Post",
        },
        {
            title: "Integration Tutorials",
            views: "1.9K",
            shares: 134,
            type: "Page",
        },
        {
            title: "Advanced Features Overview",
            views: "1.7K",
            shares: 98,
            type: "Post",
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"
        >
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Trending Content</h3>
                <p className="text-gray-600 text-sm">Top performing content this month</p>
            </div>

            <div className="space-y-4">
                {trendingItems.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fcb813]/10 text-[#fcb813] font-semibold text-sm">
                            {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <h4 className="font-medium text-sm leading-tight text-gray-800">{item.title}</h4>
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full shrink-0">
                                    {item.type}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <EyeOutlined className="h-3 w-3" />
                                    {item.views} views
                                </span>
                                <span className="flex items-center gap-1">
                                    <ShareAltOutlined className="h-3 w-3" />
                                    {item.shares} shares
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
