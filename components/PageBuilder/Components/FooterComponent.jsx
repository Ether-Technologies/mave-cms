// components/PageBuilder/Components/FooterComponent.jsx

import React, { useState } from "react";
import { Button, Typography, Image, Popconfirm } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  ExportOutlined,
  CopyFilled,
  DragOutlined,
} from "@ant-design/icons";
import FooterSelectionModal from "../Modals/FooterSelectionModal";

const { Paragraph } = Typography;

const FooterComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [footerData, setFooterData] = useState(component._mave);

  const handleSelectFooter = (selectedFooter) => {
    updateComponent({
      ...component,
      _mave: selectedFooter,
      id: selectedFooter.id,
    });
    setFooterData(selectedFooter);
    setIsModalVisible(false);
  };

  const handleDelete = () => {
    deleteComponent();
  };

  console.log("Footer Component", footerData);

  if (preview) {
    return (
      <div className="preview-footer-component p-4 bg-gray-100 rounded-md">
        {footerData ? (
          <div className="p-4 border rounded-md bg-white">
            {/* <Paragraph strong>{footerData.page_name_en}</Paragraph> */}
            <h2 className="text-xl font-semibold text-theme">
              {footerData.page_name_en}
            </h2>
            {footerData.logo && (
              <Image
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${footerData.logo.file_path}`}
                alt="Footer Logo"
                width={100}
                preview={false}
              />
            )}
            {/* You can display more footer details if available */}
          </div>
        ) : (
          <p className="text-gray-500">No footer selected.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">Footer Component</h3>
        </div>
        <div>
          {footerData && (
            <Button
              icon={<ExportOutlined />}
              onClick={() => setIsModalVisible(true)}
              className="mavebutton"
            >
              Change
            </Button>
          )}
          <Button
            icon={<CopyFilled />}
            onClick={onDuplicateElement}
            className="mavebutton"
          />
          <Popconfirm
            title="Are you sure you want to delete this component?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} className="mavecancelbutton" />
          </Popconfirm>
        </div>
      </div>
      {footerData ? (
        <div className="p-4 border rounded-md">
          <Paragraph strong>{footerData.page_name_en}</Paragraph>
          {footerData.logo && (
            <Image
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${footerData.logo.file_path}`}
              alt="Footer Logo"
              width={100}
              preview={false}
            />
          )}
          {/* You can display more footer details if available */}
        </div>
      ) : (
        <Button
          icon={<PlusOutlined />}
          type="dashed"
          onClick={() => setIsModalVisible(true)}
          className="mavebutton w-fit"
        >
          Select Footer
        </Button>
      )}
      <FooterSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectFooter={handleSelectFooter}
      />
    </div>
  );
};

export default FooterComponent;
