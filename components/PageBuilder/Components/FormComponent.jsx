import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Drawer,
  Card,
  Space,
  Collapse,
  Switch,
} from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  GlobalOutlined,
  EditOutlined,
} from "@ant-design/icons";
import BaseComponent from "./BaseComponent";
import FormRenderer from "./FormRenderer";
import instance from "../../../axios";
import { message } from "antd";

const { Panel } = Collapse;

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
  const [showAltContent, setShowAltContent] = useState(false);
  const [showAltInputs, setShowAltInputs] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isDrawerVisible) {
      fetchAvailableForms();
    }
  }, [isDrawerVisible]);

  useEffect(() => {
    if (component?.data) {
      setShowAltContent(component.data?.showAltContent || false);
    }
  }, [component?.data]);

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
        attributes: selectedForm.attributes, // Include form attributes for proper submission
      },
    });
    setIsDrawerVisible(false);
    setIsPreviewing(false);
  };

  // Helper function to get display content based on language preference
  const getDisplayContent = (showAlt = false) => {
    if (!component?.data) return { title: "", description: "" };

    if (showAlt) {
      return {
        title:
          component.data.altTitle || component.data.title || "Untitled Form",
        description:
          component.data.altDescription ||
          component.data.description ||
          "No description available",
      };
    }

    return {
      title: component.data.title || "Untitled Form",
      description: component.data.description || "No description available",
    };
  };

  const renderFormPreview = () => {
    if (!selectedForm) return null;

    return <FormRenderer formData={selectedForm} preview={true} />;
  };

  const renderContent = () => {
    if (preview || component.data?.formId) {
      // Use the new FormRenderer for proper form display
      return <FormRenderer formData={component.data} preview={preview} />;
    }

    return (
      <div className="flex justify-center items-center p-8">
        <Button
          className="mavebutton"
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

      {/* Multi-Language Configuration */}
      {component?.data?.formId && !preview && (
        <Collapse className="mt-4">
          <Panel
            header={
              <div className="flex items-center gap-2">
                <GlobalOutlined />
                Multi-Language Settings
              </div>
            }
            key="multilang"
          >
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-md font-semibold">
                    Display Alternative Content
                  </h4>
                  <p className="text-sm text-gray-600">
                    Toggle to show alternative title and description for form
                  </p>
                </div>
                <Switch
                  checked={showAltContent}
                  onChange={(checked) => {
                    setShowAltContent(checked);
                    updateComponent({
                      ...component,
                      data: {
                        ...component.data,
                        showAltContent: checked,
                      },
                    });
                  }}
                />
              </div>

              {showAltContent && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <strong>Alternative Content Mode:</strong> Form will display
                    alternative title and description when available.
                  </div>
                </div>
              )}

              {/* Alternative Content Editing Section */}
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-semibold flex items-center gap-2">
                    <EditOutlined />
                    Alternative Content
                  </h5>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setShowAltInputs(true)}
                    className="mavebutton"
                    size="small"
                  >
                    Edit
                  </Button>
                </div>

                {showAltInputs ? (
                  <Form layout="vertical" className="w-full">
                    <Form.Item label="Alternative Title" className="mb-3">
                      <Input
                        placeholder="Enter alternative title"
                        defaultValue={component.data?.altTitle || ""}
                        onChange={(e) => {
                          updateComponent({
                            ...component,
                            data: {
                              ...component.data,
                              altTitle: e.target.value,
                            },
                          });
                        }}
                      />
                    </Form.Item>

                    <Form.Item label="Alternative Description" className="mb-4">
                      <Input.TextArea
                        rows={3}
                        placeholder="Enter alternative description"
                        defaultValue={component.data?.altDescription || ""}
                        onChange={(e) => {
                          updateComponent({
                            ...component,
                            data: {
                              ...component.data,
                              altDescription: e.target.value,
                            },
                          });
                        }}
                      />
                    </Form.Item>

                    {/* Update Button */}
                    <div className="mt-4 flex justify-end">
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => {
                          setShowAltInputs(false);
                          message.success(
                            "Alternative content updated successfully."
                          );
                        }}
                        className="mavebutton"
                      >
                        Update Alternative Content
                      </Button>
                    </div>
                  </Form>
                ) : (
                  /* Display Current Alternative Content */
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <div className="text-sm">
                      <div>
                        <strong>Alt Title:</strong>{" "}
                        {component.data?.altTitle || "Not set"}
                      </div>
                      <div>
                        <strong>Alt Description:</strong>{" "}
                        {component.data?.altDescription || "Not set"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </Collapse>
      )}
    </>
  );
};

export default FormComponent;
