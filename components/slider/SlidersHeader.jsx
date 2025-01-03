import React from "react";
import { Input, Button, Tooltip, message, Select } from "antd";
import {
  CopyOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const { Option } = Select;

const SlidersHeader = ({
  onAddSlider,
  searchTerm,
  onSearchChange,
  sortType,
  setSortType,
  // NEW PROPS for tag filtering
  allTags,
  selectedTag,
  setSelectedTag,
}) => {
  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 border-b-4 border-gray-300 px-6 pt-8 pb-4">
        <div className="flex items-center gap-4">
          <div className="border-2 border-gray-300 bg-white rounded-md py-2 px-3">
            <Image
              src="/icons/mave/slider.svg"
              width={24}
              height={24}
              alt="Sliders"
              className="w-6"
            />
          </div>
          <h2 className="text-2xl font-semibold">Sliders</h2>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button
            icon={<PlusCircleOutlined />}
            onClick={onAddSlider}
            className="mavebutton"
          >
            Create Slider
          </Button>
          <Tooltip title="Copy API Endpoint">
            <Button
              icon={<CopyOutlined />}
              className="mavecancelbutton"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/sliders`
                );
                message.success("API Endpoint copied to clipboard");
              }}
            />
          </Tooltip>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 px-3 py-1">
        <div className="flex items-center gap-4">
          {/* Sorting Controls */}
          <h2 className="text-lg font-semibold text-gray-500">Sort By:</h2>
          <Button
            onClick={() => setSortType("asc")}
            className={`${sortType === "asc" ? "mavebutton" : "mavecancelbutton"}`}
          >
            Newest
          </Button>
          <Button
            onClick={() => setSortType("desc")}
            className={`${sortType === "desc" ? "mavebutton" : "mavecancelbutton"}`}
          >
            Oldest
          </Button>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-5 mt-4 md:mt-0">
          {/* NEW: Filter by Tags */}
          <Select
            allowClear
            showSearch
            placeholder="Filter by Tag"
            style={{ width: 200 }}
            value={selectedTag || undefined}
            onChange={(value) => setSelectedTag(value || "")}
          >
            {allTags.map((tag) => (
              <Option key={tag} value={tag}>
                {tag}
              </Option>
            ))}
          </Select>

          {/* Search Input */}
          <Input
            placeholder="Search Sliders"
            value={searchTerm}
            onChange={onSearchChange}
            className="w-48 md:w-72 h-11 border-2 border-gray-300 rounded-md"
            allowClear
            prefix={<SearchOutlined />}
          />
        </div>
      </div>
    </>
  );
};

export default SlidersHeader;
