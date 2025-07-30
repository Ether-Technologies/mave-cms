// components/diycms/ModelCreator.js

import {
  Form,
  Input,
  Button,
  Collapse,
  message,
  Popconfirm,
  Switch,
} from "antd";
import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import instance from "../../axios";
import FieldInput from "./FieldInput";
import pluralize from "pluralize";
import { snakeCase } from "lodash";

const { Panel } = Collapse;

export default function ModelCreator({
  editMode = false,
  existingModel = null,
  onModelCreated, // New prop
}) {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const [modelSingular, setModelSingular] = useState("");
  const [modelPlural, setModelPlural] = useState("");
  const [status, setStatus] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);

  useEffect(() => {
    const fetchAvailableModels = async () => {
      try {
        const response = await instance.get("/generated-models");
        if (response.data) {
          setAvailableModels(response.data?.map((model) => model.model_name));
        } else {
          setAvailableModels([]);
        }
      } catch (error) {
        console.error("Error fetching available models:", error);
      }
    };

    fetchAvailableModels();
  }, []);

  // Update plural model name in real-time using pluralize
  useEffect(() => {
    if (modelSingular) {
      setModelPlural(pluralize(modelSingular));
    } else {
      setModelPlural("");
    }
  }, [modelSingular]);

  // Load existing model data if in edit mode
  useEffect(() => {
    if (editMode && existingModel) {
      setModelSingular(existingModel.model_name);
      setModelPlural(pluralize(existingModel.model_name));
      setFields(existingModel.fields);
      setStatus(existingModel.status);
    }
  }, [editMode, existingModel]);

  const handleFieldChange = (fieldData) => {
    setFields([...fields, fieldData]);
  };

  const handleFieldEdit = (updatedField, index) => {
    const updatedFields = fields?.map((field, i) =>
      i === index ? updatedField : field
    );
    setFields(updatedFields);
  };

  const handleFieldDelete = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleFormSubmit = async () => {
    if (!modelSingular || !modelPlural) {
      message.error("Please provide both singular and plural model names.");
      return;
    }

    if (fields.length === 0) {
      message.error("Please add at least one field to the model.");
      return;
    }

    // Convert model names to lowercase snake case
    const modelSingularSnake = snakeCase(modelSingular.trim().toLowerCase());
    const modelPluralSnake = snakeCase(modelPlural.trim().toLowerCase());

    // Prepare the payload
    const jsonPayload = {
      modelSingular: modelSingularSnake,
      modelPlural: modelPluralSnake,
      fields: fields?.map((field) => {
        // Remove 'None' relationship types
        if (field.relationshipType === "None") {
          delete field.relationshipType;
          delete field.relatedModel;
        }

        // Ensure 'required' is included and is a boolean
        field.required = field.required === true;

        // Ensure 'unique' is included and is a boolean
        field.unique = field.unique === true;

        // Convert relatedModel to snake case if it exists
        if (field.relatedModel) {
          field.relatedModel = snakeCase(field.relatedModel.toLowerCase());
        }

        return field;
      }),
      status,
    };

    console.log("Payload to send to backend:", jsonPayload);

    // Send the payload to the backend
    setLoading(true);
    try {
      if (editMode && existingModel) {
        // Update existing model
        const response = await instance.put(
          `/generated-models/${existingModel.id}`,
          jsonPayload
        );
        if (response.status === 200) {
          message.success("Model updated successfully!");
          if (onModelCreated) onModelCreated(); // Trigger callback
          // Optionally, redirect or reset the form
        } else {
          message.error("Failed to update model. Please try again.");
        }
      } else {
        // Create new model
        const response = await instance.post("/diy-cms", jsonPayload);
        if (response.status === 201) {
          message.success("Model created successfully!");
          if (onModelCreated) onModelCreated(); // Trigger callback
          // Optionally, reset the form
          setModelSingular("");
          setModelPlural("");
          setFields([]);
          setStatus(false);
        } else {
          message.error("Failed to create model. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error saving model:", error);
      message.error("Failed to save model. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        borderRadius: "1rem",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "var(--white)",
      }}
    >
      <Form layout="vertical" onFinish={handleFormSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Singular and Plural Model Name */}
          <Form.Item
            label="Model Name (Singular)"
            required
            style={{ width: "48%" }}
          >
            <Input
              value={modelSingular}
              onChange={(e) => setModelSingular(e.target.value)}
              placeholder="Enter the singular form of the model (e.g., Task)"
              disabled={editMode} // Disable editing model name in edit mode
            />
          </Form.Item>
          <Form.Item
            label="Model Name (Plural)"
            required
            style={{ width: "48%" }}
          >
            <Input
              value={modelPlural}
              onChange={(e) => setModelPlural(e.target.value)}
              placeholder="Enter the plural form of the model (e.g., Tasks)"
              disabled={editMode} // Disable editing model name in edit mode
            />
          </Form.Item>
        </div>

        {/* Fields */}
        <Collapse accordion>
          {fields?.map((field, index) => (
            <Panel
              header={`${field.name} (${field.type})`}
              key={index}
              extra={
                <Popconfirm
                  title="Are you sure you want to delete this field?"
                  onConfirm={() => handleFieldDelete(index)}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Button danger>Delete</Button>
                </Popconfirm>
              }
            >
              <FieldInput
                initialFieldData={field}
                availableModels={availableModels}
                onSave={(updatedField) => handleFieldEdit(updatedField, index)}
              />
            </Panel>
          ))}
        </Collapse>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            type="dashed"
            onClick={() =>
              handleFieldChange({ name: "", type: "string", required: false })
            }
            style={{ marginTop: "20px" }}
            icon={<PlusOutlined />}
          >
            Add Field
          </Button>

          {/* Status Switch */}
          <Form.Item label="Status" style={{ width: "100%" }}>
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              checked={status}
              onChange={(checked) => setStatus(checked)}
            />
          </Form.Item>

          <Popconfirm
            title={`Are you sure you want to ${editMode ? "update" : "generate"
              } the model?`}
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleFormSubmit()}
            onCancel={() =>
              message.info(
                `Model ${editMode ? "update" : "generation"} cancelled.`
              )
            }
            okButtonProps={{ danger: true }}
          >
            <Button
              type="primary"
              loading={loading}
              style={{
                marginTop: "20px",
                padding: "1rem 2rem",
                fontSize: "1.2rem",
                borderRadius: "0.5rem",
                backgroundColor: "var(--theme)",
                color: "var(--black)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                fontWeight: "bold",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              {editMode ? "Update Model" : "Generate Model"}
            </Button>
          </Popconfirm>
        </div>
      </Form>
    </div>
  );
}
