// components/FormResponses/FormResponsesTable.jsx

import React, { useState, useMemo } from "react";
import { Table, Button, Popconfirm, Space, message, Tag, Select } from "antd";
import { EditOutlined, DownloadOutlined } from "@ant-design/icons";
import ViewDetailsDrawer from "./ViewDetailsDrawer";
import EditResponseDrawer from "./EditResponseDrawer";
import instance from "../../axios";
import moment from "moment";

const FormResponsesTable = ({ responses, refreshData, currentUser }) => {
  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);

  // All users can delete responses - no admin check needed

  // Handle Delete Action
  const handleDelete = async (id, event) => {
    // Prevent any form submission or page refresh
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const response = await instance.delete(`/form-submission/${id}`);
      if (response.status === 200) {
        message.success("Form response deleted successfully.");
        refreshData();
      } else {
        message.error("Failed to delete the form response.");
      }
    } catch (error) {
      console.error("Error deleting form response:", error);
      message.error("An error occurred while deleting the form response.");
    }
  };

  // Handle Status Change
  const handleStatusChange = async (id, currentStatus) => {
    // Current status is already normalized to lowercase from getCurrentStatus
    const newStatus = currentStatus === "pending" ? "resolved" : "pending";

    try {
      const response = await instance.put(`/form-submission/${id}`, {
        status: newStatus,
      });
      if (response.status === 200) {
        message.success(`Form response marked as ${newStatus}.`);
        refreshData();
      } else {
        message.error("Failed to update the form response status.");
      }
    } catch (error) {
      console.error("Error updating form response status:", error);
      message.error(
        "An error occurred while updating the form response status."
      );
    }
  };

  // Function to format time range
  const formatTimeRange = (callTime) => {
    if (!Array.isArray(callTime) || callTime.length !== 2) return "N/A";
    return `${moment(callTime[0], "HH:mm").format("hh:mm A")} - ${moment(
      callTime[1],
      "HH:mm"
    ).format("hh:mm A")}`;
  };

  // Function to get CV URL
  const getCvUrl = (mediaList) => {
    if (mediaList?.cv?.file_path) {
      return `${process.env.NEXT_PUBLIC_MEDIA_URL}/${mediaList.cv.file_path}`;
    }
    return null;
  };

  // Function to handle CV download
  const handleDownloadCV = (mediaList) => {
    const cvUrl = getCvUrl(mediaList);
    if (cvUrl) {
      window.open(cvUrl, "_blank");
    } else {
      message.error("CV file not available");
    }
  };

  // Function to render form type tag
  const renderFormTypeTag = (formType) => {
    const tagColors = {
      career: "yellow",
      contact: "green",
      default: "default",
    };

    return (
      <Tag color={tagColors[formType] || tagColors.default}>
        {formType?.toUpperCase() || "UNKNOWN"}
      </Tag>
    );
  };

  // Function to render status tag
  const renderStatusTag = (status) => {
    const statusColors = {
      pending: "orange",
      resolved: "green",
    };

    return (
      <Tag color={statusColors[status?.toLowerCase()] || "default"}>
        {status?.toUpperCase() || "PENDING"}
      </Tag>
    );
  };

  // Function to get current status from root status field only (default to pending)
  const getCurrentStatus = (formData, record) => {
    // Only check root status field, ignore form_data.status completely
    const rootStatus = record?.status;

    // Return root status normalized to lowercase, or default to pending
    const status = rootStatus || "pending";
    const normalizedStatus = status?.toLowerCase();
    return normalizedStatus;
  };

  // Function to get all unique field names from form responses
  const getAllFieldNames = (responses) => {
    const fieldNames = new Set();
    responses.forEach((response) => {
      if (response.form_data && typeof response.form_data === "object") {
        Object.keys(response.form_data).forEach((key) => {
          fieldNames.add(key);
        });
      }
    });
    return Array.from(fieldNames);
  };

  // Function to render field value
  const renderFieldValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    if (typeof value === "string" && value.length > 50) {
      return value.substring(0, 50) + "...";
    }
    return value;
  };

  // Generate dynamic columns based on form data
  const generateColumns = useMemo(() => {
    if (!responses || responses.length === 0) {
      return [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          width: 80,
        },
        {
          title: "Actions",
          key: "actions",
          render: (_, record) => (
            <Space size="middle">
              <Button
                className="mavecancelbutton"
                onClick={() => {
                  setSelectedResponse(record);
                  setViewDrawerVisible(true);
                }}
              >
                View Details
              </Button>
              <Popconfirm
                title="Are you sure you want to delete this response?"
                onConfirm={(e) => handleDelete(record.id, e)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true, type: "button" }}
              >
                <Button
                  danger
                  type="button"
                  onClick={(e) => e.preventDefault()}
                >
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          ),
        },
      ];
    }

    const fieldNames = getAllFieldNames(responses);
    const baseColumns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 80,
        fixed: "left",
      },
      {
        title: "Status",
        key: "status",
        width: 200,
        render: (_, record) => {
          const currentStatus = getCurrentStatus(record.form_data, record);
          return (
            <Space>
              {renderStatusTag(currentStatus)}
              <Popconfirm
                title={`Mark as ${currentStatus === "pending" ? "Resolved" : "Pending"}?`}
                onConfirm={() => handleStatusChange(record.id, currentStatus)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ type: "button" }}
              >
                <Button
                  size="small"
                  style={{
                    minWidth: "60px",
                    backgroundColor: "var(--theme)",
                    color: "white",
                    borderColor: "var(--theme)",
                  }}
                >
                  Update
                </Button>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];

    const actionColumn = {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            className="mavebutton"
            onClick={() => {
              setSelectedResponse(record);
              setViewDrawerVisible(true);
            }}
            title="View Details"
            size="small"
          >
            View Details
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this response?"
            onConfirm={(e) => handleDelete(record.id, e)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true, type: "button" }}
          >
            <Button
              className="mavecancelbutton"
              danger
              title="Delete Response"
              type="button"
              size="small"
              onClick={(e) => e.preventDefault()}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    };

    return [...baseColumns, actionColumn];
  }, [responses]);

  const columns = generateColumns;

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">
        <div className="p-0">
          <Table
            dataSource={responses}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} responses`,
              className: "px-6 py-4",
            }}
            scroll={{ x: 800 }}
            size="middle"
            className="modern-table"
            rowClassName="hover:bg-gray-800 transition-colors duration-200"
          />
        </div>
      </div>

      {/* View Details Drawer */}
      <ViewDetailsDrawer
        visible={viewDrawerVisible}
        onClose={() => setViewDrawerVisible(false)}
        data={selectedResponse?.form_data}
        mediaList={selectedResponse?.media_list}
        formType={selectedResponse?.form_type}
        currentUser={currentUser}
        onEdit={() => {
          setViewDrawerVisible(false);
          setEditDrawerVisible(true);
        }}
      />

      {/* Edit Response Drawer */}
      <EditResponseDrawer
        visible={editDrawerVisible}
        onClose={() => setEditDrawerVisible(false)}
        data={selectedResponse}
        onUpdate={refreshData}
      />
    </>
  );
};

export default FormResponsesTable;
