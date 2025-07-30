import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import instance from "../../axios"; // Existing Axios instance
import ModelDataForm from "./ModelDataForm";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";

export default function CustomModelData({ model }) {
  const [customModelData, setCustomModelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModeVisible, setCreateModeVisible] = useState(false);
  const [relatedData, setRelatedData] = useState({}); // To store related models data

  console.log("Custom Model", model);

  // Function to fetch custom model data using flyURL
  const fetchCustomModelData = async () => {
    setLoading(true);
    try {
      const response = await instance.get(`${model?.api_route}`, {
        flyURL: process.env.NEXT_PUBLIC_DYNAMIC_MODEL_URL,
      });
      const data = response.data;
      if (data) {
        console.log("Custom Model Data", data);
        setCustomModelData(data);
      } else {
        console.log("No custom model data found");
      }
    } catch (error) {
      console.error("Error fetching custom model data", error);
      message.error("Error fetching custom model data");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch related models data
  const fetchRelatedData = async () => {
    const relatedFields = model?.fields.filter((field) => field.relatedModel);
    const relatedPromises = relatedFields.map(async (field) => {
      try {
        const response = await instance.get(
          `/dynamic?model=${field.relatedModel}`
        );
        return { [field.name]: response.data };
      } catch (error) {
        console.error(`Error fetching related data for ${field.name}`, error);
        return { [field.name]: [] };
      }
    });

    const results = await Promise.all(relatedPromises);
    const relatedDataObj = results.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {}
    );
    setRelatedData(relatedDataObj);
  };

  useEffect(() => {
    if (model?.api_route) {
      fetchCustomModelData();
      fetchRelatedData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.api_route]);

  // Function to generate table columns based on model fields
  const generateColumns = () => {
    const columns = model?.fields.map((field) => {
      let column = {
        title: field.name,
        dataIndex: field.name,
        key: field.name,
        // Add sorting, filtering etc. as needed
      };

      // Customize rendering based on field type
      switch (field.type) {
        case "boolean":
          column.render = (text, record) => (record[field.name] ? "Yes" : "No");
          break;
        case "date":
          column.render = (text, record) =>
            record[field.name]
              ? moment(record[field.name]).format("YYYY-MM-DD")
              : "";
          break;
        case "json":
          column.render = (text, record) => (
            <pre>{JSON.stringify(record[field.name], null, 2)}</pre>
          );
          break;
        case "array":
          column.render = (text, record) =>
            Array.isArray(record[field.name])
              ? record[field.name].join(", ")
              : "";
          break;
        default:
          // Handle related models
          if (field.relatedModel) {
            column.render = (text, record) => {
              const relatedItems = relatedData[field.name] || [];
              if (Array.isArray(record[field.name])) {
                // For many relationships (e.g., belongsToMany)
                const names = relatedItems
                  .filter((item) => record[field.name].includes(item.id))
                  .map((item) => item.Name || item.name)
                  .join(", ");
                return names;
              } else {
                // For single relationships (e.g., belongsTo)
                const relatedItem = relatedItems.find(
                  (item) => item.id === record[field.name]
                );
                return relatedItem ? relatedItem.Name || relatedItem.name : "";
              }
            };
          }
          break;
      }

      return column;
    });

    // Optionally, add action column for edit/delete
    columns.push({
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          {/* Edit and Delete buttons can be added here */}
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    });

    return columns;
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await instance.delete(`${model?.api_route}/${id}`);
      message.success("Deleted successfully");
      fetchCustomModelData();
    } catch (error) {
      console.error("Error deleting data", error);
      message.error("Error deleting data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    // Implement edit functionality
    // You can reuse ModelDataForm with pre-filled data
    // This requires additional state management
    message.info("Edit functionality not implemented yet.");
  };

  return (
    <div>
      <Button
        icon={<PlusOutlined />}
        onClick={() => setCreateModeVisible(true)}
        className="mb-4 mavebutton"
      >
        Create {model?.model_name}
      </Button>
      <Table
        dataSource={customModelData}
        columns={generateColumns()}
        rowKey="id"
        loading={loading}
      />

      <ModelDataForm
        createModeVisible={createModeVisible}
        setCreateModeVisible={setCreateModeVisible}
        fields={model?.fields}
        customModelData={customModelData}
        setCustomModelData={setCustomModelData}
        modelRoute={model?.api_route}
        fetchCustomModelData={fetchCustomModelData}
        relatedData={relatedData} // Pass related data to the form
      />
    </div>
  );
}
