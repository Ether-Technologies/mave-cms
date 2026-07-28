// components/Menus/MenusHeader.js

import React from "react";
import { Input, Switch, Button, Select, message, Tooltip } from "antd";
import {
  CheckCircleFilled,
  CopyOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const MenusHeader = ({
  onAddMenu,
  searchTerm,
  setSearchTerm,
  sortType,
  setSortType,
  handleSelectAll,
  allSelected,
  onShowChange,
  handleReset,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-lg border border-gray-200/50 p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="border-2 border-gray-200 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-300 rounded-2xl p-3.5 hover:bg-gradient-to-br hover:from-gray-200 hover:via-gray-300 hover:to-gray-300 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:scale-105 transform">
                <Image
                  src="/icons/mave/menus.svg"
                  width={30}
                  height={30}
                  alt="Menus"
                  className="w-7.5 h-7.5"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-gray-200 to-gray-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Menus
            </h2>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button
              icon={<PlusCircleOutlined />}
              onClick={onAddMenu}
              className="h-11 px-6 bg-black hover:bg-gray-800 text-white border-0 font-semibold shadow-md hover:shadow-xl transition-all rounded-xl"
              size="large"
            >
              Create Menu
            </Button>
            <Tooltip title="Copy API Endpoint">
              <Button
                icon={<CopyOutlined />}
                className="h-11 w-11 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 hover:text-gray-800 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all rounded-xl"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/menus`
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
          {/* Left Controls */}
          <div className="flex items-center gap-6">
            <Button
              icon={<CheckCircleFilled />}
              className="h-10 px-5 bg-gradient-to-r from-white to-gray-50 text-gray-700 hover:text-gray-700 font-semibold border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-md transition-all"
              onClick={handleSelectAll}
            >
              {allSelected ? "Unselect All" : "Select All"}
            </Button>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Sort:</span>
              <div className="flex items-center bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-1 shadow-sm border border-gray-200">
                <Button
                  type={sortType === "desc" ? "primary" : "text"}
                  size="small"
                  onClick={() => setSortType("desc")}
                  className={`px-4 py-1.5 rounded-lg font-medium transition-all ${sortType === "desc"
                    ? "bg-black text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white"
                    }`}
                >
                  Newest
                </Button>
                <Button
                  type={sortType === "asc" ? "primary" : "text"}
                  size="small"
                  onClick={() => setSortType("asc")}
                  className={`px-4 py-1.5 rounded-lg font-medium transition-all ${sortType === "asc"
                    ? "bg-black text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white"
                    }`}
                >
                  Oldest
                </Button>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4 w-full lg:w-auto flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Show:</span>
              <Select
                defaultValue="10"
                className="w-24 [&_.ant-select-selector]:h-10 [&_.ant-select-selector]:border-2 [&_.ant-select-selector]:border-gray-200 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:shadow-sm [&_.ant-select-selector]:bg-gradient-to-r [&_.ant-select-selector]:from-white [&_.ant-select-selector]:to-gray-50 hover:[&_.ant-select-selector]:border-gray-300 [&_.ant-select-selector]:font-medium"
                onChange={onShowChange}
                showSearch
              >
                <Select.Option value="10">10</Select.Option>
                <Select.Option value="20">20</Select.Option>
                <Select.Option value="30">30</Select.Option>
              </Select>
            </div>

            <div className="flex-1 lg:flex-none">
              <Input
                placeholder="Search (e.g. Home)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:w-80 h-10 border-2 border-gray-200 rounded-xl shadow-sm bg-gradient-to-r from-white to-gray-50 hover:border-gray-300 focus:border-black transition-all [&_.ant-input]:bg-transparent [&_.ant-input]:font-medium [&_.ant-input]:placeholder:text-gray-400"
                allowClear
                prefix={<SearchOutlined className="text-gray-500" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenusHeader;
