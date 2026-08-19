import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { ClockCircleOutlined } from "@ant-design/icons";
import { buildActivity, timeAgo } from "./dashboardUtils";

export default function ContentActivity({ data }) {
  const router = useRouter();
  const activities = buildActivity(data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-1">Recent activity</h3>
        <p className="text-gray-600 text-sm">Latest pages, media, and layout updates</p>
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">No recent activity.</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <button
              key={activity.id}
              type="button"
              onClick={() => router.push(activity.link)}
              className="w-full flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0 text-left"
            >
              <div className="flex-shrink-0 w-9 h-9 bg-[#3498db]/10 rounded-full flex items-center justify-center text-[#3498db] font-semibold text-xs">
                {activity.type.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-gray-600">
                      {activity.type} {activity.action}
                    </p>
                    <p className="text-sm font-medium mt-1 text-gray-800">{activity.title}</p>
                  </div>
                  {activity.status && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                        activity.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {activity.status}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <ClockCircleOutlined className="text-xs" />
                  {timeAgo(activity.date)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
