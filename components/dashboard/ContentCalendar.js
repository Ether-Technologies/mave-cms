// components/dashboard/ContentCalendar.js
import React from "react";
import { motion } from "framer-motion";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";

export default function ContentCalendar() {
    const upcomingContent = [
        {
            title: "Product Launch Announcement",
            date: "Dec 15, 2024",
            time: "10:00 AM",
            status: "scheduled",
        },
        {
            title: "Weekly Newsletter",
            date: "Dec 16, 2024",
            time: "9:00 AM",
            status: "scheduled",
        },
        {
            title: "Feature Update Blog",
            date: "Dec 18, 2024",
            time: "2:00 PM",
            status: "draft",
        },
        {
            title: "Customer Success Story",
            date: "Dec 20, 2024",
            time: "11:00 AM",
            status: "review",
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"
        >
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Content Calendar</h3>
                <p className="text-gray-600 text-sm">Upcoming scheduled content</p>
            </div>

            <div className="space-y-4">
                {upcomingContent.map((content, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-medium text-sm leading-tight text-gray-800">{content.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${content.status === "scheduled"
                                ? "bg-[#000000] text-white"
                                : content.status === "draft"
                                    ? "bg-gray-200 text-gray-700"
                                    : "bg-gray-200 text-gray-800"
                                }`}>
                                {content.status}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <CalendarOutlined className="text-xs" />
                                {content.date}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <ClockCircleOutlined className="text-xs" />
                                {content.time}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
