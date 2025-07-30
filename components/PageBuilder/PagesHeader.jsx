// components/PageBuilder/PagesHeader.jsx

import {
  CloseCircleFilled,
  CopyOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Switch,
  Select,
  Tooltip,
  message,
  Badge,
  Dropdown,
} from "antd";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const PagesHeader = ({
  onSearch,
  onCreate,
  onFooterCreate,
  createMode,
  onCancelCreate,
  sortType,
  setSortType,
  onShowChange,
  handleFilter,
  onRefresh,
  title = "Pages",
  totalPages = 0,
  totalSubpages = 0,
  totalFooters = 0,
}) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value) => {
    setSearchValue(value);
    onSearch(value);
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
      message.success("Data refreshed successfully");
    }
  };

  const filterMenuItems = [
    {
      key: "all",
      label: "All Pages",
      icon: <SettingOutlined />,
    },
    {
      key: "pages",
      label: "Pages Only",
      icon: <SettingOutlined />,
    },
    {
      key: "subpages",
      label: "Subpages Only",
      icon: <SettingOutlined />,
    },
    {
      key: "footers",
      label: "Footers Only",
      icon: <SettingOutlined />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Left Section - Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="border-2 border-gray-200 bg-gradient-to-br from-yellow-50 to-purple-50 rounded-xl p-3 hover:bg-gradient-to-br hover:from-yellow-100 hover:to-purple-100 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => router.push("/build-with-ai")}
              >
                <Image
                  src="/icons/mave/forms.svg"
                  width={28}
                  height={28}
                  alt={title}
                  className="w-7 h-7"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                {title}
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <Badge count={totalPages} className="bg-yellow-500" />
                <span className="text-sm text-gray-500">Pages</span>
                <Badge count={totalSubpages} className="bg-purple-500" />
                <span className="text-sm text-gray-500">Subpages</span>
                <Badge count={totalFooters} className="bg-teal-500" />
                <span className="text-sm text-gray-500">Footers</span>
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-3">
            {createMode ? (
              <Button
                icon={<CloseCircleFilled />}
                onClick={onCancelCreate}
                className="h-10 px-6 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200 font-medium"
                size="large"
              >
                Cancel Create
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  icon={<PlusCircleOutlined />}
                  className="h-10 px-6 bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500 hover:border-yellow-600 font-medium shadow-sm"
                  onClick={onCreate}
                  size="large"
                >
                  Create Page
                </Button>
                <Button
                  icon={<PlusCircleOutlined />}
                  className="h-10 px-6 bg-teal-600 hover:bg-teal-700 text-white border-teal-600 hover:border-teal-700 font-medium shadow-sm"
                  onClick={onFooterCreate}
                  size="large"
                >
                  Create Footer
                </Button>
                <Tooltip title="Refresh Data">
                  <Button
                    icon={<ReloadOutlined />}
                    className="h-10 w-10 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200"
                    onClick={handleRefresh}
                    size="large"
                  />
                </Tooltip>
                <Tooltip title="Copy API Endpoint">
                  <Button
                    icon={<CopyOutlined />}
                    className="h-10 w-10 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/pages`
                      );
                      message.success("API Endpoint copied to clipboard");
                    }}
                    size="large"
                  />
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Controls - Sorting and Filtering */}
          <div className="flex items-center gap-6">
            {/* Sort Control */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Sort:</span>
              <div className="flex items-center bg-gray-50 rounded-lg p-1">
                <Button
                  type={sortType === "desc" ? "primary" : "text"}
                  size="small"
                  onClick={() => setSortType("desc")}
                  className={`px-3 ${sortType === "desc" ? "bg-yellow-500 text-white" : "text-gray-600"}`}
                >
                  Newest First
                </Button>
                <Button
                  type={sortType === "asc" ? "primary" : "text"}
                  size="small"
                  onClick={() => setSortType("asc")}
                  className={`px-3 ${sortType === "asc" ? "bg-yellow-500 text-white" : "text-gray-600"}`}
                >
                  Oldest First
                </Button>
              </div>
            </div>

            {/* Filter Control */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Filter:</span>
              <Dropdown
                menu={{
                  items: filterMenuItems,
                  onClick: ({ key }) => handleFilter(key),
                }}
                placement="bottomLeft"
              >
                <Button
                  icon={<FilterOutlined />}
                  className="h-9 px-4 bg-white text-gray-600 font-medium border-2 border-gray-200 rounded-lg hover:border-yellow-300 hover:text-yellow-500 transition-colors"
                >
                  Filter
                </Button>
              </Dropdown>
            </div>
          </div>

          {/* Right Controls - Items per page and Search */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            {/* Items per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Show:</span>
              <Select
                defaultValue="20"
                className="w-20 h-9 border-2 border-gray-200 rounded-lg"
                onChange={onShowChange}
                size="small"
              >
                <Select.Option value="10">10</Select.Option>
                <Select.Option value="20">20</Select.Option>
                <Select.Option value="50">50</Select.Option>
                <Select.Option value="100">100</Select.Option>
                <Select.Option value="200">200</Select.Option>
              </Select>
            </div>

            {/* Search */}
            <div className="flex-1 lg:flex-none">
              <Input
                placeholder="Search pages, subpages, footers..."
                className="w-full lg:w-80 h-9 border-2 border-gray-200 rounded-lg"
                allowClear
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                prefix={<SearchOutlined className="text-gray-400" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagesHeader;
