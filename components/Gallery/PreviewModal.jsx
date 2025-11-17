// components/Gallery/PreviewModal.jsx

import React, { useState, useEffect } from "react";
import { Button, Form, Input, message, Modal, Select, Tag, Space } from "antd";
import {
  CloseOutlined,
  CloudOutlined,
  CopyOutlined,
  EditOutlined,
} from "@ant-design/icons";
import instance from "../../axios";
import Image from "next/image";

const { Option } = Select;

const PreviewModal = ({
  visible,
  onClose,
  media,
  mediaType,
  handleEdit,
  availableTags, // New prop for available tags
}) => {
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Info displayed in table if not editing
  const infoRows = [
    { key: "title", label: "Title", value: media.title || media.file_name },
    {
      key: "size",
      label: "Size",
      value: media.file_size
        ? `${(media.file_size / (1024 * 1024)).toFixed(2)} MB`
        : "Size not available",
    },
    { key: "type", label: "Type", value: media.file_type },
    {
      key: "uploadDate",
      label: "Upload Date",
      value: new Date(media.created_at).toLocaleString(),
    },
    {
      key: "tags",
      label: "Tags",
      value:
        media.tags && media.tags.length > 0
          ? media.tags.map((t) => (
              <Tag color="orange" key={t}>
                {t}
              </Tag>
            ))
          : "None",
    },
  ];

  useEffect(() => {
    if (editMode) {
      form.setFieldsValue({
        title: media.title || "",
        tags: Array.isArray(media.tags) ? media.tags : [],
      });
    }
  }, [editMode, media, form]);

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const updatedMedia = {
        ...media,
        title: values.title,
        tags: Array.isArray(values.tags) ? values.tags : [],
        updated_at: new Date().toISOString(),
      };
      const response = await instance.put(`/media/${media.id}`, updatedMedia);
      if (response.status === 200) {
        message.success("Media updated successfully.");
        handleEdit(updatedMedia); // parent updates cache and IndexedDB
        setEditMode(false);
        onClose();
      } else {
        message.error("Failed to update media.");
      }
    } catch (error) {
      console.error("Error updating media:", error);
      message.error("An error occurred while updating the media.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSvgImage =
    media?.file_type === "image/svg+xml" ||
    media?.file_name?.toLowerCase().endsWith(".svg");

  const mediaUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`;

  const renderNonEditContent = () => (
    <>
      {/* Show preview differently based on mediaType */}
      {mediaType === "image" && (
        <>
          {isSvgImage ? (
            <div className="w-full flex justify-center bg-white rounded-md p-6">
              <img
                src={mediaUrl}
                alt={media.file_name}
                className="max-w-full h-auto"
                loading="lazy"
                style={{ maxHeight: 400 }}
              />
            </div>
          ) : (
            <Image
              src={mediaUrl}
              alt={media.file_name}
              width={700}
              height={400}
              style={{ objectFit: "contain" }}
              className="rounded-md w-full h-full"
            />
          )}
        </>
      )}
      {mediaType === "video" && (
        <video width="100%" height="400" controls className="rounded-md">
          <source
            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
            type={media.file_type}
          />
          Your browser does not support the video tag.
        </video>
      )}
      {mediaType === "document" && (
        <iframe
          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
          width="100%"
          height="400"
          className="rounded-md"
        />
      )}

      <div className="my-4">
        {infoRows.map((row) => (
          <div key={row.key} className="mb-2">
            <strong>{row.label}:</strong>{" "}
            {Array.isArray(row.value) ? row.value : row.value}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button
          icon={<EditOutlined />}
          onClick={() => setEditMode(true)}
          className="mavebutton"
        >
          Edit
        </Button>
        <Space>
          <Button
            className="mavebutton"
            onClick={() => {
              navigator.clipboard.writeText(`/${media.file_path}`);
              message.success("Relative Path copied to clipboard.");
            }}
            icon={<CopyOutlined />}
          >
            Copy Path
          </Button>
          <Button
            className="mavebutton"
            onClick={() => {
              navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`
              );
              message.success("Full Link copied to clipboard.");
            }}
            icon={<CopyOutlined />}
          >
            Copy Link
          </Button>
        </Space>
      </div>
    </>
  );

  const renderEditForm = () => (
    <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please enter a title." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Tags" name="tags">
        {/* mode="tags" so user can add new or pick existing from availableTags */}
        <Select
          mode="tags"
          placeholder="Enter tags"
          style={{ width: "100%" }}
          tokenSeparators={[","]}
        >
          {availableTags.map((tag) => (
            <Option key={tag} value={tag}>
              {tag}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <div className="flex justify-between">
        <Button
          type="primary"
          htmlType="submit"
          icon={<CloudOutlined />}
          loading={isSubmitting}
          className="mavebutton"
        >
          Save
        </Button>
        <Button
          onClick={() => setEditMode(false)}
          icon={<CloseOutlined />}
          className="mavecancelbutton"
        >
          Cancel
        </Button>
      </div>
    </Form>
  );

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      title={media.title || media.file_name}
    >
      {editMode ? renderEditForm() : renderNonEditContent()}
    </Modal>
  );
};

export default PreviewModal;
