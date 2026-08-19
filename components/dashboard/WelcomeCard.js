import React from "react";
import { motion } from "framer-motion";
import { FileAddOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

export default function WelcomeCard({ userData }) {
  const router = useRouter();
  const name = userData?.name || userData?.username;
  const role = userData?.role_mave?.name || userData?.role?.name;
  const organization = userData?.organization?.name;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const actions = [
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
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm p-6 sm:p-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {name ? `${greeting}, ${name}` : greeting}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            {organization
              ? `Working in ${organization}`
              : "Your CMS overview"}
            {role ? ` · ${role}` : ""}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {actions.map((action, index) => (
            <motion.button
              key={action.title}
              onClick={() => router.push(action.link)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.08, duration: 0.25 }}
              className={`bg-gradient-to-r ${action.gradient} text-white rounded-xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[120px]`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">{action.icon}</span>
                <span className="font-semibold text-sm">{action.title}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
