// components/dashboard/PerformanceChart.js
import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

export default function PerformanceChart() {
    const data = [
        { name: "Mon", views: 1200, engagement: 800 },
        { name: "Tue", views: 1900, engagement: 1200 },
        { name: "Wed", views: 3000, engagement: 1800 },
        { name: "Thu", views: 4500, engagement: 2200 },
        { name: "Fri", views: 5200, engagement: 2800 },
        { name: "Sat", views: 3800, engagement: 2000 },
        { name: "Sun", views: 2800, engagement: 1500 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"
        >
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Performance Insights</h3>
                <p className="text-gray-600 text-sm">Content performance over the last 7 days</p>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#000000" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#525252" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#525252" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                            tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="views"
                            stroke="#000000"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorViews)"
                        />
                        <Area
                            type="monotone"
                            dataKey="engagement"
                            stroke="#525252"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorEngagement)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#000000] rounded-full"></div>
                    <span className="text-sm text-gray-600">Views</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#525252] rounded-full"></div>
                    <span className="text-sm text-gray-600">Engagement</span>
                </div>
            </div>
        </motion.div>
    );
}
