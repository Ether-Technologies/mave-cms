// components/PageBuilder/Components/AccordionComponent.jsx

import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Typography,
  message,
  Collapse,
  Space,
  Tooltip,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AccordionSelectionModal from "../Modals/AccordionSelectionModal/AccordionSelectionModal";
import RichTextEditor from "../../RichTextEditor";

const { Panel } = Collapse;
const { Title, Text } = Typography;

const getColorValue = (colorObj) => {
  if (!colorObj) return "#ffffff";
  if (typeof colorObj === "string") return colorObj;
  if (colorObj.metaColor) {
    const { r, g, b, a } = colorObj.metaColor;
    // Convert RGB to hex
    const toHex = (n) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  return "#ffffff";
};

const AccordionComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [accordionData, setAccordionData] = useState(component._mave || []);
  const [activeKeys, setActiveKeys] = useState([]);

  useEffect(() => {
    setAccordionData(component._mave || []);
  }, [component._mave]);

  const handleSelectAccordion = (newAccordionData) => {
    updateComponent({
      ...component,
      _mave: newAccordionData,
      id: component._id,
    });
    setAccordionData(newAccordionData);
    setIsModalVisible(false);
    message.success("Accordion updated successfully");
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Accordion Component",
      content:
        "Are you sure you want to delete this accordion component? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: deleteComponent,
    });
  };

  const handleContentChange = (content, index) => {
    const newData = accordionData.map((item, i) => {
      if (i === index) {
        return { ...item, content };
      }
      return item;
    });
    updateComponent({
      ...component,
      _mave: newData,
      id: component._id,
    });
    setAccordionData(newData);
  };

  const renderPanels = (data) => {
    return data?.map((item, index) => {
      const headerBg = getColorValue(item.style?.headerBg);
      const headerTextColor = getColorValue(item.style?.headerTextColor);
      const contentBg = getColorValue(item.style?.contentBg);
      const contentTextColor = getColorValue(item.style?.contentTextColor);
      const borderColor = getColorValue(item.style?.borderColor);
      const borderRadius = item.style?.borderRadius || "8px";

      return (
        <Panel
          header={
            <div className="flex items-center justify-between w-full">
              <div
                className="flex-1"
                style={{
                  backgroundColor: headerBg,
                  color: headerTextColor,
                  padding: "12px 16px",
                  borderRadius: borderRadius,
                  border: `1px solid ${borderColor}`,
                }}
              >
                <Text strong className="text-lg">
                  {item.title}
                </Text>
              </div>
            </div>
          }
          key={index}
          forceRender
          className="mb-2"
          style={{
            backgroundColor: contentBg,
            color: contentTextColor,
            borderRadius: borderRadius,
            border: `1px solid ${borderColor}`,
          }}
        >
          <div className="pl-4">
            {item.contentType === "text" ? (
              <div className="accordion-content">
                <RichTextEditor
                  defaultValue={item.content}
                  onChange={(content) => handleContentChange(content, index)}
                  editMode={!preview}
                />
              </div>
            ) : item.contentType === "accordion" ? (
              <AccordionComponent
                component={{ _mave: item.nestedAccordion }}
                updateComponent={(updatedNested) => {
                  const newData = [...accordionData];
                  newData[index].nestedAccordion = updatedNested._mave;
                  updateComponent({ ...component, _mave: newData });
                }}
                deleteComponent={() => {
                  const newData = [...accordionData];
                  newData.splice(index, 1);
                  updateComponent({ ...component, _mave: newData });
                }}
                preview={preview}
              />
            ) : null}
          </div>
        </Panel>
      );
    });
  };

  if (preview) {
    return (
      <div className="preview-accordion-component p-6 bg-white rounded-lg shadow-sm">
        <Collapse
          accordion
          activeKey={activeKeys}
          onChange={(key) => setActiveKeys([key])}
          className="accordion-collapse"
          expandIconPosition="right"
          bordered={false}
        >
          {renderPanels(accordionData)}
        </Collapse>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header with Component Title and Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={4} className="mb-1">
            Accordion Component
          </Title>
          <Text type="secondary" className="text-sm">
            {accordionData.length}{" "}
            {accordionData.length === 1 ? "item" : "items"}
          </Text>
        </div>
        <Space>
          <Tooltip title="Edit Component">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsModalVisible(true)}
              className="flex items-center"
              disabled={preview}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete Component">
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              danger
              disabled={preview}
            />
          </Tooltip>
        </Space>
      </div>

      {/* Accordion Display */}
      <Collapse
        accordion
        activeKey={activeKeys}
        onChange={(key) => setActiveKeys([key])}
        className="accordion-collapse"
        expandIconPosition="right"
        bordered={false}
      >
        {renderPanels(accordionData)}
      </Collapse>

      {/* Empty State */}
      {accordionData.length === 0 && (
        <div className="text-center py-8">
          <PlusOutlined className="text-4xl text-gray-300 mb-4" />
          <Text type="secondary" className="block">
            No accordion items added yet
          </Text>
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            className="mt-4"
          >
            Add Items
          </Button>
        </div>
      )}

      {/* Accordion Selection Modal */}
      {!preview && (
        <AccordionSelectionModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSelectAccordion={handleSelectAccordion}
          initialData={accordionData}
        />
      )}
    </div>
  );
};

export default AccordionComponent;
