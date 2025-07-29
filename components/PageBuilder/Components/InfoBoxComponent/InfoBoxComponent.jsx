// components/PageBuilder/Components/InfoBoxComponent/InfoBoxComponent.jsx

import React, { useState, useEffect } from "react";
import { Button, Space, Form, message, Popconfirm, Input, Switch } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  CopyFilled,
} from "@ant-design/icons";
import Image from "next/image";
import InfoBoxItem from "./InfoBoxItem";
import MediaSelectionModal from "../../Modals/MediaSelectionModal";
import ConfigSection from "./ConfigSection";
import MainContentSection from "./MainContentSection";
import AddInfoItemForm from "./AddInfoItemForm";

const InfoBoxComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  const [infoBox, setInfoBox] = useState({
    title: component._mave?.title || "",
    description: component._mave?.description || "",
    media: component._mave?.media || [],
    infoItems: component._mave?.infoItems || [],
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [layout, setLayout] = useState(component._mave?.layout || "horizontal");
  const [font, setFont] = useState(component._mave?.font || "Arial");
  const [color, setColor] = useState(component._mave?.color || "#000000");
  const [background, setBackground] = useState(
    component._mave?.background || "#ffffff"
  );
  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mediaSelectionMode, setMediaSelectionMode] = useState("multiple");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    // Only update if we're in edit mode
    if (isEditMode) {
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
    }
  }, [
    isEditMode,
    infoBox,
    layout,
    font,
    color,
    background,
    updateComponent,
    component,
  ]);

  // Handle media selection
  const handleSelectMedia = (media) => {
    const mediaArray = Array.isArray(media) ? media : [media];
    setSelectedMedia(mediaArray);
    setIsMediaModalVisible(false);
  };

  // Handle main media selection
  const handleMainMediaSelect = (media) => {
    const mediaArray = Array.isArray(media) ? media : [media];
    setInfoBox((prevInfoBox) => ({
      ...prevInfoBox,
      media: mediaArray,
    }));
    setIsMediaModalVisible(false);
    message.success("Main media updated successfully.");
  };

  // Handle add info item submit
  const handleAddSubmit = (values) => {
    const newInfoItem = {
      id: Date.now(),
      title: values.title,
      description: values.description,
      link: values.link,
      media: selectedMedia,
    };
    setInfoBox({
      ...infoBox,
      infoItems: [...infoBox.infoItems, newInfoItem],
    });
    form.resetFields();
    setSelectedMedia([]);
    setShowAddForm(false);
    message.success("Info item added successfully.");
  };

  // Handle edit info item
  const handleEditInfoItem = (item) => {
    setEditingItemId(item.id);
    editForm.setFieldsValue({
      title: item.title,
      description: item.description,
      link: item.link,
    });
    setSelectedMedia(item.media);
  };

  // Handle edit submit
  const handleEditSubmit = (values) => {
    const updatedItem = {
      id: editingItemId,
      title: values.title,
      description: values.description,
      link: values.link,
      media: selectedMedia,
    };
    setInfoBox({
      ...infoBox,
      infoItems: infoBox.infoItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      ),
    });
    setEditingItemId(null);
    setSelectedMedia([]);
    message.success("Info item updated successfully.");
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingItemId(null);
    setSelectedMedia([]);
    editForm.resetFields();
  };

  // Handle delete info item
  const handleDeleteInfoItem = (id) => {
    setInfoBox({
      ...infoBox,
      infoItems: infoBox.infoItems.filter((item) => item.id !== id),
    });
    message.success("Info item deleted successfully.");
  };

  // Handle delete component
  const handleDeleteComponent = () => {
    if (deleteComponent) {
      deleteComponent(component._id || component.id);
    }
  };

  // Handle media modal open
  const handleMediaModalOpen = (mode) => {
    setMediaSelectionMode(mode);
    setIsMediaModalVisible(true);
  };

  // Handle edit mode toggle
  const handleEditModeToggle = () => {
    if (isEditMode) {
      // Save changes when exiting edit mode
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
    }
    setIsEditMode(!isEditMode);
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Info Box Component</h3>
          <Space>
            {isEditMode ? (
              <>
                <Button
                  className="mavebutton"
                  type="primary"
                  onClick={handleEditModeToggle}
                >
                  Save Changes
                </Button>
                <Button
                  className="mavecancelbutton"
                  onClick={() => setIsEditMode(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="mavebutton"
                  onClick={() => setIsEditMode(true)}
                >
                  Edit
                </Button>
                <Button
                  icon={<CopyFilled />}
                  onClick={onDuplicateElement}
                  className="mavebutton"
                />
              </>
            )}
            <Popconfirm
              title="Delete Component"
              description="Are you sure you want to delete this component?"
              onConfirm={handleDeleteComponent}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Space>
        </div>
      )}

      {!preview && isEditMode && (
        <Space direction="vertical" style={{ width: "100%" }}>
          <div className="flex justify-end mb-4">
            <Button
              icon={<SettingOutlined />}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide Advanced" : "Show Advanced"}
            </Button>
          </div>

          {showAdvanced && (
            <ConfigSection
              layout={layout}
              font={font}
              color={color}
              background={background}
              onLayoutChange={setLayout}
              onFontChange={setFont}
              onColorChange={(e) => setColor(e.target.value)}
              onBackgroundChange={(e) => setBackground(e.target.value)}
            />
          )}

          <MainContentSection
            infoBox={infoBox}
            onInfoBoxChange={setInfoBox}
            onMediaSelect={handleMediaModalOpen}
            media={infoBox.media}
          />

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Info Items</h4>
              <Button
                className="mavebutton"
                onClick={() => setShowAddForm(!showAddForm)}
                icon={showAddForm ? <MinusOutlined /> : <PlusOutlined />}
              >
                {showAddForm ? "Cancel" : "Add Info Item"}
              </Button>
            </div>

            {showAddForm && (
              <AddInfoItemForm
                form={form}
                onFinish={handleAddSubmit}
                onMediaSelect={handleMediaModalOpen}
                selectedMedia={selectedMedia}
              />
            )}
          </div>
        </Space>
      )}

      {/* Preview/Display Mode */}
      <div style={preview || !isEditMode ? containerStyle : {}}>
        {/* Title and Description - Full Width */}
        {(preview || !isEditMode) && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{infoBox.title}</h2>
            <p className="mb-4">{infoBox.description}</p>
          </div>
        )}

        {/* Main Content and Info Items */}
        <div
          className={`${
            preview || !isEditMode
              ? layout === "vertical"
                ? "flex flex-col"
                : "grid grid-cols-2 gap-8"
              : "flex flex-col"
          }`}
        >
          {/* Main Media Display */}
          {(preview || !isEditMode) && (
            <div className={`${layout === "vertical" ? "mb-6" : ""}`}>
              {infoBox.media && infoBox.media.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {infoBox.media.map((mediaItem, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${mediaItem.file_path}`}
                        alt={mediaItem.title || mediaItem.title_en || "Media"}
                        width={300}
                        height={300}
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info Items Grid */}
          <div className={`${layout === "vertical" ? "w-full" : ""}`}>
            <div className="grid grid-cols-1 gap-6">
              {infoBox.infoItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-md shadow-sm"
                >
                  {editingItemId === item.id ? (
                    <div className="flex gap-4">
                      <div className="flex flex-col justify-center w-1/3">
                        {item.media && item.media.length > 0 && (
                          <div
                            className="relative cursor-pointer"
                            onClick={() => handleMediaModalOpen("multiple")}
                          >
                            <Image
                              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${item.media[0].file_path}`}
                              alt={item.media[0].title || "Media"}
                              width={200}
                              height={200}
                              objectFit="cover"
                              className="rounded-md"
                            />
                          </div>
                        )}
                        <Button
                          className="mavebutton mt-2"
                          onClick={() => handleMediaModalOpen("multiple")}
                        >
                          Change Media
                        </Button>
                      </div>
                      <div className="w-2/3">
                        <Form
                          form={editForm}
                          onFinish={handleEditSubmit}
                          layout="vertical"
                        >
                          <Form.Item
                            name="title"
                            rules={[
                              {
                                required: true,
                                message: "Please enter the title",
                              },
                            ]}
                          >
                            <Input placeholder="Title" />
                          </Form.Item>
                          <Form.Item
                            name="description"
                            rules={[
                              {
                                required: true,
                                message: "Please enter the description",
                              },
                            ]}
                          >
                            <Input.TextArea
                              rows={4}
                              placeholder="Description"
                            />
                          </Form.Item>
                          <Form.Item name="link">
                            <Input placeholder="Link URL (optional)" />
                          </Form.Item>
                          <Form.Item>
                            <Space>
                              <Button
                                className="mavebutton"
                                type="primary"
                                htmlType="submit"
                              >
                                Save
                              </Button>
                              <Button
                                className="mavecancelbutton"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            </Space>
                          </Form.Item>
                        </Form>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-12 items-center gap-4">
                      <div className="col-span-3">
                        {item.media && item.media.length > 0 && (
                          <div className="relative">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${item.media[0].file_path}`}
                              alt={item.media[0].title || "Media"}
                              width={100}
                              height={100}
                              objectFit="cover"
                              className="rounded-md"
                            />
                          </div>
                        )}
                      </div>
                      <div className="col-span-8">
                        <h3 className="text-lg font-semibold mb-2">
                          {item.title}
                        </h3>
                        <p className="mb-2">{item.description}</p>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-600 hover:underline"
                          >
                            {item.link}
                          </a>
                        )}
                      </div>
                      {!preview && isEditMode && (
                        <Space className="col-span-1 flex flex-col">
                          <Button
                            className="mavebutton"
                            icon={<EditOutlined />}
                            onClick={() => handleEditInfoItem(item)}
                          />
                          <Button
                            className="-ml-3"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteInfoItem(item.id)}
                          />
                        </Space>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Media Selection Modal */}
      {!preview && isEditMode && (
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
