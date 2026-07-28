// components/dashboard/ContentActivity.js
import React from "react";
import { motion } from "framer-motion";
import { ClockCircleOutlined, EditOutlined, FileTextOutlined, CloudUploadOutlined, UserOutlined } from "@ant-design/icons";

export default function ContentActivity() {
    const activities = [
        {
            user: "John Doe",
            action: "created a new blog post",
            title: "The Future of AI in Content Management",
            time: "5 minutes ago",
            type: "create",
            status: "draft",
        },
        {
            user: "Sarah Smith",
            action: "updated the page",
            title: "About Us",
            time: "1 hour ago",
            type: "update",
            status: "published",
        },
        {
            user: "Mike Johnson",
            action: "uploaded media",
            title: "5 images to Product Gallery",
            time: "2 hours ago",
            type: "upload",
            status: null,
        },
        {
            user: "Emily Davis",
            action: "published a post",
            title: "Best Practices for API Design",
            time: "3 hours ago",
            type: "publish",
            status: "published",
        },
        {
            user: "Alex Chen",
            action: "created a new page",
            title: "Documentation",
            time: "5 hours ago",
            type: "create",
            status: "draft",
        },
    ];

    const getIcon = (type) => {
        switch (type) {
            case "create":
                return <FileTextOutlined className="text-sm" />;
            case "update":
                return <EditOutlined className="text-sm" />;
            case "upload":
                return <CloudUploadOutlined className="text-sm" />;
            default:
                return <FileTextOutlined className="text-sm" />;
        }
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"
        >
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Recent Activity</h3>
                <p className="text-gray-600 text-sm">Latest content updates and changes</p>
            </div>

            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                        <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-[#000000] to-[#525252] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {getInitials(activity.user)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm">
                                        <span className="font-medium text-gray-800">{activity.user}</span>{" "}
                                        <span className="text-gray-600">{activity.action}</span>
                                    </p>
                                    <p className="text-sm font-medium mt-1 text-gray-800">{activity.title}</p>
                                </div>
                                {activity.status && (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${activity.status === "published"
                                        ? "bg-gray-200 text-gray-800"
                                        : "bg-gray-200 text-gray-700"
                                        }`}>
                                        {activity.status}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                <ClockCircleOutlined className="text-xs" />
                                {activity.time}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
