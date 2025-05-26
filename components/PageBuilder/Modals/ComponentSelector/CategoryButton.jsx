import React from "react";
import { motion } from "framer-motion";

const CategoryButton = ({ category, isSelected, onClick }) => (
  <motion.button
    key={category.id}
    onClick={onClick}
    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
      isSelected
        ? "bg-theme text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <span className="font-bold text-md">{category.name}</span>
  </motion.button>
);

export default CategoryButton;
