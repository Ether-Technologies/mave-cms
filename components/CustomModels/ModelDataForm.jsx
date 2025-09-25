import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Checkbox,
  Select,
  Space,
} from "antd";
import { useState } from "react";
import axios from "axios";
import moment from "moment";
import RichTextEditor from "../RichTextEditor";

const { Option } = Select;

export default function ModelDataForm({
  fields,
  createModeVisible,
  setCreateModeVisible,
  modelRoute,
  fetchCustomModelData,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const handleCreateModelData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DYNAMIC_MODEL_URL}${modelRoute}`,
        formData
      );
      if (response.status === 201) {
        setFormData({});
        setCreateModeVisible(false);
        fetchCustomModelData();
      } else {
        console.error("Failed to create model data");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render input based on field type
  const renderInput = (field) => {
    switch (field.type) {
      case "string":
        return (
          <Input
            value={formData[field.name]}
            onChange={(e) =>
              setFormData({ ...formData, [field.name]: e.target.value })
            }
          />
        );
      case "text":
        return (
          <RichTextEditor
            defaultValue={formData[field.name] || ""}
            onChange={(html) =>
              setFormData({ ...formData, [field.name]: html })
            }
            editMode={true}
            maxLength={2000}
          />
        );
      case "integer":
      case "unsignedBigInteger":
        return (
          <InputNumber
            style={{ width: "100%" }}
            value={formData[field.name]}
            onChange={(value) =>
              setFormData({ ...formData, [field.name]: value })
            }
          />
        );
      case "boolean":
        return (
          <Checkbox
            checked={formData[field.name]}
            onChange={(e) =>
              setFormData({ ...formData, [field.name]: e.target.checked })
            }
          >
            {field.name}
          </Checkbox>
        );
      case "date":
        return (
          <DatePicker
            style={{ width: "100%" }}
            value={formData[field.name] ? moment(formData[field.name]) : null}
            onChange={(date, dateString) =>
              setFormData({ ...formData, [field.name]: dateString })
            }
          />
        );
      case "json":
        return (
          <RichTextEditor
            defaultValue={formData[field.name] || ""}
            onChange={(html) =>
              setFormData({ ...formData, [field.name]: html })
            }
            editMode={true}
            maxLength={2000}
          />
        );
      case "array":
        return (
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Enter values"
            value={formData[field.name]}
            onChange={(value) =>
              setFormData({ ...formData, [field.name]: value })
            }
            showSearch
          >
            {/* Optionally, you can provide predefined options */}
          </Select>
        );
      default:
        return (
          <Input
            value={formData[field.name]}
            onChange={(e) =>
              setFormData({ ...formData, [field.name]: e.target.value })
            }
          />
        );
    }
  };

  return (
    <Drawer
      title="Create New Model Data"
      width={720}
      onClose={() => setCreateModeVisible(false)}
      open={createModeVisible}
      footer={
        <div
          style={{
            textAlign: "right",
          }}
        >
          <Button
            onClick={() => setCreateModeVisible(false)}
            style={{ marginRight: 8 }}
            className="mavecancelbutton"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateModelData}
            type="primary"
            loading={loading}
            className="mavebutton"
          >
            Submit
          </Button>
        </div>
      }
    >
      <Form layout="vertical">
        {fields?.map((field) => (
          <Form.Item
            key={field.name}
            label={field.type !== "boolean" ? field.name : ""}
            name={field.name}
            valuePropName={field.type === "boolean" ? "checked" : "value"}
            rules={[
              {
                required: field.required,
                message: `Please input ${field.name}!`,
              },
            ]}
          >
            {renderInput(field)}
          </Form.Item>
        ))}
      </Form>
    </Drawer>
  );
}
