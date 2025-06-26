// components/PageBuilder/Modals/ComponentSelectorModal.jsx

import React, { useState, useMemo } from "react";
import { Drawer, Segmented } from "antd";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

// Import components
import ComponentCard from "./ComponentSelector/ComponentCard";
import CategoryButton from "./ComponentSelector/CategoryButton";
import SearchBar from "./ComponentSelector/SearchBar";

// Import constants and animations
import { componentOptions, categories } from "./ComponentSelector/constants";
import {
  containerVariants,
  itemVariants,
} from "./ComponentSelector/animations";

const ComponentSelectorModal = ({ isVisible, onClose, onSelectComponent }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const filteredComponents = useMemo(() => {
    return componentOptions.filter((component) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        component.name.toLowerCase().includes(searchLower) ||
        component.description.toLowerCase().includes(searchLower) ||
        (component.tags &&
          component.tags.some((tag) =>
            tag.toLowerCase().includes(searchLower)
          ));

      const matchesCategory =
        selectedCategory === "all"
          ? true
          : selectedCategory === "premium"
            ? component.premium
            : component.category.toLowerCase() === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleSelect = (componentType) => {
    onSelectComponent(componentType);
    onClose();
  };

  return (
    <Drawer
      title={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Select Component Type
            </h2>
            <Segmented
              options={[
                { value: "grid", icon: <AppstoreOutlined /> },
                { value: "list", icon: <UnorderedListOutlined /> },
              ]}
              value={viewMode}
              onChange={setViewMode}
              className="bg-gray-100 p-1 rounded-lg"
            />
          </div>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            resultCount={filteredComponents.length}
          />
          <div className="w-full overflow-hidden">
            <div
              className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                maxWidth: "100%",
              }}
            >
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                />
              ))}
            </div>
          </div>
        </div>
      }
      open={isVisible}
      onClose={onClose}
      placement="right"
      width="min(500px, 90vw)"
      className="component-selector-drawer"
      styles={{ body: { padding: "12px" } }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2" : "flex flex-col"} gap-4`}
      >
        <AnimatePresence>
          {filteredComponents.map((component) => (
            <motion.div
              key={component.type}
              variants={itemVariants}
              layout
              className="w-full"
            >
              <ComponentCard
                component={component}
                viewMode={viewMode}
                onSelect={handleSelect}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Drawer>
  );
};

export default ComponentSelectorModal;
