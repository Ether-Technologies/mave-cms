import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = ({ value, onChange, resultCount }) => (
  <div className="relative">
    <Input
      placeholder="Search components..."
      prefix={<SearchOutlined className="text-gray-400" />}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg"
      size="large"
      allowClear
    />
    {value && (
      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {resultCount} results
      </span>
    )}
  </div>
);

export default SearchBar;
