// components/CounterCards.js
import { Button } from "antd";
import { useState } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  FileImageOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  ReadOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

export default function CounterCards({ data, loading }) {
  const getIcon = (title) => {
    const iconMap = {
      "Total Pages": <FileTextOutlined className="text-2xl" />,
      "Total Posts": <ReadOutlined className="text-2xl" />,
      "Media Files": <FileImageOutlined className="text-2xl" />,
      "Total Views": <EyeOutlined className="text-2xl" />,
      "Users": <UserOutlined className="text-2xl" />,
      "Components": <AppstoreOutlined className="text-2xl" />,
      "Performance": <BarChartOutlined className="text-2xl" />,
      "Storage": <DatabaseOutlined className="text-2xl" />,
      "SEO Score": <GlobalOutlined className="text-2xl" />,
    };
    return iconMap[title] || <AppstoreOutlined className="text-2xl" />;
  };

  const getGradient = (index) => {
    const gradients = [
      "from-[#fcb813] to-[#e3a611]",
      "from-orange-500 to-orange-600",
      "from-gray-600 to-gray-700",
      "from-[#fcb813] to-orange-500",
      "from-orange-600 to-gray-600",
      "from-gray-700 to-gray-800",
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
    ];
    return gradients[index % gradients.length];
  };

  const [cardData] = useState([
    {
      title: "Total Pages",
      value: data?.pages?.length || 120,
      change: "+12%",
      trend: "up",
      period: "from last month",
      link: "/pages",
    },
    {
      title: "Total Posts",
      value: data?.forms?.length || 50,
      change: "+3 today",
      trend: "up",
      period: "from last month",
      link: "/blogs",
    },
    {
      title: "Media Files",
      value: data?.media?.length || 200,
      change: "+5 today",
      trend: "up",
      period: "from last month",
      link: "/gallery",
    },
    {
      title: "Total Views",
      value: 12500,
      change: "+18%",
      trend: "up",
      period: "from last month",
      link: "#",
    },
    {
      title: "Users",
      value: 60,
      change: "+2",
      trend: "up",
      period: "this week",
      link: "/settings/users-settings",
    },
    {
      title: "Components",
      value: data?.cards?.length || 287,
      change: "-1%",
      trend: "down",
      period: "from last month",
      link: "#",
    },
    {
      title: "Performance",
      value: 94,
      change: "+5%",
      trend: "up",
      period: "this week",
      link: "#",
      suffix: "%",
    },
    {
      title: "Storage",
      value: 2.4,
      change: "+0.2GB",
      trend: "up",
      period: "this month",
      link: "#",
      suffix: "GB",
    },
    {
      title: "SEO Score",
      value: 82,
      change: "+3%",
      trend: "up",
      period: "this month",
      link: "#",
      suffix: "%",
    },
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="counter-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {cardData.map((card, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
        >
          {/* Gradient Top Border */}
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getGradient(index)}`}></div>

          <div className="p-5">
            {/* Header with Icon */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                >
                  <CountUp
                    end={loading ? 0 : card.value}
                    separator=","
                    suffix={card.suffix || ""}
                    className="text-2xl sm:text-3xl font-bold text-gray-800"
                  />
                </motion.div>
              </div>
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className={`p-2 rounded-lg bg-gradient-to-br ${getGradient(index)} text-white shadow-sm`}
              >
                {getIcon(card.title)}
              </motion.div>
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${card.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                >
                  {card.trend === "up" ? (
                    <ArrowUpOutlined className="text-xs" />
                  ) : (
                    <ArrowDownOutlined className="text-xs" />
                  )}
                  {card.change}
                </motion.div>
                <span className="text-xs text-gray-500">{card.period}</span>
              </div>
            </div>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}