// components/PageBuilder/PageCard.jsx

import {
  DeleteFilled,
  EditOutlined,
  CopyOutlined,
  CaretRightOutlined,
  CaretDownOutlined,
  EyeOutlined,
  CalendarOutlined,
  FileTextOutlined,
  LayoutOutlined,
  GlobalOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { Button, Card, Popconfirm, Tooltip, Badge } from "antd";
import React, { useState, useEffect } from "react";
import PageInfoDisplay from "./PageInfoDisplay";
import PageEditForm from "./PageEditForm";

const TYPE_CONFIG = {
  Event: { icon: <CalendarOutlined />, color: "#1890ff", bgColor: "#e6f7ff" },
  Blog: { icon: <FileTextOutlined />, color: "#52c41a", bgColor: "#f6ffed" },
  Footer: { icon: <LayoutOutlined />, color: "#722ed1", bgColor: "#f9f0ff" },
  Page: { icon: <GlobalOutlined />, color: "#fa8c16", bgColor: "#fff7e6" },
  Subpage: { icon: <BookOutlined />, color: "#eb2f96", bgColor: "#fff0f6" },
  Unknown: { icon: <FileTextOutlined />, color: "#8c8c8c", bgColor: "#f5f5f5" },
};

const ACTION_BUTTONS = [
  { key: "preview", icon: <EyeOutlined />, color: "blue", text: "Preview" },
  { key: "edit", icon: <EditOutlined />, color: "green", text: "Edit" },
  {
    key: "duplicate",
    icon: <CopyOutlined />,
    color: "purple",
    text: "Duplicate",
  },
];

const PageCard = ({
  page,
  handleExpand,
  expandedPageId,
  handleDeletePage,
  handleEditPageInfo,
  handleDuplicatePage,
  handlePreviewPage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [type, setType] = useState("Page");

  useEffect(() => {
    setType(page?.type || "Unknown");
  }, [page?.type]);

  const isExpanded = expandedPageId === page.id;
  const typeConfig = TYPE_CONFIG[type] || TYPE_CONFIG.Unknown;
  const truncateText = (text, maxLength = 25) =>
    text?.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text || "";

  const handleAction = (action) => {
    switch (action) {
      case "preview":
        handlePreviewPage(page.id);
        break;
      case "edit":
        setIsEditing(true);
        break;
      case "duplicate":
        handleDuplicatePage(page.id);
        break;
      default:
        break;
    }
  };

  const confirmEdit = (updatedData) => {
    handleEditPageInfo(updatedData);
    setIsEditing(false);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r from-gray-100/50 to-gray-200/50 rounded-xl transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
      />

      <Card
        className={`relative w-full transition-all duration-300 ease-in-out rounded-xl overflow-hidden ${
          isExpanded
            ? "shadow-xl border-2 border-gray-300 bg-gradient-to-br from-white to-gray-200/30"
            : "shadow-md hover:shadow-xl border border-gray-100 hover:border-gray-300"
        } ${isHovered ? "transform scale-[1.02]" : "transform scale-100"}`}
        bodyStyle={{ padding: 0 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: typeConfig.bgColor,
                  color: typeConfig.color,
                  border: `1px solid ${typeConfig.color}20`,
                }}
              >
                <span className="text-xs">{typeConfig.icon}</span>
                <span>{type}</span>
              </div>

              <Badge
                count={`ID-${page.id}`}
                style={{
                  backgroundColor: "#f0f0f0",
                  color: "#666",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              />

              <div className="flex flex-col">
                <Tooltip title={page.page_name_en} placement="top">
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-gray-800 transition-colors cursor-pointer">
                    {truncateText(page.page_name_en, 30)}
                  </h3>
                </Tooltip>
                {page.page_name_bn && (
                  <span className="text-sm text-gray-500 mt-1">
                    {truncateText(page.page_name_bn, 25)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Tooltip title="Preview Page" placement="top">
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => handlePreviewPage(page.id)}
                  className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-200 hover:text-gray-800 transition-all duration-200"
                  style={{ border: "1px solid #e5e7eb" }}
                />
              </Tooltip>

              <Tooltip
                title={isExpanded ? "Collapse" : "Expand"}
                placement="top"
              >
                <Button
                  type="text"
                  icon={
                    isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />
                  }
                  onClick={() => handleExpand(page.id)}
                  className={`h-10 w-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                    isExpanded
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-200"
                      : "hover:bg-gray-100 hover:text-gray-600"
                  }`}
                  style={{ border: "1px solid #e5e7eb" }}
                />
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-6 bg-white">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                {isEditing ? (
                  <PageEditForm
                    page={page}
                    onSubmit={confirmEdit}
                    onCancel={() => setIsEditing(false)}
                  />
                ) : (
                  <PageInfoDisplay page={page} />
                )}
              </div>

              {!isEditing && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                  {ACTION_BUTTONS.map(({ key, icon, color, text }) => (
                    <Tooltip key={key} title={`${text} Page`} placement="top">
                      <Button
                        icon={icon}
                        onClick={() => handleAction(key)}
                        className={`h-10 px-6 rounded-lg font-medium transition-all duration-200 bg-${color}-50 text-${color}-600 hover:bg-${color}-100 hover:text-${color}-700 border-${color}-200`}
                      >
                        {text}
                      </Button>
                    </Tooltip>
                  ))}

                  <Popconfirm
                    title="Delete this page?"
                    description="This action cannot be undone. Are you sure you want to delete this page?"
                    onConfirm={() => handleDeletePage(page.id)}
                    okText="Yes, Delete"
                    cancelText="Cancel"
                    okButtonProps={{
                      className: "bg-gray-200 hover:bg-gray-200 border-gray-400",
                      danger: true,
                    }}
                    cancelButtonProps={{ className: "border-gray-300" }}
                  >
                    <Tooltip title="Delete Page" placement="top">
                      <Button
                        icon={<DeleteFilled />}
                        danger
                        className="h-10 px-6 rounded-lg font-medium transition-all duration-200 bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-800 border-gray-400"
                      >
                        Delete
                      </Button>
                    </Tooltip>
                  </Popconfirm>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PageCard;
