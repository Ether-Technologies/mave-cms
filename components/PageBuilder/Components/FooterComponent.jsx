// components/PageBuilder/Components/FooterComponent.jsx

import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Image,
  Popconfirm,
  Space,
  Tooltip,
  Drawer,
  Switch,
  Divider,
  Modal,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  CopyFilled,
  DragOutlined,
  SettingOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import FooterSelectionModal from "../Modals/FooterSelectionModal";
import ComponentRenderer from "./ComponentRenderer";
import instance from "../../../axios";

const { Paragraph, Text } = Typography;

const FooterComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [footerData, setFooterData] = useState(component._mave);
  const [selectedFooterData, setSelectedFooterData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [footerConfig, setFooterConfig] = useState({
    showLogo: true,
    showSocialLinks: true,
    showContactInfo: true,
    showCopyright: true,
  });

  useEffect(() => {
    setFooterData(component._mave);
  }, [component._mave]);

  const handleSelectFooter = (selectedFooter) => {
    setSelectedFooterData(selectedFooter);
    setIsModalVisible(false);
    setIsEditing(true);
  };

  const handleSubmit = () => {
    if (!selectedFooterData) {
      Modal.error({
        title: "Validation Error",
        content: "No footer selected.",
      });
      return;
    }

    updateComponent({
      ...component,
      _mave: {
        ...selectedFooterData,
        config: footerConfig,
      },
      id: selectedFooterData.id,
    });
    setFooterData(selectedFooterData);
    setSelectedFooterData(null);
    setIsEditing(false);
    message.success("Footer updated successfully.");
  };

  const handleCancel = () => {
    setSelectedFooterData(null);
    setIsEditing(false);
    message.info("Footer update canceled.");
  };

  const handleDelete = () => {
    deleteComponent();
  };

  const renderFooterContent = (footer) => {
    if (!footer?.body?.[0]?.data) return null;

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-theme">
          {footer.page_name_en}
        </h2>
        {footer.body[0].data.map((comp, index) => (
          <ComponentRenderer
            key={comp._id || index}
            component={comp}
            index={index}
            sectionIndex={0}
            preview={true}
          />
        ))}
      </div>
    );
  };

  if (preview) {
    return (
      <div className="preview-footer-component p-4 bg-gray-100 rounded-md">
        {footerData ? (
          <div className="p-4 border rounded-md bg-white">
            {renderFooterContent(footerData)}
          </div>
        ) : (
          <p className="text-gray-500">No footer selected.</p>
        )}
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">Footer Component</h3>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Space>
              {footerData && (
                <Tooltip title="Change Footer">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setIsModalVisible(true)}
                    className="mavebutton"
                  />
                </Tooltip>
              )}
              <Tooltip title="Duplicate">
                <Button
                  icon={<CopyFilled />}
                  onClick={onDuplicateElement}
                  className="mavebutton"
                />
              </Tooltip>
              <Popconfirm
                title="Are you sure you want to delete this component?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Delete">
                  <Button
                    icon={<DeleteOutlined />}
                    className="mavecancelbutton"
                  />
                </Tooltip>
              </Popconfirm>
            </Space>
          ) : (
            <Space>
              <Tooltip title="Save Changes">
                <Button
                  icon={<CheckOutlined />}
                  onClick={handleSubmit}
                  className="mavebutton"
                />
              </Tooltip>
              <Tooltip title="Cancel">
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  className="mavecancelbutton"
                />
              </Tooltip>
            </Space>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-4">
        <div
          className={`flex flex-col ${isEditing && selectedFooterData ? "w-full md:w-1/2" : "w-full"}`}
        >
          {footerData && isEditing && (
            <h4 className="mb-2 text-md font-semibold">Current Footer</h4>
          )}
          {footerData ? (
            <div className="w-full p-4 border rounded-md bg-white">
              {renderFooterContent(footerData)}
            </div>
          ) : (
            <Button
              icon={<EditOutlined />}
              onClick={() => setIsModalVisible(true)}
              className="mavebutton w-fit"
            >
              Select Footer
            </Button>
          )}
        </div>

        {isEditing && selectedFooterData && (
          <div className="flex flex-col w-full md:w-1/2">
            <h4 className="mb-2 text-md font-semibold">Selected Footer</h4>
            <div className="w-full p-4 border rounded-md bg-white">
              {renderFooterContent(selectedFooterData)}
            </div>
          </div>
        )}
      </div>

      <FooterSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectFooter={handleSelectFooter}
      />

      <Drawer
        title="Footer Configuration"
        placement="right"
        onClose={() => setShowConfig(false)}
        open={showConfig}
        width={400}
        extra={
          <Space>
            <Button type="primary" onClick={() => setShowConfig(false)}>
              Save
            </Button>
          </Space>
        }
      >
        <div className="space-y-6 p-4">
          <div>
            <Paragraph strong className="text-lg">
              Display Settings
            </Paragraph>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Paragraph className="font-medium mb-0">Show Logo</Paragraph>
                  <Paragraph type="secondary" className="text-xs mb-0">
                    Display the footer logo
                  </Paragraph>
                </div>
                <Switch
                  checked={footerConfig.showLogo}
                  onChange={(checked) =>
                    setFooterConfig({ ...footerConfig, showLogo: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Paragraph className="font-medium mb-0">
                    Show Social Links
                  </Paragraph>
                  <Paragraph type="secondary" className="text-xs mb-0">
                    Display social media links
                  </Paragraph>
                </div>
                <Switch
                  checked={footerConfig.showSocialLinks}
                  onChange={(checked) =>
                    setFooterConfig({
                      ...footerConfig,
                      showSocialLinks: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Paragraph className="font-medium mb-0">
                    Show Contact Info
                  </Paragraph>
                  <Paragraph type="secondary" className="text-xs mb-0">
                    Display contact information
                  </Paragraph>
                </div>
                <Switch
                  checked={footerConfig.showContactInfo}
                  onChange={(checked) =>
                    setFooterConfig({
                      ...footerConfig,
                      showContactInfo: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Paragraph className="font-medium mb-0">
                    Show Copyright
                  </Paragraph>
                  <Paragraph type="secondary" className="text-xs mb-0">
                    Display copyright information
                  </Paragraph>
                </div>
                <Switch
                  checked={footerConfig.showCopyright}
                  onChange={(checked) =>
                    setFooterConfig({ ...footerConfig, showCopyright: checked })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default FooterComponent;
