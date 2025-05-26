import React from "react";
import { Tooltip, Badge } from "antd";
import Image from "next/image";
import { StarOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const ComponentCard = ({ component, viewMode, onSelect }) => {
  return (
    <Tooltip
      title={
        <div className="p-2 text-gray-800">
          <p className="font-medium">{component.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {component.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      }
      placement="right"
      color="white"
      overlayInnerStyle={{
        backgroundColor: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        borderRadius: "8px",
      }}
    >
      <motion.div
        className={`relative flex ${
          viewMode === "grid"
            ? "flex-col items-center"
            : "flex-row items-center space-x-3"
        } cursor-pointer border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-lg transition-all duration-300 bg-white group w-full`}
        onClick={() => onSelect(component.type)}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {component.premium && (
          <motion.div
            className="absolute top-1 right-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Badge
              count={
                <div className="z-20 flex items-center bg-gradient-to-r from-theme to-themedark text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  <StarOutlined className="mr-1" />
                  Pro
                </div>
              }
            />
          </motion.div>
        )}
        <div
          className={`${viewMode === "grid" ? "w-10 h-10" : "w-8 h-8"} relative flex-shrink-0`}
        >
          <Image
            src={component.icon}
            alt={component.name}
            width={viewMode === "grid" ? 40 : 32}
            height={viewMode === "grid" ? 40 : 32}
            className="object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div
          className={`${viewMode === "grid" ? "mt-1 text-center" : "min-w-0"} flex-1`}
        >
          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-theme transition-colors truncate">
            {component.name}
          </h3>
          {viewMode === "list" && (
            <p className="text-xs text-gray-500 line-clamp-2">
              {component.description}
            </p>
          )}
        </div>
      </motion.div>
    </Tooltip>
  );
};

export default ComponentCard;
