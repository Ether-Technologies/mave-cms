// components/FormResponses/FormResponsesTable.jsx

import React, { useState, useMemo } from "react";
import { Table, Button, Popconfirm, Space, message, Tag } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
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
          width: 150,
          render: (_, record) => (
            <Space size="middle">
              <Button
                className="mavecancelbutton"
                icon={<EyeOutlined />}
                onClick={() => {
                  setSelectedResponse(record);
                  setViewDrawerVisible(true);
                }}
              />
              <Popconfirm
                title="Are you sure you want to delete this response?"
                onConfirm={(e) => handleDelete(record.id, e)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true, type: "button" }}
              >
                <Button
                  className="mavecancelbutton"
                  icon={<DeleteOutlined />}
                  danger
                  type="button"
                  onClick={(e) => e.preventDefault()}
                />
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
    ];

    // Add dynamic columns for form fields (max 2 for responsiveness - total 3 columns: ID + 2 fields + Actions)
    const dynamicColumns = fieldNames.slice(0, 2).map((fieldName) => ({
      title: fieldName,
      dataIndex: ["form_data", fieldName],
      key: fieldName,
      render: (text) => renderFieldValue(text),
      ellipsis: true,
    }));

    const actionColumn = {
      title: "Actions",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="mavebutton"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedResponse(record);
              setViewDrawerVisible(true);
            }}
            title="View Details"
          />
          <Popconfirm
            title="Are you sure you want to delete this response?"
            onConfirm={(e) => handleDelete(record.id, e)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true, type: "button" }}
          >
            <Button
              className="mavecancelbutton"
              icon={<DeleteOutlined />}
              danger
              title="Delete Response"
              type="button"
              onClick={(e) => e.preventDefault()}
            />
          </Popconfirm>
        </Space>
      ),
    };

    return [...baseColumns, ...dynamicColumns, actionColumn];
  }, [responses]);

  const columns = generateColumns;

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-4 border-b border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 flex items-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
            Form Responses
          </h3>
        </div>

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
            rowClassName="hover:bg-orange-50 transition-colors duration-200"
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
