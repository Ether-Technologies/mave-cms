import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Drawer, Card, Space } from "antd";
import { EyeOutlined, CheckOutlined } from "@ant-design/icons";
import BaseComponent from "./BaseComponent";
import axios from "../../../axios";
import instance from "../../../axios";

const FormComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [availableForms, setAvailableForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isDrawerVisible) {
      fetchAvailableForms();
    }
  }, [isDrawerVisible]);

  const fetchAvailableForms = async () => {
    try {
      const response = await instance.get("/form_builder");
      setAvailableForms(response.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  const handleEdit = () => {
    setIsDrawerVisible(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      updateComponent({
        ...component,
        _mave: true,
        data: {
          ...values,
          formId: selectedForm?.id,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const fetchFormDetails = async (formId) => {
    try {
      const response = await instance.get(`/form_builder/${formId}`);
      setSelectedForm(response.data);
      form.setFieldsValue({
        title: response.data.title,
        description: response.data.description,
      });
    } catch (error) {
      console.error("Error fetching form details:", error);
    }
  };

  const handleFormSelect = (form) => {
    setSelectedForm(form);
    setIsPreviewing(true);
  };

  const handleConfirmForm = () => {
    updateComponent({
      ...component,
      _mave: true,
      data: {
        formId: selectedForm.id,
        title: selectedForm.title,
        description: selectedForm.description,
        elements: selectedForm.elements,
      },
    });
    setIsDrawerVisible(false);
    setIsPreviewing(false);
  };

  const renderFormPreview = () => {
    if (!selectedForm) return null;

    return (
      <div className="form-preview p-4">
        <h3 className="text-lg font-semibold mb-4">{selectedForm.title}</h3>
        <p className="text-gray-600 mb-4">{selectedForm.description}</p>
        <Form layout="vertical">
          {selectedForm.elements?.map((element, index) => (
            <Form.Item
              key={index}
              label={element.label}
              name={element.label.toLowerCase().replace(/\s+/g, "_")}
            >
              {renderFormElement(element)}
            </Form.Item>
          ))}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  const renderFormElement = (element) => {
    switch (element.type) {
      case "input":
        return <Input placeholder={element.placeholder} disabled />;
      case "textarea":
        return <Input.TextArea placeholder={element.placeholder} disabled />;
      case "select":
        return (
          <Select placeholder={element.placeholder} disabled>
            {element.options?.map((option, index) => (
              <Select.Option key={index} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        );
      case "radio":
        return (
          <Select placeholder={element.placeholder} disabled>
            {element.options?.map((option, index) => (
              <Select.Option key={index} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        );
      case "checkbox":
        return (
          <Select mode="multiple" placeholder={element.placeholder} disabled>
            {element.options?.map((option, index) => (
              <Select.Option key={index} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        );
      default:
        return <Input placeholder={element.placeholder} disabled />;
    }
  };

  const renderContent = () => {
    if (preview || component.data?.formId) {
      return (
        <div className="form-preview p-4">
          <h3 className="text-lg font-semibold mb-4">
            {component.data?.title || "Form"}
          </h3>
          <p className="text-gray-600 mb-4">
            {component.data?.description || ""}
          </p>
          <Form layout="vertical">
            {component.data?.elements?.map((element, index) => (
              <Form.Item
                key={index}
                label={element.label}
                name={element.label.toLowerCase().replace(/\s+/g, "_")}
              >
                {renderFormElement(element)}
              </Form.Item>
            ))}
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      );
    }

    return (
      <div className="flex justify-center items-center p-8">
        <Button
          type="primary"
          onClick={() => setIsDrawerVisible(true)}
          size="large"
        >
          Choose Form
        </Button>
      </div>
    );
  };

  return (
    <>
      <BaseComponent
        component={{
          ...component,
          _mave: component.data?.formId ? true : false,
        }}
        updateComponent={updateComponent}
        deleteComponent={deleteComponent}
        preview={preview}
        onDuplicateElement={onDuplicateElement}
        title="Form"
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
      >
        {renderContent()}
      </BaseComponent>

      <Drawer
        title="Select Form"
        placement="right"
        width={720}
        open={isDrawerVisible}
        onClose={() => {
          setIsDrawerVisible(false);
          setIsPreviewing(false);
        }}
        extra={
          isPreviewing && (
            <Space>
              <Button onClick={() => setIsPreviewing(false)}>Back</Button>
              <Button type="primary" onClick={handleConfirmForm}>
                Confirm
              </Button>
            </Space>
          )
        }
      >
        {isPreviewing ? (
          renderFormPreview()
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {availableForms.map((form) => (
              <Card
                key={form.id}
                className="hover:shadow-md transition-shadow"
                actions={[
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => handleFormSelect(form)}
                  >
                    Preview
                  </Button>,
                ]}
              >
                <Card.Meta title={form.title} description={form.description} />
              </Card>
            ))}
          </div>
        )}
      </Drawer>
    </>
  );
};

export default FormComponent;
