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
  const [testFormData, setTestFormData] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

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
        action_url: "", // Initially blank, will be set after form creation
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

  // Generate test data based on form fields
  const generateTestData = (elements) => {
    const testData = {};

    elements.forEach((element) => {
      if (element.element_type === 'button') return; // Skip button elements

      const fieldName = element.label || element.placeholder || 'field';
      const fieldType = element.input_type || element.element_type;

      switch (fieldType) {
        case 'text':
          testData[fieldName] = `Test ${fieldName}`;
          break;
        case 'email':
          testData[fieldName] = `test.${fieldName}@example.com`;
          break;
        case 'number':
          testData[fieldName] = Math.floor(Math.random() * 1000) + 1;
          break;
        case 'tel':
          testData[fieldName] = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
          break;
        case 'password':
          testData[fieldName] = 'TestPassword123!';
          break;
        case 'date':
          testData[fieldName] = new Date().toISOString().split('T')[0];
          break;
        case 'radio':
          // If options exist, pick the first one, otherwise use a default
          if (element.options && element.options.length > 0) {
            testData[fieldName] = element.options[0].value || element.options[0].title || 'Test Option';
          } else {
            testData[fieldName] = 'Test Option';
          }
          break;
        case 'select':
          // If options exist, pick the first one, otherwise use a default
          if (element.options && element.options.length > 0) {
            testData[fieldName] = element.options[0].value || element.options[0].title || 'Test Option';
          } else {
            testData[fieldName] = 'Test Option';
          }
          break;
        case 'location':
          testData[fieldName] = {
            latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
            longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
            address: 'Test Location Address'
          };
          break;
        case 'textarea':
          testData[fieldName] = `This is a test message for ${fieldName} field.`;
          break;
        case 'file':
          testData[fieldName] = 'test-file.txt';
          break;
        default:
          testData[fieldName] = `Test ${fieldName}`;
      }
    });

    return testData;
  };

  // Test form submission
  const testFormSubmission = async () => {
    if (!formId) {
      message.error("Please save the form first before testing.");
      return;
    }

    try {
      setTestLoading(true);

      // Generate test data based on actual form fields
      const generatedFormData = generateTestData(formElements);

      const testData = {
        form_id: formId,
        form_data: generatedFormData,
        submitted_at: new Date().toISOString()
      };

      const response = await instance.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/form-submission?form_id=${formId}`,
        testData
      );

      if (response.status === 200 || response.status === 201) {
        message.success("Test submission successful! Check the form responses.");
        setTestFormData(response.data);
      } else {
        message.error("Test submission failed.");
      }
    } catch (error) {
      console.error("Error testing form submission:", error);
      message.error("Test submission failed. Please check your form configuration.");
    } finally {
      setTestLoading(false);
    }
  };

  // Fetch form submissions for testing
  const fetchFormSubmissions = async () => {
    if (!formId) {
      message.error("Please save the form first before testing.");
      return;
    }

    try {
      setTestLoading(true);
      const response = await instance.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/form-submission?form_id=${formId}`
      );

      if (response.status === 200) {
        setTestFormData(response.data);
        message.success(`Found ${response.data.length} form submissions.`);
      }
    } catch (error) {
      console.error("Error fetching form submissions:", error);
      message.error("Failed to fetch form submissions.");
    } finally {
      setTestLoading(false);
    }
  };

  const saveForm = async () => {
    try {
      setLoading(true);

      // If creating new form, ensure action URL is set automatically
      let attributes = formAttributes;
      if (!formId) {
        attributes = {
          ...formAttributes,
          action_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/form-submission`
        };
      }

      const data = {
        title: formMeta.title,
        description: formMeta.description,
        attributes: attributes,
        elements: formElements,
      };
      const url = formId ? `/form_builder/${formId}` : "/form_builder";
      const method = formId ? "put" : "post";

      const response = await instance[method](url, data);
      if (response.status === 200 || response.status === 201) {
        // If creating new form, update with form ID in action URL
        if (!formId && response.data.id) {
          const newFormId = response.data.id;
          const updatedAttributes = {
            ...attributes,
            action_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/form-submission?form_id=${newFormId}`
          };

          await instance.put(`/form_builder/${newFormId}`, {
            ...data,
            attributes: updatedAttributes
          });
        }

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
                Action URL <span className="text-sm text-gray-500">(Auto-generated)</span>
              </label>
              <input
                className="border rounded w-full p-2 mb-4 bg-gray-100 cursor-not-allowed"
                type="url"
                placeholder={formId ? "Action URL will appear after form creation" : "Save form to generate Action URL"}
                value={formAttributes.action_url || ""}
                readOnly
                disabled
              />
              {!formId && (
                <p className="text-sm text-gray-500 mb-4">
                  💡 The Action URL will be automatically generated after you save the form.
                </p>
              )}
            </Card>
          </TabPane>

          <TabPane tab="Test" key="3">
            <Card className="mb-4">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Form Testing</h3>
                <p className="text-gray-600 mb-4">
                  Test your form submission to ensure it's working correctly.
                </p>

                {!formId ? (
                  <div className="bg-gray-200 border border-gray-300 rounded-md p-4 mb-4">
                    <p className="text-gray-700">
                      ⚠️ Please save the form first before testing. The form needs to be created to get a form ID.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-200 border border-gray-300 rounded-md p-4">
                      <p className="text-gray-800">
                        ✅ Form is ready for testing! Form ID: <strong>{formId}</strong>
                      </p>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        type="primary"
                        onClick={testFormSubmission}
                        loading={testLoading}
                        className="bg-gray-200 hover:bg-gray-200"
                      >
                        Test Form Submission
                      </Button>
                      <Button
                        onClick={fetchFormSubmissions}
                        loading={testLoading}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        View Form Responses
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Test Results */}
              {testFormData && (
                <div className="mt-6">
                  <h4 className="text-md font-bold text-gray-800 mb-3">Test Results</h4>
                  <div className="bg-gray-50 border rounded-md p-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(testFormData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
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
