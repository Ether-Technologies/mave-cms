// ModelsShowcase.js

import { Button, message, Popconfirm, Spin, Table } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import instance from "../../axios";
import {
  CheckCircleFilled,
  CopyOutlined,
  DeleteOutlined,
  EditFilled,
} from "@ant-design/icons";

export default function ModelsShowcase() {
  const [loading, setLoading] = useState(false);
  const [dynamicModels, setDynamicModels] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchDynamicModels = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/generated-models");
      if (response.data) {
        // Check if 'fields' is a string and parse it, else use it as is
        const models = response.data?.map((model) => ({
          ...model,
          fields:
            typeof model.fields === "string"
              ? JSON.parse(model.fields)
              : model.fields,
        }));
        setDynamicModels(models);
      } else {
        setDynamicModels([]);
      }
    } catch (error) {
      console.error("Error fetching dynamic models:", error);
      setError("Error fetching dynamic models. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDynamicModels();
  }, []);

  const handleDeleteModel = async (modelId) => {
    setLoading(true);
    try {
      const response = await instance.delete(`/generated-models/${modelId}`);
      if (response.data) {
        message.success("Model deleted successfully!");
        fetchDynamicModels();
      }
    } catch (error) {
      console.error("Error deleting model:", error);
      message.error("Error deleting model. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mavecontainer bg-white p-4 w-full rounded-lg">
      {loading ? (
        <div className="text-center">
          <Spin />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      ) : dynamicModels.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {dynamicModels?.map((model) => (
            <div
              key={model.id}
              className="p-4 border border-gray-300 rounded-lg mb-4 flex flex-col justify-center items-center"
            >
              <div>
                <h2 className="text-center mb-6 w-full text-theme">
                  {model.model_name}
                </h2>
                <div className="flex gap-4 justify-center mb-4">
                  {model.status ? (
                    <CheckCircleFilled className="text-green-500 text-xl" />
                  ) : (
                    <CheckCircleFilled className="text-gray-500 text-xl" />
                  )}
                  <Button
                    type="primary"
                    onClick={() => {
                      router.push(`/diy-cms/models/${model.model_name}`);
                    }}
                    icon={<EditFilled />}
                    className="bg-transparent text-theme border-none shadow-none"
                  />
                  <Popconfirm
                    title="Are you sure you want to delete this model?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={async () => {
                      handleDeleteModel(model.id);
                    }}
                    okButtonProps={{ danger: true }}
                  >
                    <DeleteOutlined className="text-red-500 cursor-pointer" />
                  </Popconfirm>
                </div>
                <Table
                  dataSource={model.fields}
                  columns={[
                    {
                      title: "Name",
                      dataIndex: "name",
                      key: "name",
                    },
                    {
                      title: "Type",
                      dataIndex: "type",
                      key: "type",
                    },
                  ]}
                  pagination={false}
                  width="100%"
                />
              </div>
              <div className="flex items-center gap-4 mt-4">
                <code className="bg-gray-100 p-2 rounded-lg">
                  {model.api_route}
                </code>
                <Button
                  icon={<CopyOutlined />}
                  onClick={() => {
                    const url = `${process.env.NEXT_PUBLIC_DYNAMIC_MODEL_URL}${model.api_route}`;
                    navigator.clipboard.writeText(url);
                    message.success("Copied to clipboard!");
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p>No models found.</p>
        </div>
      )}
    </div>
  );
}
