// components/PageBuilder/Modals/GallerySelectionModal/GallerySelectionModal.jsx

import React, { useEffect, useState } from "react";
import {
  Drawer,
  Form,
  Button,
  Select,
  message,
  Input,
  Space,
  Typography,
  Card,
  Slider,
} from "antd";
import { MinusOutlined, PlusOutlined, DragOutlined } from "@ant-design/icons";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import MediaSelectionModal from "../MediaSelectionModal";
import Image from "next/image";

const { Option } = Select;
const { Title } = Typography;

const DraggableMediaItem = ({ media, index, moveItem, removeMedia }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "MEDIA_ITEM",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "MEDIA_ITEM",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const renderMediaItem = () => {
    const fileUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`;
    const fileType = media.file_type || "";

    if (fileType.startsWith("image/")) {
      return (
        <div className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <Image
            src={fileUrl}
            alt={media.alt || "Selected Image"}
            width={200}
            height={100}
            objectFit="cover"
            layout="fixed"
            className="transform transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      );
    } else if (fileType.startsWith("video/")) {
      return (
        <div className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <video
            src={fileUrl}
            width={100}
            height={100}
            controls
            className="transform transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      );
    } else {
      return (
        <div className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-gray-50 p-4">
          <div className="text-center">
            <Typography.Text
              strong
              className="group-hover:text-yellow-600 transition-colors duration-200"
            >
              {media.title ||
                (fileType === "application/pdf"
                  ? "View Document"
                  : "Download File")}
            </Typography.Text>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`media-thumbnail relative group cursor-move ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          icon={<MinusOutlined />}
          size="small"
          type="text"
          danger
          onClick={() => removeMedia(media.id)}
        />
      </div>
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <DragOutlined className="text-gray-500" />
      </div>
      {renderMediaItem()}
    </div>
  );
};

const GallerySelectionModal = ({
  isVisible,
  onClose,
  onSelectGallery,
  initialGallery,
}) => {
  const [form] = Form.useForm();
  const [selectedMedia, setSelectedMedia] = useState(
    initialGallery?.images || []
  );
  const [layout, setLayout] = useState(initialGallery?.layout || "grid");
  const [columns, setColumns] = useState(
    initialGallery?.settings?.columns || 3
  );
  const [spacing, setSpacing] = useState(
    initialGallery?.settings?.spacing || 16
  );
  const [isMediaDrawerVisible, setIsMediaDrawerVisible] = useState(false);
  const [hoverEffect, setHoverEffect] = useState(
    initialGallery?.settings?.hoverEffect || "scale"
  );
  const [borderRadius, setBorderRadius] = useState(
    initialGallery?.settings?.borderRadius || "8px"
  );
  const [shadow, setShadow] = useState(
    initialGallery?.settings?.shadow || "sm"
  );

  useEffect(() => {
    if (isVisible) {
      setSelectedMedia(initialGallery?.images || []);
      setLayout(initialGallery?.layout || "grid");
      setColumns(initialGallery?.settings?.columns || 3);
      setSpacing(initialGallery?.settings?.spacing || 16);
      setHoverEffect(initialGallery?.settings?.hoverEffect || "scale");
      setBorderRadius(initialGallery?.settings?.borderRadius || "8px");
      setShadow(initialGallery?.settings?.shadow || "sm");
      form.setFieldsValue({
        layout: initialGallery?.layout || "grid",
        columns: initialGallery?.settings?.columns || 3,
        spacing: initialGallery?.settings?.spacing || 16,
        hoverEffect: initialGallery?.settings?.hoverEffect || "scale",
        borderRadius: initialGallery?.settings?.borderRadius || "8px",
        shadow: initialGallery?.settings?.shadow || "sm",
      });
    }
  }, [isVisible, initialGallery, form]);

  const moveItem = (fromIndex, toIndex) => {
    const newMedia = [...selectedMedia];
    const [removed] = newMedia.splice(fromIndex, 1);
    newMedia.splice(toIndex, 0, removed);
    setSelectedMedia(newMedia);
  };

  const handleMediaSelect = (media) => {
    setSelectedMedia(media);
    setIsMediaDrawerVisible(false);
  };

  const handleOk = () => {
    if (selectedMedia.length === 0) {
      message.error("Please select at least one media item.");
      return;
    }

    const values = form.getFieldsValue();
    const galleryData = {
      images: selectedMedia,
      layout: values.layout,
      settings: {
        columns: values.layout !== "carousel" ? values.columns : null,
        spacing: values.spacing,
        hoverEffect: values.hoverEffect,
        borderRadius: values.borderRadius,
        shadow: values.shadow,
      },
    };
    onSelectGallery(galleryData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
    form.resetFields();
    setSelectedMedia(initialGallery?.images || []);
    setLayout(initialGallery?.layout || "grid");
    setColumns(initialGallery?.settings?.columns || 3);
    setSpacing(initialGallery?.settings?.spacing || 16);
    setHoverEffect(initialGallery?.settings?.hoverEffect || "scale");
    setBorderRadius(initialGallery?.settings?.borderRadius || "8px");
    setShadow(initialGallery?.settings?.shadow || "sm");
  };

  const removeMedia = (id) => {
    setSelectedMedia(selectedMedia.filter((item) => item.id !== id));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Drawer
        title="Gallery Configuration"
        placement="right"
        onClose={handleCancel}
        open={isVisible}
        width={720}
        className="gallery-config-drawer"
        extra={
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={handleOk}>
              Save Gallery
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" className="space-y-6">
          <Card title="Media Selection" className="mb-6">
            <Form.Item label="Select Media" required>
              <Button
                type="dashed"
                onClick={() => setIsMediaDrawerVisible(true)}
                icon={<PlusOutlined />}
                className="w-full mb-4"
              >
                Open Media Library
              </Button>
              <div className="selected-media grid grid-cols-4 gap-4">
                {selectedMedia?.map((media, index) => (
                  <DraggableMediaItem
                    key={media.id}
                    media={media}
                    index={index}
                    moveItem={moveItem}
                    removeMedia={removeMedia}
                  />
                ))}
              </div>
            </Form.Item>
          </Card>

          <Card title="Layout Settings" className="mb-6">
            <Form.Item
              name="layout"
              label="Gallery Layout"
              rules={[{ required: true, message: "Please select a layout." }]}
            >
              <Select onChange={(value) => setLayout(value)} showSearch>
                <Option value="grid">Grid</Option>
                <Option value="masonry">Masonry</Option>
                <Option value="carousel">Carousel</Option>
              </Select>
            </Form.Item>

            {(layout === "grid" || layout === "masonry") && (
              <>
                <Form.Item
                  name="columns"
                  label="Number of Columns"
                  initialValue={3}
                >
                  <Slider
                    min={1}
                    max={6}
                    marks={{
                      1: "1",
                      2: "2",
                      3: "3",
                      4: "4",
                      5: "5",
                      6: "6",
                    }}
                    tooltip={{ formatter: (value) => `${value} columns` }}
                  />
                </Form.Item>

                <Form.Item
                  name="spacing"
                  label="Spacing (px)"
                  rules={[
                    { required: true, message: "Please enter the spacing." },
                    {
                      type: "number",
                      min: 0,
                      message: "Spacing must be a positive number.",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={0}
                    placeholder="Enter spacing in pixels"
                  />
                </Form.Item>
              </>
            )}

            {layout === "carousel" && (
              <Form.Item
                name="spacing"
                label="Spacing (px)"
                rules={[
                  { required: true, message: "Please enter the spacing." },
                  {
                    type: "number",
                    min: 0,
                    message: "Spacing must be a positive number.",
                  },
                ]}
              >
                <Input
                  type="number"
                  min={0}
                  placeholder="Enter spacing in pixels"
                />
              </Form.Item>
            )}
          </Card>

          <Card title="Style Settings" className="mb-6">
            <Form.Item name="hoverEffect" label="Hover Effect">
              <Select
                value={hoverEffect}
                onChange={(value) => setHoverEffect(value)}
                showSearch
              >
                <Option value="none">None</Option>
                <Option value="scale">Scale</Option>
                <Option value="fade">Fade</Option>
                <Option value="slide">Slide</Option>
              </Select>
            </Form.Item>

            <Form.Item name="borderRadius" label="Border Radius">
              <Select
                value={borderRadius}
                onChange={(value) => setBorderRadius(value)}
                showSearch
              >
                <Option value="0px">None</Option>
                <Option value="4px">Small</Option>
                <Option value="8px">Medium</Option>
                <Option value="16px">Large</Option>
                <Option value="24px">Extra Large</Option>
              </Select>
            </Form.Item>

            <Form.Item name="shadow" label="Shadow">
              <Select
                value={shadow}
                onChange={(value) => setShadow(value)}
                showSearch
              >
                <Option value="none">None</Option>
                <Option value="sm">Small</Option>
                <Option value="md">Medium</Option>
                <Option value="lg">Large</Option>
              </Select>
            </Form.Item>
          </Card>
        </Form>
      </Drawer>

      <MediaSelectionModal
        isVisible={isMediaDrawerVisible}
        onClose={() => setIsMediaDrawerVisible(false)}
        onSelectMedia={handleMediaSelect}
        selectionMode="multiple"
        initialSelectedMedia={selectedMedia}
      />
    </DndProvider>
  );
};

export default GallerySelectionModal;
