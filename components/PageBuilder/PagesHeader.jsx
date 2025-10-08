// components/PageBuilder/PagesHeader.jsx

import {
  CloseCircleFilled,
  CopyOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  LayoutOutlined,
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
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-lg border border-gray-200/50 p-6 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Left Section - Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div
                className="border-2 border-gray-200 bg-gradient-to-br from-yellow-50 via-purple-50 to-teal-50 rounded-2xl p-3.5 hover:bg-gradient-to-br hover:from-yellow-100 hover:via-purple-100 hover:to-teal-100 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:scale-105 transform"
                onClick={() => router.push("/build-with-ai")}
              >
                <Image
                  src="/icons/mave/forms.svg"
                  width={30}
                  height={30}
                  alt={title}
                  className="w-7.5 h-7.5"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {title}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-amber-50 px-3 py-1.5 rounded-full border border-yellow-200 hover:shadow-sm transition-all">
                  <FileTextOutlined className="text-yellow-600 text-xs" />
                  <Badge
                    count={totalPages}
                    showZero
                    className="[&_.ant-badge-count]:bg-yellow-500 [&_.ant-badge-count]:text-white [&_.ant-badge-count]:text-xs [&_.ant-badge-count]:min-w-[20px] [&_.ant-badge-count]:h-5 [&_.ant-badge-count]:leading-5 [&_.ant-badge-count]:shadow-sm"
                  />
                  <span className="text-xs font-medium text-yellow-700 ml-1">
                    Pages
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-violet-50 px-3 py-1.5 rounded-full border border-purple-200 hover:shadow-sm transition-all">
                  <AppstoreOutlined className="text-purple-600 text-xs" />
                  <Badge
                    count={totalSubpages}
                    showZero
                    className="[&_.ant-badge-count]:bg-purple-500 [&_.ant-badge-count]:text-white [&_.ant-badge-count]:text-xs [&_.ant-badge-count]:min-w-[20px] [&_.ant-badge-count]:h-5 [&_.ant-badge-count]:leading-5 [&_.ant-badge-count]:shadow-sm"
                  />
                  <span className="text-xs font-medium text-purple-700 ml-1">
                    Subpages
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-teal-50 to-cyan-50 px-3 py-1.5 rounded-full border border-teal-200 hover:shadow-sm transition-all">
                  <LayoutOutlined className="text-teal-600 text-xs" />
                  <Badge
                    count={totalFooters}
                    showZero
                    className="[&_.ant-badge-count]:bg-teal-500 [&_.ant-badge-count]:text-white [&_.ant-badge-count]:text-xs [&_.ant-badge-count]:min-w-[20px] [&_.ant-badge-count]:h-5 [&_.ant-badge-count]:leading-5 [&_.ant-badge-count]:shadow-sm"
                  />
                  <span className="text-xs font-medium text-teal-700 ml-1">
                    Footers
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-3">
            {createMode ? (
              <Button
                icon={<CloseCircleFilled />}
                onClick={onCancelCreate}
                className="h-11 px-6 bg-gradient-to-r from-red-50 to-rose-50 text-red-600 hover:from-red-100 hover:to-rose-100 hover:text-red-700 border-2 border-red-200 hover:border-red-300 font-semibold shadow-sm hover:shadow-md transition-all rounded-xl"
                size="large"
              >
                Cancel Create
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  icon={<PlusCircleOutlined />}
                  className="h-11 px-6 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white border-0 font-semibold shadow-md hover:shadow-xl transition-all rounded-xl"
                  onClick={onCreate}
                  size="large"
                >
                  Create Page
                </Button>
                <Button
                  icon={<PlusCircleOutlined />}
                  className="h-11 px-6 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white border-0 font-semibold shadow-md hover:shadow-xl transition-all rounded-xl"
                  onClick={onFooterCreate}
                  size="large"
                >
                  Create Footer
                </Button>
                <Tooltip title="Refresh Data">
                  <Button
                    icon={<ReloadOutlined />}
                    className="h-11 w-11 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 hover:text-gray-800 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all rounded-xl hover:rotate-180"
                    onClick={handleRefresh}
                    size="large"
                  />
                </Tooltip>
                <Tooltip title="Copy API Endpoint">
                  <Button
                    icon={<CopyOutlined />}
                    className="h-11 w-11 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 hover:text-gray-800 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all rounded-xl"
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
      <div className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl shadow-md border border-gray-200/50 p-6 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Controls - Sorting and Filtering */}
          <div className="flex items-center gap-6">
            {/* Sort Control */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Sort:</span>
              <div className="flex items-center bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-1 shadow-sm border border-gray-200">
                <Button
                  type={sortType === "desc" ? "primary" : "text"}
                  size="small"
                  onClick={() => setSortType("desc")}
                  className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
                    sortType === "desc"
                      ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-md"
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
                      ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white"
                  }`}
                >
                  Oldest First
                </Button>
              </div>
            </div>

            {/* Filter Control */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">
                Filter:
              </span>
              <Dropdown
                menu={{
                  items: filterMenuItems,
                  onClick: ({ key }) => handleFilter(key),
                }}
                placement="bottomLeft"
              >
                <Button
                  icon={<FilterOutlined />}
                  className="h-10 px-5 bg-gradient-to-r from-white to-gray-50 text-gray-700 hover:text-yellow-600 font-semibold border-2 border-gray-200 rounded-xl hover:border-yellow-300 hover:shadow-md transition-all"
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
              <span className="text-sm font-semibold text-gray-700">Show:</span>
              <Select
                defaultValue="20"
                className="w-24 [&_.ant-select-selector]:h-10 [&_.ant-select-selector]:border-2 [&_.ant-select-selector]:border-gray-200 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:shadow-sm [&_.ant-select-selector]:bg-gradient-to-r [&_.ant-select-selector]:from-white [&_.ant-select-selector]:to-gray-50 hover:[&_.ant-select-selector]:border-gray-300 [&_.ant-select-selector]:font-medium"
                onChange={onShowChange}
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
                className="w-full lg:w-80 h-10 border-2 border-gray-200 rounded-xl shadow-sm bg-gradient-to-r from-white to-gray-50 hover:border-gray-300 focus:border-yellow-400 transition-all [&_.ant-input]:bg-transparent [&_.ant-input]:font-medium [&_.ant-input]:placeholder:text-gray-400"
                allowClear
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                prefix={<SearchOutlined className="text-gray-500" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagesHeader;
