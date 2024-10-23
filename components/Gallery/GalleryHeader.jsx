// components/Gallery/GalleryHeader.jsx

import React from "react";
import { Button, Input, Select, Space, Switch } from "antd";
import {
  PlusCircleOutlined,
  FilterOutlined,
  CopyOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const { Option } = Select;

const GalleryHeader = ({
  onCreate,
  onFilter,
  onSearch,
  onItemsPerPageChange,
  itemsPerPage,
  handleFilter,
  sortType,
  setSortType,
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 border-b-4 border-gray-300 px-6 pt-8 pb-4">
        <div className="flex items-center gap-4">
          <div className=" border-2 border-gray-300 bg-white rounded-md py-2 px-3">
            <Image
              src="/icons/mave/gallery.svg"
              width={24}
              height={24}
              alt="Menu Items"
              className="w-6"
            />
          </div>
          <h2 className="text-2xl font-semibold">Gallery</h2>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button
            icon={<PlusCircleOutlined />}
            onClick={onCreate}
            className="mavebutton"
          >
            Add Media
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 mb-4 px-3 py-1">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-500">Sort By:</h2>
          <Switch
            checkedChildren="Last"
            unCheckedChildren="First"
            checked={sortType === "asc"}
            onChange={(checked) => setSortType(checked ? "asc" : "desc")}
          />
        </div>
        <div className="flex justify-end items-center gap-5">
          <label>Items per page:</label>
          <Select
            defaultValue={itemsPerPage}
            onChange={onItemsPerPageChange}
            style={{ width: 120 }}
          >
            <Option value={12}>12</Option>
            <Option value={24}>24</Option>
            <Option value={48}>48</Option>
            <Option value={100}>100</Option>
          </Select>
          <Button
            icon={<FilterOutlined />}
            className="bg-white text-gray-500 font-semibold text-lg py-5 shadow-md border-2 border-gray-300 w-fit"
            onClick={handleFilter}
          >
            Filter
          </Button>

          <Input
            placeholder="Search media by title..."
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => onSearch(e.target.value)}
            className="w-48 md:w-72 h-11 border-2 border-gray-300 rounded-md"
          />
        </div>
      </div>
    </>
  );
};

export default GalleryHeader;