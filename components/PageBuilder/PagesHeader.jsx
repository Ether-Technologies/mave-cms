// components/PageBuilder/PagesHeader.jsx

import {
  CloseCircleFilled,
  CopyOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Switch, Select, Tooltip, message } from "antd";
import React from "react";
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
  title = "Pages",
}) => {
  const router = useRouter();

  return (
    <>
      {/* Top Header with Logo and Create/Cancel Button */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 border-b-2 border-gray-200 px-4 md:px-6 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <div
            className="border-2 border-gray-200 bg-white rounded-lg p-2 hover:bg-theme hover:border-theme transition-colors cursor-pointer"
            onClick={() => router.push("/build-with-ai")}
          >
            <Image
              src="/icons/mave/forms.svg"
              width={24}
              height={24}
              alt={title}
              className="w-6 h-6"
            />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {createMode ? (
            <Button
              icon={<CloseCircleFilled />}
              onClick={onCancelCreate}
              className="h-9 px-4 mavecancelbutton"
            >
              Cancel Create
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                icon={<PlusCircleOutlined />}
                className="h-9 px-4 mavebutton"
                onClick={onCreate}
              >
                Create {title.slice(0, -1)}
              </Button>
              <Tooltip title={`Copy ${title} API Endpoint`}>
                <Button
                  icon={<CopyOutlined />}
                  className="h-9 px-4 mavecancelbutton"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_API_BASE_URL}/pages?type=${title.slice(
                        0,
                        -1
                      )}`
                    );
                    message.success("API Endpoint copied to clipboard");
                  }}
                />
              </Tooltip>
            </div>
          )}
        </div>
      </div>

      {/* Sorting, Filtering, Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 px-4 md:px-6 py-3 bg-gray-50 rounded-lg">
        {/* Sorting */}
        <div className="flex items-center gap-3">
          <h2 className="text-base font-medium text-gray-600">Sort By:</h2>
          <Switch
            checkedChildren="Last"
            unCheckedChildren="First"
            checked={sortType === "asc"}
            onChange={(checked) => setSortType(checked ? "asc" : "desc")}
            className="bg-gray-200"
          />
        </div>

        {/* Actions: Select, Filter, Search */}
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <Select
            defaultValue="10"
            className="w-full md:w-32 h-9 border-2 border-gray-200 rounded-lg"
            onChange={onShowChange}
            showSearch
          >
            <Select.Option value="10">10</Select.Option>
            <Select.Option value="20">20</Select.Option>
            <Select.Option value="50">50</Select.Option>
            <Select.Option value="100">100</Select.Option>
            <Select.Option value="200">200</Select.Option>
          </Select>
          <Button
            icon={<FilterOutlined />}
            className="h-9 px-4 bg-white text-gray-600 font-medium border-2 border-gray-200 rounded-lg hover:border-theme hover:text-theme transition-colors"
            onClick={handleFilter}
          >
            Filter
          </Button>
          <Input
            placeholder={`Search ${title.slice(0, -1)}...`}
            className="w-full md:w-72 h-9 border-2 border-gray-200 rounded-lg"
            allowClear
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default PagesHeader;
