import React from "react";
import { Select, Button, Input, Space, Tooltip } from "antd";
import {
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Search } = Input;

const MediaFilters = ({
  filterType,
  onFilterChange,
  sortOrder,
  onSortChange,
  searchQuery,
  onSearchChange,
  onRefresh,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Space>
        <Select
          value={filterType}
          onChange={onFilterChange}
          style={{ width: 120 }}
          suffixIcon={<FilterOutlined />}
        >
          <Option value="all">All Types</Option>
          <Option value="image">Images</Option>
          <Option value="video">Videos</Option>
          <Option value="document">Documents</Option>
        </Select>
        <Tooltip title={sortOrder === "desc" ? "Newest First" : "Oldest First"}>
          <Button
            icon={
              sortOrder === "desc" ? (
                <SortDescendingOutlined />
              ) : (
                <SortAscendingOutlined />
              )
            }
            onClick={() => onSortChange(sortOrder === "desc" ? "asc" : "desc")}
          />
        </Tooltip>
      </Space>
      <Space>
        <Search
          placeholder="Search media..."
          value={searchQuery}
          onChange={onSearchChange}
          allowClear
          className="w-64"
        />
        <Tooltip title="Refresh">
          <Button
            icon={<SyncOutlined />}
            onClick={onRefresh}
            className="mavebutton"
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default MediaFilters;
