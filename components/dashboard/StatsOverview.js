// components/dashboard/StatsOverview.js
import { useState } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
    FileTextOutlined,
    ReadOutlined,
    FileImageOutlined,
    EyeOutlined,
} from "@ant-design/icons";

export default function StatsOverview({ data, loading }) {
    const stats = [
        {
            title: "Total Pages",
            value: data?.pages?.length || 120,
            change: "+12%",
            icon: FileTextOutlined,
            trend: "up",
        },
        {
            title: "Total Posts",
            value: data?.forms?.length || 50,
            change: "+3 today",
            icon: ReadOutlined,
            trend: "up",
        },
        {
            title: "Media Files",
            value: data?.media?.length || 200,
            change: "+5 today",
            icon: FileImageOutlined,
            trend: "up",
        },
        {
            title: "Total Views",
            value: 12500,
            change: "+18%",
            icon: EyeOutlined,
            trend: "up",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"
                >
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                        <stat.icon className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-800">
                            <CountUp
                                end={loading ? 0 : stat.value}
                                separator=","
                                suffix={stat.value >= 1000 ? "+" : ""}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            <span className="text-[#fcb813] font-medium">{stat.change}</span> from last month
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
