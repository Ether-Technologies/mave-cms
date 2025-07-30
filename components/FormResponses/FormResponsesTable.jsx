// components/FormResponses/FormResponsesTable.jsx

import React, { useState } from "react";
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

  // Check if user is admin
  const isAdmin = currentUser?.role_id === "1";

  // Handle Delete Action
  const handleDelete = async (id) => {
    if (!isAdmin) {
      message.error("You don't have permission to delete responses");
      return;
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Type",
      dataIndex: "form_type",
      key: "form_type",
      width: 100,
      render: (formType) => renderFormTypeTag(formType),
    },
    {
      title: "Name",
      dataIndex: ["form_data", "name"],
      key: "name",
      render: (text) => text || "N/A",
    },
    {
      title: "Position",
      dataIndex: ["form_data", "type"],
      key: "position",
      render: (text, record) =>
        record.form_type === "career" ? text || "N/A" : "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedResponse(record);
              setViewDrawerVisible(true);
            }}
          />
          {isAdmin && (
            <>
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedResponse(record);
                  setEditDrawerVisible(true);
                }}
              />
              <Popconfirm
                title="Are you sure you want to delete this response?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button icon={<DeleteOutlined />} danger />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={responses}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />

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
      {isAdmin && (
        <EditResponseDrawer
          visible={editDrawerVisible}
          onClose={() => setEditDrawerVisible(false)}
          data={selectedResponse}
          onUpdate={refreshData}
        />
      )}
    </>
  );
};

export default FormResponsesTable;
