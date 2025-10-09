// components/dashboard/PerformanceInsights.js
import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

export default function PerformanceInsights() {
    const chartData = [
        { date: "Mon", views: 2400, engagement: 1800 },
        { date: "Tue", views: 3200, engagement: 2100 },
        { date: "Wed", views: 2800, engagement: 1900 },
        { date: "Thu", views: 3900, engagement: 2800 },
        { date: "Fri", views: 4200, engagement: 3200 },
        { date: "Sat", views: 3800, engagement: 2600 },
        { date: "Sun", views: 3400, engagement: 2400 },
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

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fcb813" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#fcb813" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#e3a611" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#e3a611" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                            tickMargin={8}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                            tickMargin={8}
                            tickFormatter={(value) => `${value / 1000}k`}
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
                            stroke="#fcb813"
                            strokeWidth={2}
                            fillOpacity={0.2}
                            fill="url(#colorViews)"
                        />
                        <Area
                            type="monotone"
                            dataKey="engagement"
                            stroke="#e3a611"
                            strokeWidth={2}
                            fillOpacity={0.2}
                            fill="url(#colorEngagement)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
