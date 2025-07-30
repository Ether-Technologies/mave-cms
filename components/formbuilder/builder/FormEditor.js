// components/formbuilder/builder/FormEditor.js
import React, { useEffect, useState, useContext } from "react";
import { Tabs, Card, Button, Popconfirm } from "antd";
import BuilderPanel from "./BuilderPanel";
import ElementPanel from "./ElementPanel";
import { FormBuilderContext } from "../../../src/context/FormBuilderContext";
import { message } from "antd";
import instance from "../../../axios";
import FormPreview from "./FormPreview";
import { useRouter } from "next/router";
import RichTextEditor from "../../RichTextEditor";

const { TabPane } = Tabs;

const FormEditor = ({ formId }) => {
  const [formElements, setFormElements] = useState([]);
  const [formAttributes, setFormAttributes] = useState({});
  const [formMeta, setFormMeta] = useState({});
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const { reset } = useContext(FormBuilderContext);
  const router = useRouter();

  const loadForm = async () => {
    if (!formId) return;
    try {
      const response = await instance.get(`/form_builder/${formId}`);
      const form = response.data;
      setFormAttributes(form.attributes);
      setFormMeta({
        title: form.title,
        description: form.description,
        status: form.status,
      });
      setFormElements(form.elements);
    } catch (error) {
      console.error("Error loading form:", error);
    }
  };

  useEffect(() => {
    if (formId) {
      loadForm();
    } else {
      setFormAttributes({
        component_id: "dummy_form",
        component_class: "form bg-white p-6 rounded shadow-md",
        method: "POST",
        action_url: "https://example.com",
        enctype: "multipart/form-data",
      });
      setFormMeta({
        title: "Demo Form",
        description: "<p>This is a demo form.</p>",
        status: 1,
      });
    }
  }, [formId]);

  const addElement = (element) => {
    setFormElements((prev) => [
      ...prev,
      { ...element, updated_on: new Date().getTime().toString() },
    ]);
  };

  const updateElement = (elements) => {
    setFormElements(elements);
  };

  const saveForm = async () => {
    try {
      setLoading(true);
      const data = {
        title: formMeta.title,
        description: formMeta.description,
        attributes: formAttributes,
        elements: formElements,
      };
      const url = formId ? `/form_builder/${formId}` : "/form_builder";
      const method = formId ? "put" : "post";

      const response = await instance[method](url, data);
      if (response.status === 200 || response.status === 201) {
        message.success("Form saved successfully!");
        setPreview(false);
        reset();
        router.push("/formbuilder");
      } else {
        message.error("Failed to save form.");
      }
    } catch (error) {
      console.error("Error saving form:", error);
      message.error("Error saving form.");
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
              <label className="block text-gray-700 font-bold mb-2">
                Form Title
              </label>
              <input
                className="border rounded w-full p-2 mb-4"
                placeholder="Form Title"
                value={formMeta.title}
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
              <label className="block text-gray-700 font-bold mb-2">
                Form Description
              </label>
              {/* <textarea
                className="border rounded w-full p-2 mb-4"
                rows="4"
                value={formMeta.description.replace(/<[^>]+>/g, "")}
                onChange={(e) =>
                  setFormMeta({
                    ...formMeta,
                    description: `<p>${e.target.value}</p>`,
                  })
                }
              /> */}
              <RichTextEditor
                editMode={true}
                defaultValue={formMeta.description}
                value={formMeta.description}
                onChange={(value) =>
                  setFormMeta({ ...formMeta, description: value })
                }
              />
              <label className="block text-gray-700 font-bold mb-2">
                Action URL
              </label>
              <input
                className="border rounded w-full p-2 mb-4"
                type="url"
                placeholder="https://example.com"
                value={formAttributes.action_url}
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
      <div className="lg:col-span-1">
        <ElementPanel />
      </div>
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

export default FormEditor;
