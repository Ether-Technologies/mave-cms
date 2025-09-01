import React, { useState, useEffect } from "react";
import { Table, Tag, Input, Button, Space, message } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

const CustomersTable = ({ customers, loading, fetchCustomers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState(customers);

  useEffect(() => {
    setFilteredCustomers(customers);
  }, [customers]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = customers.filter((cust) =>
      cust.name.toLowerCase().includes(value.toLowerCase()) ||
      cust.email.toLowerCase().includes(value.toLowerCase()) ||
      cust.phone?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredCustomers(customers);
    message.success("Search reset");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role) => <Tag>{role}</Tag>,
    },
  ];

  return (
    <div style={{ marginTop: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
          padding: "16px",
          backgroundColor: "#fafafa",
          borderRadius: "8px",
        }}
      >
        <Input.Search
          placeholder="Search by name, email, or phone"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
          allowClear
          enterButton={<SearchOutlined />}
          style={{ width: 300 }}
        />
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchCustomers}>
            Reload
          </Button>
          <Button onClick={handleReset}>Reset</Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={filteredCustomers}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default CustomersTable;
