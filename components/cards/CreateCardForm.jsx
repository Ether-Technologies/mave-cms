// components/cards/CreateCardForm.jsx

import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  message,
  Radio,
  Switch,
  Drawer,
} from "antd";
import MediaSelectionModal from "../PageBuilder/Modals/MediaSelectionModal";
import RichTextEditor from "../RichTextEditor";
import instance from "../../axios";
import Image from "next/image";

const { Option } = Select;

const CreateCardForm = ({ onSuccess, onCancel, pages, media, uniqueTags }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [linkType, setLinkType] = useState("independent");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Placeholder image path
  const PLACEHOLDER_IMAGE = "/images/Image_Placeholder.png";

  // Handle title change to auto-fill alternate title
  const handleTitleChange = (e) => {
    const value = e.target.value;
    form.setFieldsValue({
      title_en: value,
      title_bn: value, // Auto-fill alternate title
    });
  };

  // Handle description change to auto-fill alternate description
  const handleDescriptionChange = (value) => {
    form.setFieldsValue({
      description_en: value,
      description_bn: value, // Auto-fill alternate description
    });
  };

  // Media selection
  const handleMediaSelect = (mediaItem) => {
    setSelectedMedia(mediaItem);
    form.setFieldsValue({ media_ids: mediaItem.id });
    setIsMediaModalVisible(false);
  };

  // Link type change
  const handleLinkTypeChange = (e) => {
    setLinkType(e.target.value);
    if (e.target.value === "page") {
      form.setFieldsValue({
        link_url: undefined,
        media_link_path: undefined,
        internal_link_path: undefined,
      });
    } else if (e.target.value === "media") {
      form.setFieldsValue({
        link_url: undefined,
        link_page_id: undefined,
        internal_link_path: undefined,
      });
    } else if (e.target.value === "internal") {
      form.setFieldsValue({
        link_url: undefined,
        link_page_id: undefined,
        media_link_path: undefined,
      });
    } else {
      form.setFieldsValue({
        link_page_id: undefined,
        media_link_path: undefined,
        internal_link_path: undefined,
      });
    }
  };

  // Build final link
  const buildLink = (values, pages) => {
    if (values.link_type === "page" && values.link_page_id) {
      const selectedPage = pages.find((p) => p.id === values.link_page_id);
      if (!selectedPage) {
        throw new Error("Selected page not found.");
      }
      return `/${selectedPage.slug}?page_id=${selectedPage.id}&pageName=${selectedPage.page_name_en}`;
    } else if (values.link_type === "media" && values.media_link_path) {
      return `${process.env.NEXT_PUBLIC_MEDIA_URL}${values.media_link_path}`;
    } else if (values.link_type === "internal" && values.internal_link_path) {
      return `${process.env.NEXT_PUBLIC_APP_URL}${values.internal_link_path}`;
    }
    return values.link_url;
  };

  // Submit
  const handleSubmit = async (values) => {
    if (!selectedMedia) {
      message.error("Please select a media item.");
      return;
    }
    setSubmitting(true);

    try {
      const finalLink = buildLink(values, pages);
      const additional = { tags: values.tags || [] };

      const payload = {
        title_en: values.title_en,
        title_bn: values.title_bn || "",
        description_en: values.description_en,
        description_bn: values.description_bn || "",
        media_ids: selectedMedia.id,
        page_name: values.page_name || "",
        link_url: finalLink,
        status: values.status ? 1 : 0,
        additional,
      };

      const response = await instance.post("/cards", payload);
      message.success("Card created successfully.");
      form.resetFields();
      setSelectedMedia(null);
      setLinkType("independent");
      onSuccess(response.data);
    } catch (error) {
      console.error("Create Card Error:", error);
      message.error("Failed to create card.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      title="Create Card"
      open={true}
      onClose={onCancel}
      width={`50%`}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          link_type: "independent",
          status: true,
        }}
      >
        {/* Hidden Field for media_ids */}
        <Form.Item name="media_ids" hidden>
          <Input type="hidden" />
        </Form.Item>

        {/* Basic Settings */}
        <div className="space-y-4">
          {/* Title (English) */}
          <Form.Item
            label="Title (English)"
            name="title_en"
            rules={[
              { required: true, message: "Please enter the title in English" },
            ]}
          >
            <Input
              placeholder="Enter title in English"
              onChange={handleTitleChange}
            />
          </Form.Item>

          {/* Description (English) */}
          <Form.Item
            label="Description (English)"
            name="description_en"
            rules={[
              {
                required: true,
                message: "Please enter the description in English",
              },
            ]}
          >
            <RichTextEditor
              placeholder="Enter description in English"
              onChange={handleDescriptionChange}
              value={form.getFieldValue("description_en")}
              editMode={true}
            />
          </Form.Item>

          {/* Media Selection */}
          <Form.Item label="Media" required>
            <div className="flex flex-col">
              <Button
                onClick={() => setIsMediaModalVisible(true)}
                className="mavebutton"
              >
                Select Media
              </Button>
              <div className="flex justify-between mt-4">
                {/* Selected Media */}
                {selectedMedia ? (
                  <div className="flex flex-col items-center">
                    <h3 className="my-2 font-bold">Selected Media</h3>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${selectedMedia.file_path}`}
                      alt="Selected Media"
                      width={200}
                      height={150}
                      objectFit="cover"
                      className="rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <h3 className="my-2 font-bold">No Media Selected</h3>
                    <Image
                      src={PLACEHOLDER_IMAGE}
                      alt="Placeholder"
                      width={200}
                      height={150}
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </Form.Item>
        </div>

        {/* Advanced Settings */}
        <div className="mt-4">
          <Button
            type="link"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-0"
          >
            {showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
          </Button>
          {showAdvanced && (
            <div className="mt-4 space-y-4">
              {/* Title (Alternate) */}
              <Form.Item label="Title (Alternate)" name="title_bn">
                <Input placeholder="Enter title in Alternate" />
              </Form.Item>

              {/* Description (Alternate) */}
              <Form.Item label="Description (Alternate)" name="description_bn">
                <RichTextEditor
                  placeholder="Enter description in Alternate"
                  onChange={(value) =>
                    form.setFieldsValue({ description_bn: value })
                  }
                  value={form.getFieldValue("description_bn")}
                  editMode={true}
                />
              </Form.Item>

              {/* Page Association */}
              <Form.Item label="Page" name="page_name">
                <Select placeholder="Select Page" allowClear showSearch>
                  {pages
                    ?.filter((p) => p.page_name_en)
                    ?.map((p) => (
                      <Option key={p.id} value={p.page_name_en}>
                        {p.page_name_en}
                      </Option>
                    ))}
                </Select>
              </Form.Item>

              {/* Link Type */}
              <Form.Item label="Link Type" name="link_type">
                <Radio.Group onChange={handleLinkTypeChange}>
                  <Radio value="page">Page Link</Radio>
                  <Radio value="independent">Independent Link</Radio>
                  <Radio value="media">Link to a Media</Radio>
                  <Radio value="internal">Internal Link</Radio>
                </Radio.Group>
              </Form.Item>

              {/* Link Fields */}
              {linkType === "page" && (
                <Form.Item label="Select the page to link" name="link_page_id">
                  <Select
                    placeholder="Select a Page to link"
                    allowClear
                    showSearch
                  >
                    {pages?.map((p) => (
                      <Option key={p.id} value={p.id}>
                        {p.page_name_en}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              {linkType === "independent" && (
                <Form.Item label="Link URL" name="link_url">
                  <Input placeholder="Enter URL or path (e.g., /about or https://example.com)" />
                </Form.Item>
              )}
              {linkType === "media" && (
                <Form.Item
                  label="Media Path"
                  name="media_link_path"
                  extra={`The full URL will be: ${process.env.NEXT_PUBLIC_MEDIA_URL}/<your-path>`}
                >
                  <Input
                    addonBefore={process.env.NEXT_PUBLIC_MEDIA_URL}
                    placeholder="Enter media path (e.g., media/example.pdf)"
                  />
                </Form.Item>
              )}
              {linkType === "internal" && (
                <Form.Item
                  label="Internal Path"
                  name="internal_link_path"
                  extra={`The full URL will be: ${process.env.NEXT_PUBLIC_APP_URL}/<your-path>`}
                >
                  <Input
                    addonBefore={process.env.NEXT_PUBLIC_APP_URL}
                    placeholder="Enter internal path (e.g., /about-us)"
                  />
                </Form.Item>
              )}

              {/* Tags */}
              <Form.Item label="Tags" name="tags">
                <Select
                  mode="tags"
                  placeholder="Add or select tags"
                  style={{ width: "100%" }}
                  showSearch
                >
                  {uniqueTags?.map((tag) => (
                    <Option key={tag} value={tag}>
                      {tag}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Status */}
              <Form.Item label="Status" name="status" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onCancel} className="mavecancelbutton">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              className="mavebutton"
            >
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>

      {/* Media Selection Modal */}
      <MediaSelectionModal
        isVisible={isMediaModalVisible}
        onClose={() => setIsMediaModalVisible(false)}
        onSelectMedia={handleMediaSelect}
        selectionMode="single"
      />
    </Drawer>
  );
};

export default CreateCardForm;
