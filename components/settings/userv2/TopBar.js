import React from "react";
import { Row, Col, Select, Button, Input, Popconfirm, Checkbox } from "antd";
import {
  FilterOutlined,
  DeleteOutlined,
  CheckOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const TopBar = ({
  selectedRowKeys,
  onSearch,
  onDelete,
  setIsFilterDrawerVisible,
  onSelectAll,
  users,
}) => {
  const isAllSelected =
    selectedRowKeys.length > 0 && selectedRowKeys.length === users.length;

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 5fr",
          alignItems: "center",
          borderBottom: "1px solid #f0f0f0",
          padding: "1rem 0",
        }}
      >
        <Button
          icon={<CheckOutlined />}
          style={{
            marginRight: "1rem",
            backgroundColor: isAllSelected ? "gray" : "var(--maveyellow)",
            color: "white",
            fontSize: "1rem",
            fontWeight: 500,
            width: "fit-content",
          }}
          onClick={onSelectAll}
        >
          {isAllSelected ? "Deselect All" : "Select All"}
        </Button>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <Select defaultValue="10" style={{ width: "fit-content" }} showSearch>
            <Option value="10">10 Rows</Option>
            <Option value="20">20 Rows</Option>
            <Option value="30">30 Rows</Option>
          </Select>
          <Button
            icon={<FilterOutlined />}
            onClick={() => setIsFilterDrawerVisible(true)}
            style={{ width: "fit-content" }}
          >
            Filter
          </Button>
          <Popconfirm
            title="Are you sure to delete selected users?"
            onConfirm={onDelete}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              disabled={!selectedRowKeys.length}
              style={{ width: "fit-content" }}
            >
              Delete
            </Button>
          </Popconfirm>
          <Input.Search
            placeholder="Search by name"
            onChange={(e) => onSearch(e.target.value)}
            style={{ width: "fit-content" }}
          />
        </div>
      </div>
    </>
  );
};

export default TopBar;
