import React, { useState } from "react";
import {
  Input,
  Switch,
  Button,
  Select,
  Modal,
  Form,
  Tooltip,
  message,
  Badge,
} from "antd";
import {
  CheckCircleFilled,
  CopyOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const { Option } = Select;

const MenuItemsHeader = ({
  onAddMenuItem,
  searchTerm,
  setSearchTerm,
  sortType,
  setSortType,
  onShowChange,
  handleSelectAll,
  allSelected,
  filterOptions,
  applyFilters,
  resetFilters,
  onRefresh,
  itemCount,
}) => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [form] = Form.useForm();

  const openFilterModal = () => setIsFilterModalVisible(true);
  const closeFilterModal = () => setIsFilterModalVisible(false);

  const onFinish = (values) => {
    applyFilters(values);
    closeFilterModal();
  };

  const handleResetFilters = () => {
    form.resetFields();
    resetFilters();
    closeFilterModal();
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard
      .writeText(`${process.env.NEXT_PUBLIC_API_BASE_URL}/menuitems`)
      .then(() => message.success("API Endpoint copied to clipboard"));
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
      message.success("Data refreshed successfully");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-lg border border-gray-200/50 p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="border-2 border-gray-200 bg-gradient-to-br from-blue-50 via-amber-50 to-orange-50 rounded-2xl p-3.5 hover:bg-gradient-to-br hover:from-blue-100 hover:via-amber-100 hover:to-orange-100 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:scale-105 transform">
                <Image
                  src="/icons/mave/menuitems.svg"
                  width={30}
                  height={30}
                  alt="Menu Items"
                  className="w-7.5 h-7.5"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-brand to-brand-dark rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Menu Items
              </h2>
              {typeof itemCount === "number" && (
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-blue-50 px-3 py-1.5 rounded-full border border-blue-200 hover:shadow-sm transition-all">
                    <Badge
                      count={itemCount}
                      showZero
                      className="[&_.ant-badge-count]:bg-brand [&_.ant-badge-count]:text-white [&_.ant-badge-count]:text-xs [&_.ant-badge-count]:min-w-[20px] [&_.ant-badge-count]:h-5 [&_.ant-badge-count]:leading-5 [&_.ant-badge-count]:shadow-sm"
                    />
                    <span className="text-xs font-medium text-blue-700 ml-1">
                      {itemCount === 1 ? "Item" : "Items"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button
              icon={<PlusCircleOutlined />}
              onClick={onAddMenuItem}
              className="h-11 px-6 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-blue-600 text-white border-0 font-semibold shadow-md hover:shadow-xl transition-all rounded-xl"
              size="large"
            >
              Create Menu Item
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
                onClick={handleCopyEndpoint}
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
          <div className="flex items-center gap-6 flex-wrap">
            <Button
              icon={<CheckCircleFilled />}
              className="h-10 px-5 bg-gradient-to-r from-white to-gray-50 text-gray-700 hover:text-brand-dark font-semibold border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
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
                    ? "bg-gradient-to-r from-brand to-brand-dark text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white"
                    }`}
                >
                  DESC
                </Button>
                <Button
                  type={sortType === "asc" ? "primary" : "text"}
                  size="small"
                  onClick={() => setSortType("asc")}
                  className={`px-4 py-1.5 rounded-lg font-medium transition-all ${sortType === "asc"
                    ? "bg-gradient-to-r from-brand to-brand-dark text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white"
                    }`}
                >
                  ASC
                </Button>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4 w-full lg:w-auto flex-wrap">
            <div className="flex items-center gap-2">
              <Select
                defaultValue="10"
                onChange={onShowChange}
                className="w-24 [&_.ant-select-selector]:h-10 [&_.ant-select-selector]:border-2 [&_.ant-select-selector]:border-gray-200 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:shadow-sm [&_.ant-select-selector]:bg-gradient-to-r [&_.ant-select-selector]:from-white [&_.ant-select-selector]:to-gray-50 hover:[&_.ant-select-selector]:border-gray-300 [&_.ant-select-selector]:font-medium"
                showSearch
              >
                <Option value="10">10</Option>
                <Option value="20">20</Option>
                <Option value="30">30</Option>
              </Select>
            </div>

            <Button
              icon={<FilterOutlined />}
              className="h-10 px-5 bg-gradient-to-r from-white to-gray-50 text-gray-700 hover:text-brand-dark font-semibold border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
              onClick={openFilterModal}
            >
              Filter
            </Button>

            <div className="flex-1 lg:flex-none">
              <Input
                placeholder="Search (e.g. Home)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:w-80 h-10 border-2 border-gray-200 rounded-xl shadow-sm bg-gradient-to-r from-white to-gray-50 hover:border-gray-300 focus:border-brand transition-all [&_.ant-input]:bg-transparent [&_.ant-input]:font-medium [&_.ant-input]:placeholder:text-gray-400"
                allowClear
                prefix={<SearchOutlined className="text-gray-500" />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <Modal
        title="Filter Menu Items"
        open={isFilterModalVisible}
        onCancel={closeFilterModal}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ parent_id: undefined }}
        >
          {filterOptions?.parentMenus && (
            <Form.Item label="Parent Menu" name="parent_id">
              <Select placeholder="Select a Parent Menu" allowClear showSearch>
                {filterOptions.parentMenus.map((menu) => (
                  <Option key={menu.id} value={menu.id}>
                    {menu.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleResetFilters} className="mavecancelbutton">
              Reset
            </Button>
            <Button type="primary" htmlType="submit" className="mavebutton">
              Apply
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuItemsHeader;
