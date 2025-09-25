// components/PageBuilder/Modals/ButtonSelectionModal/ButtonSelectionModal.jsx

import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  Radio,
  message,
  Switch,
  Collapse,
} from "antd";
import RichTextEditor from "../../../RichTextEditor";
import { PlusOutlined, MinusOutlined, GlobalOutlined } from "@ant-design/icons";
import instance from "../../../../axios";

const { Panel } = Collapse;

const { Option } = Select;

const ButtonSelectionModal = ({
  isVisible,
  onClose,
  onSelectButton,
  initialButton,
}) => {
  const [form] = Form.useForm();
  const [internalLinks, setInternalLinks] = useState([]);

  // Use useWatch to monitor changes to actionType and showAltText
  const actionType = Form.useWatch("actionType", form);
  const showAltText = Form.useWatch("showAltText", form);

  useEffect(() => {
    if (isVisible) {
      form.setFieldsValue({
        text: initialButton.text || "",
        altText: initialButton.altText || "",
        showAltText: initialButton.showAltText || false,
        icon: initialButton.icon || "",
        actionType: initialButton.action?.type || "none",
        url: initialButton.action?.url || "",
        internalLink: initialButton.action?.url || "",
        customScript: initialButton.action?.customScript || "",
      });
    } else {
      form.resetFields();
    }
  }, [isVisible, initialButton, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const {
          text,
          altText,
          showAltText,
          icon,
          actionType,
          url,
          internalLink,
          customScript,
        } = values;
        let action = {};

        if (actionType === "internal_link") {
          action = { type: actionType, url: internalLink };
        } else if (actionType === "external_link") {
          action = { type: actionType, url };
        } else if (actionType === "action") {
          action = { type: actionType, customScript };
        }

        const buttonData = {
          text,
          altText: showAltText ? altText : "",
          showAltText,
          icon,
          action: actionType !== "none" ? action : null,
          alignment: "left", // Default alignment
        };

        onSelectButton(buttonData);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const iconOptions = [
    { label: "None", value: "" },
    { label: "Link", value: "LinkOutlined" },
    { label: "Plus", value: "PlusOutlined" },
    { label: "Edit", value: "EditOutlined" },
    { label: "Delete", value: "DeleteOutlined" },
    // Add more icons as needed
  ];

  const fetchInternalLinks = async () => {
    try {
      const response = await instance.get("/menuitems");
      if (response.data) {
        setInternalLinks(response.data);
      }
    } catch (error) {
      message.error("Internal links couldn't be fetched");
    }
  };

  useEffect(() => {
    fetchInternalLinks();
  }, []);

  return (
    <Modal
      title="Configure Button"
      open={isVisible}
      onOk={handleOk}
      onCancel={onClose}
      width={600}
      okText="Save"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Collapse defaultActiveKey={["1", "2"]} ghost>
          <Panel header="Button Content" key="1">
            <Form.Item
              name="text"
              label="Button Text"
              rules={[
                { required: true, message: "Please enter the button text." },
              ]}
            >
              <Input placeholder="Enter button text" />
            </Form.Item>

            <Form.Item
              name="showAltText"
              label="Multi-Language Support"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            {showAltText && (
              <Form.Item
                name="altText"
                label="Alternative Text"
                rules={[
                  {
                    required: showAltText,
                    message: "Please enter alternative text.",
                  },
                ]}
              >
                <Input placeholder="Enter alternative text in another language" />
              </Form.Item>
            )}

            <Form.Item name="icon" label="Button Icon">
              <Select placeholder="Select an icon" showSearch>
                {iconOptions?.map((icon) => (
                  <Option key={icon.value} value={icon.value}>
                    {icon.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Panel>
          <Panel header="Button Action" key="2">
            <Form.Item
              name="actionType"
              label="Button Action"
              rules={[
                { required: true, message: "Please select an action type." },
              ]}
            >
              <Radio.Group>
                <Radio value="none">None</Radio>
                <Radio value="internal_link">Internal Link</Radio>
                <Radio value="external_link">External Link</Radio>
                <Radio value="action">Custom Action</Radio>
              </Radio.Group>
            </Form.Item>

            {/* Conditionally render Internal Link Field */}
            {actionType === "internal_link" && (
              <Form.Item
                name="internalLink"
                label="Select Internal Link"
                rules={[
                  {
                    required: true,
                    message: "Please select an internal link.",
                  },
                ]}
              >
                <Select
                  placeholder="Select a page or menu item"
                  allowClear
                  showSearch
                >
                  {internalLinks?.map((link) => (
                    <Option key={link.id} value={link.link}>
                      {link.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {/* Conditionally render External URL Field */}
            {actionType === "external_link" && (
              <Form.Item
                name="url"
                label="External URL"
                rules={[
                  { required: true, message: "Please enter the external URL." },
                  { type: "url", message: "Please enter a valid URL." },
                ]}
              >
                <Input placeholder="https://example.com" />
              </Form.Item>
            )}

            {/* Conditionally render Custom Script Field */}
            {actionType === "action" && (
              <Form.Item
                name="customScript"
                label="Custom Action Script"
                rules={[
                  {
                    required: true,
                    message: "Please enter the custom action script.",
                  },
                ]}
              >
                <RichTextEditor
                  defaultValue=""
                  onChange={(html) => form.setFieldValue("customScript", html)}
                  editMode={true}
                  maxLength={2000}
                />
              </Form.Item>
            )}
          </Panel>
        </Collapse>
      </Form>
    </Modal>
  );
};

export default ButtonSelectionModal;
