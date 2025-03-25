// components/PageBuilder/Components/ButtonComponent.jsx

import React, { useState, useEffect } from "react";
import { Button, Modal, Typography, message, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CopyFilled,
  DragOutlined,
} from "@ant-design/icons";
import ButtonSelectionModal from "../Modals/ButtonSelectionModal/ButtonSelectionModal";
import { useRouter } from "next/router";

const { Paragraph } = Typography;

const ButtonComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [buttonData, setButtonData] = useState(component._mave || {});
  const router = useRouter();

  useEffect(() => {
    setButtonData(component._mave || {});
  }, [component._mave]);

  const handleSelectButton = (newButtonData) => {
    updateComponent({
      ...component,
      _mave: newButtonData,
      id: component._id,
    });
    setButtonData(newButtonData);
    setIsModalVisible(false);
    message.success("Button updated successfully.");
  };

  const handleDelete = () => {
    deleteComponent();
  };

  const handleButtonClick = () => {
    if (buttonData.action?.type === "internal_link" && buttonData.action.url) {
      router.push(buttonData.action.url);
    } else if (
      buttonData.action?.type === "external_link" &&
      buttonData.action.url
    ) {
      window.open(buttonData.action.url, "_blank");
    } else if (
      buttonData.action?.type === "action" &&
      buttonData.action.customScript
    ) {
      try {
        // eslint-disable-next-line no-eval
        eval(buttonData.action.customScript);
      } catch (error) {
        message.error("Error executing custom script.");
      }
    }
  };

  const getButtonIcon = () => {
    if (buttonData.icon) {
      const IconComponent = require("@ant-design/icons")[buttonData.icon];
      return IconComponent ? <IconComponent /> : null;
    }
    return null;
  };

  if (preview) {
    return (
      <div className="preview-button-component p-4 bg-gray-100 rounded-md">
        {buttonData.text ? (
          <div style={{ textAlign: "left" }}>
            <Button
              className="mavebutton"
              icon={getButtonIcon()}
              onClick={handleButtonClick}
              aria-label={buttonData.text}
            >
              {buttonData.text}
            </Button>
          </div>
        ) : (
          <Paragraph className="text-gray-500">No button configured.</Paragraph>
        )}
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">Button Component</h3>
        </div>
        <div>
          <Button
            icon={<EditOutlined />}
            onClick={() => setIsModalVisible(true)}
            className="mavebutton"
          />
          <Button
            icon={<CopyFilled />}
            onClick={onDuplicateElement}
            className="mavebutton"
          />
          <Popconfirm
            title="Are you sure you want to delete this button?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} className="mavecancelbutton" />
          </Popconfirm>
        </div>
      </div>

      {buttonData.text ? (
        <div style={{ textAlign: "left" }}>
          <Button
            className="mavebutton"
            icon={getButtonIcon()}
            onClick={handleButtonClick}
            aria-label={buttonData.text}
          >
            {buttonData.text}
          </Button>
        </div>
      ) : (
        <Paragraph>No button configured.</Paragraph>
      )}

      <ButtonSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectButton={handleSelectButton}
        initialButton={buttonData}
      />
    </div>
  );
};

export default ButtonComponent;
