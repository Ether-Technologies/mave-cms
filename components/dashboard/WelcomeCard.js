// components/dashboard/welcomeCard.js
import React from "react";
import { motion } from "framer-motion";
import { PlusOutlined, FileAddOutlined, CloudUploadOutlined, EyeOutlined, ShareAltOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

export default function WelcomeCard({ userData }) {
    const router = useRouter();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const getLastLogin = () => {
        const now = new Date();
        return `Today at ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    };

    const welcomeCard = [
        {
            title: "New Post",
            icon: <PlusOutlined />,
            link: "/blogs",
            gradient: "from-[#3498db] to-[#2980b9]",
        },
        {
            title: "New Page",
            icon: <FileAddOutlined />,
            link: "/page-builder",
            gradient: "from-orange-500 to-orange-600",
        },
        {
            title: "Upload Media",
            icon: <CloudUploadOutlined />,
            link: "/gallery",
            gradient: "from-gray-600 to-gray-700",
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm p-6 sm:p-8"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                        {getGreeting()}, {userData?.name || userData?.username || "Alex"}! 👋
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Last login: <span className="font-medium text-gray-700">{getLastLogin()}</span>
                    </p>
                </div>

                {/* Welcome Card */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {welcomeCard.map((action, index) => (
                        <motion.button
                            key={action.title}
                            onClick={() => router.push(action.link)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                            className={`group relative overflow-hidden bg-gradient-to-r ${action.gradient} text-white rounded-xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[120px]`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-lg"
                                >
                                    {action.icon}
                                </motion.div>
                                <span className="font-semibold text-sm">{action.title}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

