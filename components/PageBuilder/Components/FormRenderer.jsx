// components/PageBuilder/Components/FormRenderer.jsx
import React, { useState } from "react";
import { Form, Input, Select, Button, message } from "antd";
import instance from "../../../axios";
import RichTextEditor from "../../RichTextEditor";

const { Option } = Select;
const { TextArea } = Input;

const FormRenderer = ({ formData, preview = false }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    if (preview) {
      message.info("This is a preview. Form submission is disabled.");
      return;
    }

    try {
      setLoading(true);
      const submissionData = {
        form_id: formData.formId,
        form_data: values,
        submitted_at: new Date().toISOString(),
      };

      // Get the action URL from the form attributes
      const actionUrl = formData.attributes?.action_url;
      if (!actionUrl) {
        message.error("Form action URL not configured");
        return;
      }

      const response = await instance.post(actionUrl, submissionData);

      if (response.status === 201 || response.status === 200) {
        message.success("Form submitted successfully!");
        form.resetFields();
      } else {
        message.error("Error submitting form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  const renderFormElement = (element) => {
    const fieldName =
      element.label?.toLowerCase().replace(/\s+/g, "_") ||
      `field_${element.updated_on}`;

    // Handle both element_type and type for backward compatibility
    const elementType = element.element_type || element.type;

    switch (elementType) {
      case "input":
        if (element.input_type === "radio") {
          return (
            <div className="space-y-2">
              {element.options?.map((option, idx) => (
                <label key={idx} className="flex items-center">
                  <input
                    type="radio"
                    value={option.value || option}
                    name={fieldName}
                    className="mr-2"
                    disabled={preview}
                  />
                  <span>{option.title || option}</span>
                </label>
              ))}
            </div>
          );
        }

        return (
          <Input
            type={element.input_type}
            placeholder={element.placeholder}
            disabled={preview}
            size="large"
            className="w-full"
          />
        );

      case "textarea":
        return (
          <RichTextEditor
            defaultValue={element.placeholder}
            onChange={() => {}}
            editMode={false}
            maxLength={2000}
          />
        );

      case "select":
        return (
          <Select
            placeholder={element.placeholder || "Select an option"}
            disabled={preview}
            size="large"
            className="w-full"
          >
            {element.options?.map((option, idx) => (
              <Option key={idx} value={option.value || option}>
                {option.title || option}
              </Option>
            ))}
          </Select>
        );

      case "button":
        if (element.input_type === "submit") {
          return (
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              disabled={preview}
              className="w-full sm:w-auto"
            >
              {element.placeholder || element.label || "Submit"}
            </Button>
          );
        }

        return (
          <Button
            type="default"
            size="large"
            disabled={preview}
            className="w-full sm:w-auto"
          >
            {element.placeholder || element.label || "Button"}
          </Button>
        );

      case "guideline":
        return (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-700 text-sm leading-relaxed">
              {element.content}
            </p>
          </div>
        );

      case "media":
        return (
          <div className="bg-gray-100 p-8 rounded-md text-center">
            <p className="text-gray-500 text-sm">
              {preview ? "Media placeholder" : "Media element"}
            </p>
          </div>
        );

      default:
        return (
          <Input
            placeholder={element.placeholder || "Input field"}
            disabled={preview}
            size="large"
            className="w-full"
          />
        );
    }
  };

  if (!formData || !formData.elements) {
    return (
      <div className="bg-gray-50 p-8 rounded-md text-center">
        <p className="text-gray-500">No form data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {formData.title || "Form"}
        </h3>
        {formData.description && (
          <div
            className="text-gray-600 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formData.description }}
          />
        )}
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6"
      >
        {formData.elements.map((element, index) => {
          const elementType = element.element_type || element.type;
          const isInputField =
            elementType !== "button" &&
            elementType !== "guideline" &&
            elementType !== "media";

          return (
            <Form.Item
              key={element.updated_on || index}
              label={
                isInputField ? (
                  <span className="text-gray-700 font-medium">
                    {element.label}
                    {element.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </span>
                ) : null
              }
              name={
                isInputField
                  ? element.label?.toLowerCase().replace(/\s+/g, "_") ||
                    `field_${element.updated_on}`
                  : undefined
              }
              rules={
                element.required && isInputField
                  ? [
                      {
                        required: true,
                        message: `${element.label} is required`,
                      },
                    ]
                  : []
              }
            >
              {renderFormElement(element)}
            </Form.Item>
          );
        })}

        {preview && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-blue-800 text-sm">
              🔍 This is a preview. Form submission is disabled.
            </p>
          </div>
        )}
      </Form>
    </div>
  );
};

export default FormRenderer;
