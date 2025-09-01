import React, { useState, useEffect } from "react";
import {
  Table,
  Avatar,
  Button,
  Input,
  Popconfirm,
  message,
  Tag,
  Space,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import PackageEditModal from "./PackageEditModal";
import PackageViewModal from "./PackageViewModal";
import { packageApi } from "../../../../utils/packageApi";

const { Search } = Input;

const PackagesTable = ({ packages, fetchPackages, setPackages, currentUser, loading }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [filteredPackages, setFilteredPackages] = useState(packages);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Allow users with role_id "1" (admin) or "2" to edit/delete packages
  const canEditDelete = currentUser?.role_id === "1" || currentUser?.role_id === "2";

  useEffect(() => {
    setFilteredPackages(packages);
  }, [packages]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = packages.filter((pkg) =>
      pkg.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPackages(filtered);
  };

  const handleEditPackage = (pkg) => {
    setSelectedPackage(pkg);
    setIsEditModalVisible(true);
  };

  const handleViewPackage = (pkg) => {
    setSelectedPackage(pkg);
    setIsViewModalVisible(true);
  };

  const handleDeletePackage = async (id) => {
    try {
      const response = await packageApi.delete(id);
      if (response.success) {
        message.success("Package deleted successfully");
        fetchPackages();
      } else {
        message.error(response.message || "Failed to delete package");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Failed to delete package");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select packages to delete");
      return;
    }

    setBulkLoading(true);
    try {
      const response = await packageApi.bulkDelete(selectedRowKeys);
      if (response.every(res => res.success)) {
        message.success(`${selectedRowKeys.length} packages deleted successfully`);
        setSelectedRowKeys([]);
        fetchPackages();
      } else {
        message.error("Some packages could not be deleted");
      }
    } catch (error) {
      console.error("Error bulk deleting packages:", error);
      message.error("Failed to delete selected packages");
    } finally {
      setBulkLoading(false);
    }
  };

  const formatPrice = (price, currency) => {
    const currencySymbols = {
      'BDT': '৳',
      'USD': '$'
    };
    return `${currencySymbols[currency] || currency} ${parseFloat(price).toFixed(2)}`;
  };

  const getPartialPaymentInfo = (pkg) => {
    if (!pkg.partial_payment_allowed) {
      return <Tag color="red">Full Payment</Tag>;
    }

    if (pkg.partial_payment_type === 'fixed') {
      return (
        <Tooltip title={`Partial payment: ${formatPrice(pkg.partial_payment_amount, pkg.currency)}`}>
          <Tag color="green">Partial (Fixed)</Tag>
        </Tooltip>
      );
    } else if (pkg.partial_payment_type === 'percentage') {
      return (
        <Tooltip title={`Partial payment: ${pkg.partial_payment_percentage}%`}>
          <Tag color="blue">Partial (${pkg.partial_payment_percentage}%)</Tag>
        </Tooltip>
      );
    }

    return <Tag color="orange">Partial</Tag>;
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (image) => (
        <Avatar
          src={image || "/images/ui/default-package.png"}
          style={{ width: 50, height: 50, border: "2px solid var(--theme)" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <span style={{ fontWeight: 500, fontSize: "14px" }}>{name}</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (desc) => (
        <span style={{
          fontSize: "12px",
          color: "#666",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          maxWidth: "300px"
        }}>
          {desc}
        </span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price, record) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: "14px" }}>
            {formatPrice(price, record.currency)}
          </div>
          <div style={{ fontSize: "11px", color: "#666" }}>
            {record.currency}
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category, record) => (
        <div>
          {category ? (
            <Tag color="blue">{category.name}</Tag>
          ) : (
            <Tag color="default">#{record.category_id}</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Payment",
      key: "payment",
      width: 100,
      render: (_, record) => getPartialPaymentInfo(record),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      width: 100,
      render: (created_at) => (
        <span style={{ fontSize: "12px", color: "#666" }}>
          {new Date(created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewPackage(record)}
            style={{ backgroundColor: "var(--theme)", color: "white" }}
            size="small"
          />
          {canEditDelete && (
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditPackage(record)}
              style={{
                backgroundColor: "transparent",
                color: "var(--theme)",
                border: "2px solid var(--theme)",
              }}
              size="small"
            />
          )}
          {canEditDelete && (
            <Popconfirm
              title="Are you sure to delete this package?"
              description="This action cannot be undone."
              onConfirm={() => handleDeletePackage(record.id)}
              onCancel={() => message.info("Package not deleted")}
              okText="Yes, Delete"
              cancelText="Cancel"
              okType="danger"
            >
              <Button icon={<DeleteOutlined />} danger size="small" />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Search bar and bulk actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          padding: "16px",
          backgroundColor: "#fafafa",
          borderRadius: "8px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Search
            placeholder="Search packages by name..."
            allowClear
            enterButton={<SearchOutlined />}
            style={{ width: 300 }}
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Button
            onClick={() => {
              setFilteredPackages(packages);
              setSearchTerm("");
              message.success("Filters cleared");
            }}
          >
            Reset
          </Button>
        </div>
        
        {canEditDelete && selectedRowKeys.length > 0 && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ color: "#666" }}>
              {selectedRowKeys.length} package(s) selected
            </span>
            <Popconfirm
              title={`Delete ${selectedRowKeys.length} package(s)?`}
              description="This action cannot be undone."
              onConfirm={handleBulkDelete}
              onCancel={() => message.info("Bulk delete cancelled")}
              okText="Yes, Delete All"
              cancelText="Cancel"
              okType="danger"
            >
              <Button 
                danger 
                loading={bulkLoading}
                icon={<DeleteOutlined />}
              >
                Delete Selected
              </Button>
            </Popconfirm>
          </div>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={filteredPackages}
        rowKey="id"
        rowSelection={canEditDelete ? {
          selectedRowKeys,
          onChange: setSelectedRowKeys,
          getCheckboxProps: (record) => ({
            disabled: false,
          }),
        } : undefined}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} packages`,
        }}
        loading={loading}
        scroll={{ x: 1200 }}
      />

      {/* Modals */}
      {packages && (
        <>
          <PackageEditModal
            visible={isEditModalVisible}
            pkg={selectedPackage}
            onCancel={() => setIsEditModalVisible(false)}
            fetchPackages={fetchPackages}
            currentUser={currentUser}
          />
          <PackageViewModal
            visible={isViewModalVisible}
            pkg={selectedPackage}
            onCancel={() => setIsViewModalVisible(false)}
            onEdit={() => handleEditPackage(selectedPackage)}
            currentUser={currentUser}
          />
        </>
      )}
    </div>
  );
};

export default PackagesTable;
