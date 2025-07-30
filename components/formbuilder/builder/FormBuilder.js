// components/formbuilder/builder/FormBuilder.js
import React, { useState, useEffect } from "react";
import { Tabs, Card, Button, Popconfirm, message } from "antd";
import { useRouter } from "next/router";
import instance from "../../../axios";
import BuilderPanel from "./BuilderPanel";
import ElementPanel from "./ElementPanel";
import FormPreview from "./FormPreview";

const { TabPane } = Tabs;

const FormBuilder = () => {
  const [formElements, setFormElements] = useState([]);
  const [formAttributes, setFormAttributes] = useState({});
  const [formMeta, setFormMeta] = useState({});
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Initialize default form attributes
    setFormAttributes({
      component_id: "dummy_form",
      component_class: "form, bg-light",
      method: "POST",
      action_url: "https://example.com",
      enctype: "multipart/form-data",
    });
    setFormMeta({
      title: "Demo Form",
      description: "This is a demo form.",
      status: 1,
    });
  }, []);

  // Add new element from side panel
  const addElement = (element) => {
    setFormElements((prev) => [
      ...prev,
      { ...element, updated_on: Date.now().toString() },
    ]);
  };

  // Overwrite entire array of elements
  const updateElement = (newElements) => {
    setFormElements(newElements);
  };

  // Save form to server
  const saveForm = async () => {
    try {
      setLoading(true);
      const response = await instance.post("/form_builder", {
        title: formMeta.title,
        description: formMeta.description,
        attributes: formAttributes,
        elements: formElements,
      });
      if (response.status === 201) {
        message.success("Form saved successfully!");
        setPreview(false);
        await router.push("/formbuilder");
      } else {
        message.error("Failed to save form.");
      }
    } catch (error) {
      console.error("Error saving form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-4">
        <Tabs defaultActiveKey="1" type="card" size="large" centered>
          <TabPane tab="Builder" key="1">
            <BuilderPanel
              formElements={formElements}
              addElement={addElement}
              updateElement={updateElement}
            />
            <div className="flex justify-between mt-4">
              <Button
                className="bg-theme text-white"
                onClick={() => setPreview(true)}
              >
                Preview
              </Button>
              <Popconfirm
                title="Are you sure you want to clear the form?"
                onConfirm={() => setFormElements([])}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button danger>Clear Form</Button>
              </Popconfirm>
            </div>
          </TabPane>

          <TabPane tab="Attributes" key="2">
            <Card className="mb-4">
              {/* Title */}
              <label className="block text-gray-700 font-bold mb-2">
                Form Title
              </label>
              <input
                className="border rounded w-full p-2 mb-4"
                placeholder="Form Title"
                value={formMeta.title || ""}
                onChange={(e) => {
                  setFormMeta({ ...formMeta, title: e.target.value });
                  setFormAttributes({
                    ...formAttributes,
                    component_id: e.target.value
                      .toLowerCase()
                      .replace(/\s/g, "_"),
                  });
                }}
              />
              {/* Description */}
              <label className="block text-gray-700 font-bold mb-2">
                Form Description
              </label>
              <textarea
                className="border rounded w-full p-2 mb-4"
                rows="4"
                value={
                  formMeta.description
                    ? formMeta.description.replace(/<[^>]+>/g, "")
                    : ""
                }
                onChange={(e) =>
                  setFormMeta({
                    ...formMeta,
                    description: `<p>${e.target.value}</p>`,
                  })
                }
              />
              {/* Action URL */}
              <label className="block text-gray-700 font-bold mb-2">
                Action URL
              </label>
              <input
                className="border rounded w-full p-2 mb-4"
                type="url"
                placeholder="https://example.com"
                value={formAttributes.action_url || ""}
                onChange={(e) =>
                  setFormAttributes({
                    ...formAttributes,
                    action_url: e.target.value,
                  })
                }
              />
            </Card>
          </TabPane>
        </Tabs>
      </div>

      {/* Side Panel */}
      <div className="lg:col-span-1">
        <ElementPanel />
      </div>

      {/* Drawer/Preview */}
      {preview && (
        <FormPreview
          visible={preview}
          onCancel={() => setPreview(false)}
          onSave={saveForm}
          formMeta={formMeta}
          formAttributes={formAttributes}
          formElements={formElements}
          loading={loading}
        />
      )}
    </div>
  );
};

export default FormBuilder;
