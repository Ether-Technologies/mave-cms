// components/PageBuilder/Components/InfoBoxComponent/InfoBoxComponent.jsx

import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  Space,
  Modal,
  Form,
  Input,
  message,
  Typography,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import InfoBoxItem from "./InfoBoxItem";
import MediaSelectionModal from "../../Modals/MediaSelectionModal";
import Image from "next/image";

const { Option } = Select;
const { Paragraph } = Typography;

const InfoBoxComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
}) => {
  const [infoBox, setInfoBox] = useState({
    title: component._mave?.title || "",
    description: component._mave?.description || "",
    media: component._mave?.media || [],
    infoItems: component._mave?.infoItems || [],
  });
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [layout, setLayout] = useState(component._mave?.layout || "vertical");
  const [font, setFont] = useState(component._mave?.font || "Arial");
  const [color, setColor] = useState(component._mave?.color || "#000000");
  const [background, setBackground] = useState(
    component._mave?.background || "#ffffff"
  );
  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mediaSelectionMode, setMediaSelectionMode] = useState("multiple");

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    updateComponent({
      ...component,
      _mave: {
        ...infoBox,
        layout,
        font,
        color,
        background,
      },
    });
  }, [infoBox, layout, font, color, background, updateComponent, component]);

  // Handle adding a new info item
  const handleAddInfoItem = () => {
    if (!preview) {
      setIsAddModalVisible(true);
      form.resetFields();
      setSelectedMedia([]);
    }
  };

  const handleAddSubmit = (values) => {
    const newInfoItem = {
      id: Date.now(),
      title: values.title,
      description: values.description,
      media: selectedMedia,
    };
    setInfoBox({
      ...infoBox,
      infoItems: [...infoBox.infoItems, newInfoItem],
    });
    setIsAddModalVisible(false);
    message.success("Info item added successfully.");
  };

  // Handle editing an existing info item
  const handleEditInfoItem = (item) => {
    if (!preview) {
      setCurrentEdit(item);
      setIsEditModalVisible(true);
      editForm.setFieldsValue({
        title: item.title,
        description: item.description,
      });
      setSelectedMedia(item.media);
    }
  };

  const handleEditSubmit = (values) => {
    const updatedItem = {
      ...currentEdit,
      title: values.title,
      description: values.description,
      media: selectedMedia,
    };
    setInfoBox({
      ...infoBox,
      infoItems: infoBox.infoItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      ),
    });
    setIsEditModalVisible(false);
    setCurrentEdit(null);
    message.success("Info item updated successfully.");
  };

  // Handle deleting an info item
  const handleDeleteInfoItem = (id) => {
    if (!preview) {
      setInfoBox({
        ...infoBox,
        infoItems: infoBox.infoItems.filter((item) => item.id !== id),
      });
      message.success("Info item deleted successfully.");
    }
  };

  // Handle main media selection
  const handleMainMediaSelect = (media) => {
    console.log("Main media selected:", media);
    // Ensure media is an array
    const mediaArray = Array.isArray(media) ? media : [media];
    setInfoBox((prevInfoBox) => {
      const updatedInfoBox = {
        ...prevInfoBox,
        media: mediaArray,
      };
      console.log("Updated infoBox:", updatedInfoBox);
      return updatedInfoBox;
    });
    setIsMediaModalVisible(false);
    message.success("Main media updated successfully.");
  };

  // Handle media selection
  const handleSelectMedia = (media) => {
    console.log("Selected media:", media);
    // Ensure media is an array
    const mediaArray = Array.isArray(media) ? media : [media];
    setSelectedMedia(mediaArray);
    setIsMediaModalVisible(false);
    message.success("Media selected successfully.");
  };

  // Handle layout change
  const handleLayoutChange = (value) => {
    if (!preview) {
      setLayout(value);
    }
  };

  // Handle font change
  const handleFontChange = (value) => {
    if (!preview) {
      setFont(value);
    }
  };

  // Handle text color change
  const handleColorChange = (e) => {
    if (!preview) {
      setColor(e.target.value);
    }
  };

  // Handle background color change
  const handleBackgroundChange = (e) => {
    if (!preview) {
      setBackground(e.target.value);
    }
  };

  // Styles based on configuration
  const containerStyle = {
    fontFamily: font,
    color: color,
    backgroundColor: background,
    padding: "20px",
    borderRadius: "8px",
  };

  return (
    <div className="border p-4 rounded-md bg-gray-50">
      {!preview && (
        <Space direction="vertical" style={{ width: "100%" }}>
          {/* Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Info Box Component</h3>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddInfoItem}
              className="flex items-center"
              disabled={preview}
            >
              Add Info Item
            </Button>
          </div>

          {/* Configuration Options */}
          <div className="flex flex-wrap gap-4 mb-4">
            <Select
              value={layout}
              onChange={handleLayoutChange}
              style={{ width: 150 }}
              disabled={preview}
              showSearch
            >
              <Option value="vertical">Vertical</Option>
              <Option value="horizontal">Horizontal</Option>
            </Select>
            <Select
              value={font}
              onChange={handleFontChange}
              style={{ width: 150 }}
              disabled={preview}
              showSearch
            >
              <Option value="Arial">Arial</Option>
              <Option value="Helvetica">Helvetica</Option>
              <Option value="Times New Roman">Times New Roman</Option>
              <Option value="Georgia">Georgia</Option>
              <Option value="Verdana">Verdana</Option>
            </Select>
            <div className="flex items-center">
              <label htmlFor="color" className="mr-2">
                Text Color:
              </label>
              <input
                id="color"
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-10 h-10 border rounded-md"
                disabled={preview}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="background" className="mr-2">
                Background:
              </label>
              <input
                id="background"
                type="color"
                value={background}
                onChange={handleBackgroundChange}
                className="w-10 h-10 border rounded-md"
                disabled={preview}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="mb-4">
            <Form layout="vertical">
              <Form.Item label="Title">
                <Input
                  value={infoBox.title}
                  onChange={(e) =>
                    setInfoBox({ ...infoBox, title: e.target.value })
                  }
                  placeholder="Enter title"
                />
              </Form.Item>
              <Form.Item label="Description">
                <Input.TextArea
                  value={infoBox.description}
                  onChange={(e) =>
                    setInfoBox({ ...infoBox, description: e.target.value })
                  }
                  placeholder="Enter description"
                  rows={4}
                />
              </Form.Item>
              <Form.Item label="Main Media">
                <div className="flex flex-col">
                  <Button
                    onClick={() => {
                      console.log("Opening media modal for main media");
                      setMediaSelectionMode("single");
                      setIsMediaModalVisible(true);
                    }}
                  >
                    Select Media
                  </Button>
                  {infoBox.media && infoBox.media.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {infoBox.media.map((media, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
                            alt={media.title || media.title_en || "Media"}
                            width={100}
                            height={100}
                            objectFit="cover"
                            className="rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 text-gray-500">No media selected</div>
                  )}
                </div>
              </Form.Item>
            </Form>
          </div>
        </Space>
      )}

      {/* Info Items Display */}
      <div
        className={`grid ${
          layout === "vertical"
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        } gap-4`}
        style={preview ? {} : containerStyle}
      >
        {infoBox.infoItems.map((item) => (
          <InfoBoxItem
            key={item.id}
            item={item}
            onEdit={() => handleEditInfoItem(item)}
            onDelete={() => handleDeleteInfoItem(item.id)}
            font={font}
            color={color}
            background={background}
            preview={preview}
          />
        ))}
      </div>

      {/* Add Info Item Modal */}
      {!preview && (
        <Modal
          title="Add Info Item"
          open={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
          footer={null}
          destroyOnClose
        >
          <Form layout="vertical" form={form} onFinish={handleAddSubmit}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter the title." }]}
            >
              <Input placeholder="Enter title" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please enter the description." },
              ]}
            >
              <Input.TextArea rows={4} placeholder="Enter description" />
            </Form.Item>
            <Form.Item label="Media">
              <Button
                onClick={() => {
                  setMediaSelectionMode("multiple");
                  setIsMediaModalVisible(true);
                }}
              >
                Select Media
              </Button>
              {selectedMedia && selectedMedia.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedMedia.map((media, index) => (
                    <Image
                      key={index}
                      src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
                      alt={media.title || media.title_en || "Media"}
                      width={100}
                      height={100}
                      objectFit="cover"
                      className="rounded-md"
                    />
                  ))}
                </div>
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Info Item
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Edit Info Item Modal */}
      {!preview && (
        <Modal
          title="Edit Info Item"
          open={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            setCurrentEdit(null);
            setSelectedMedia([]);
          }}
          footer={null}
          destroyOnClose
        >
          {currentEdit && (
            <Form layout="vertical" form={editForm} onFinish={handleEditSubmit}>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please enter the title." }]}
              >
                <Input placeholder="Enter title" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please enter the description." },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Enter description" />
              </Form.Item>
              <Form.Item label="Media">
                <Button
                  onClick={() => {
                    setMediaSelectionMode("multiple");
                    setIsMediaModalVisible(true);
                  }}
                >
                  Select Media
                </Button>
                {selectedMedia && selectedMedia.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedMedia.map((media, index) => (
                      <Image
                        key={index}
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
                        alt={media.title || media.title_en || "Media"}
                        width={100}
                        height={100}
                        objectFit="cover"
                        className="rounded-md"
                      />
                    ))}
                  </div>
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update Info Item
                </Button>
              </Form.Item>
            </Form>
          )}
        </Modal>
      )}

      {/* Media Selection Modal */}
      {!preview && (
        <MediaSelectionModal
          isVisible={isMediaModalVisible}
          onClose={() => {
            setIsMediaModalVisible(false);
          }}
          onSelectMedia={(media) => {
            if (mediaSelectionMode === "multiple") {
              handleSelectMedia(media);
            } else {
              handleMainMediaSelect(media);
            }
          }}
          selectionMode={mediaSelectionMode}
        />
      )}
    </div>
  );
};

export default InfoBoxComponent;
