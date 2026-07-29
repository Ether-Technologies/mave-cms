// components/cards/CardsHeader.jsx

import React from "react";
import { Button, Input, message, Select, Switch, Tooltip, Badge } from "antd";
import {
  PlusCircleOutlined,
  FilterOutlined,
  SearchOutlined,
  CopyOutlined,
  ReloadOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const { Option } = Select;

const CardsHeader = ({
  onAddCard,
  sortType,
  setSortType,
  itemsPerPage,
  onItemsPerPageChange,
  onSearch,
  uniqueTags,
  selectedTag,
  handleTagFilterChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-lg border border-gray-200/50 p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="border-2 border-gray-200 bg-gradient-to-br from-blue-50 via-amber-50 to-orange-50 rounded-2xl p-3.5 hover:bg-gradient-to-br hover:from-blue-100 hover:via-amber-100 hover:to-orange-100 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:scale-105 transform">
                <Image
                  src="/icons/mave/cards.svg"
                  width={30}
                  height={30}
                  alt="Card Items"
                  className="w-7.5 h-7.5"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-brand to-brand-dark rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Cards
              </h2>
              {uniqueTags && uniqueTags.length > 0 && (
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-blue-50 px-3 py-1.5 rounded-full border border-blue-200 hover:shadow-sm transition-all">
                    <TagsOutlined className="text-brand-dark text-xs" />
                    <Badge
                      count={uniqueTags.length}
                      showZero
                      className="[&_.ant-badge-count]:bg-brand [&_.ant-badge-count]:text-white [&_.ant-badge-count]:text-xs [&_.ant-badge-count]:min-w-[20px] [&_.ant-badge-count]:h-5 [&_.ant-badge-count]:leading-5 [&_.ant-badge-count]:shadow-sm"
                    />
                    <span className="text-xs font-medium text-blue-700 ml-1">
                      Tags
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button
              icon={<PlusCircleOutlined />}
              onClick={onAddCard}
              className="h-11 px-6 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-blue-600 text-white border-0 font-semibold shadow-md hover:shadow-xl transition-all rounded-xl"
              size="large"
            >
              Create Card
            </Button>
            <Tooltip title="Copy API Endpoint">
              <Button
                icon={<CopyOutlined />}
                className="h-11 w-11 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 hover:text-gray-800 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all rounded-xl"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/cards`
                  );
                  message.success("API Endpoint copied to clipboard");
                }}
                size="large"
              />
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl shadow-md border border-gray-200/50 p-6 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Controls - Sorting */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Sort:</span>
            <div className="flex items-center bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-1 shadow-sm border border-gray-200">
              <Button
                type={sortType === "desc" ? "primary" : "text"}
                size="small"
                onClick={() => setSortType("desc")}
                className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
                  sortType === "desc"
                    ? "bg-gradient-to-r from-brand to-brand-dark text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white"
                }`}
              >
                Newest First
              </Button>
              <Button
                type={sortType === "asc" ? "primary" : "text"}
                size="small"
                onClick={() => setSortType("asc")}
                className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
                  sortType === "asc"
                    ? "bg-gradient-to-r from-brand to-brand-dark text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white"
                }`}
              >
                Oldest First
              </Button>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4 w-full lg:w-auto flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Show:</span>
              <Select
                value={itemsPerPage}
                className="w-24 [&_.ant-select-selector]:h-10 [&_.ant-select-selector]:border-2 [&_.ant-select-selector]:border-gray-200 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:shadow-sm [&_.ant-select-selector]:bg-gradient-to-r [&_.ant-select-selector]:from-white [&_.ant-select-selector]:to-gray-50 hover:[&_.ant-select-selector]:border-gray-300 [&_.ant-select-selector]:font-medium"
                onChange={onItemsPerPageChange}
                showSearch
              >
                <Option value={12}>12</Option>
                <Option value={24}>24</Option>
                <Option value={48}>48</Option>
                <Option value={100}>100</Option>
              </Select>
            </div>

            <Select
              placeholder="Filter by tag"
              allowClear
              showSearch
              className="w-44 [&_.ant-select-selector]:h-10 [&_.ant-select-selector]:border-2 [&_.ant-select-selector]:border-gray-200 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:shadow-sm [&_.ant-select-selector]:bg-gradient-to-r [&_.ant-select-selector]:from-white [&_.ant-select-selector]:to-gray-50 hover:[&_.ant-select-selector]:border-gray-300 [&_.ant-select-selector]:font-medium"
              value={selectedTag}
              onChange={handleTagFilterChange}
            >
              {uniqueTags.map((tag) => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
            </Select>

            <div className="flex-1 lg:flex-none">
              <Input
                placeholder="Search cards by title..."
                className="w-full lg:w-80 h-10 border-2 border-gray-200 rounded-xl shadow-sm bg-gradient-to-r from-white to-gray-50 hover:border-gray-300 focus:border-brand transition-all [&_.ant-input]:bg-transparent [&_.ant-input]:font-medium [&_.ant-input]:placeholder:text-gray-400"
                allowClear
                onChange={(e) => onSearch(e.target.value)}
                prefix={<SearchOutlined className="text-gray-500" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsHeader;
