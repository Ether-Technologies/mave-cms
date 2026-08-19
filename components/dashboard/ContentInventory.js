import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ContentInventory({ data }) {
  const chartData = [
    { name: "Pages", count: data.pages.length },
    { name: "Media", count: data.media.length },
    { name: "Navbars", count: data.navbars.length },
    { name: "Sliders", count: data.sliders.length },
    { name: "Footers", count: data.footers.length },
    { name: "Cards", count: data.cards.length },
    { name: "Menus", count: data.menus.length },
    { name: "Forms", count: data.forms.length },
  ];

  const hasData = chartData.some((item) => item.count > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-1">Content inventory</h3>
        <p className="text-gray-600 text-sm">Live counts from this organization</p>
      </div>

      {hasData ? (
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#666" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#3498db" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-gray-500 py-12 text-center">No content yet.</p>
      )}
    </motion.div>
  );
}
