// components/formbuilder/MaveFormsList.jsx
import React, { useState, useEffect, useContext } from "react";
import { Drawer, Popconfirm, Input, Switch, Spin, Button } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  DockerOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import instance from "../../axios";
import MaveFormElements from "./MaveFormElements";
import { FormBuilderContext } from "../../src/context/FormBuilderContext";

const MaveFormsList = ({ onSelectForm, selectedFormId }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changeFormsView, setChangeFormsView] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { reset } = useContext(FormBuilderContext);

  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    if (selectedFormId) {
      setDrawerVisible(true);
    } else {
      setDrawerVisible(false);
    }
  }, [selectedFormId]);

  const fetchForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await instance.get("/form_builder");
      if (response.status === 200) {
        setForms(response.data);
      } else {
        setError("Failed to fetch forms");
      }
    } catch (err) {
      setError("An error occurred while fetching forms");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = async (formId) => {
    try {
      await instance.delete(`/form_builder/${formId}`);
      setForms((prev) => prev.filter((f) => f.id !== formId));
      if (selectedFormId === formId) {
        onSelectForm(null);
        reset();
      }
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600 text-center">{error}</div>;
  }

  if (!forms.length) {
    return <div className="p-4 text-center text-gray-600">No forms found.</div>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <Input
          placeholder="Search for forms"
          suffix={<SearchOutlined />}
          className="w-full sm:w-1/2"
        />
        <div className="flex items-center space-x-2">
          <span className="text-sm">View:</span>
          <Switch
            checkedChildren="List"
            unCheckedChildren="Groups"
            checked={changeFormsView}
            onChange={() => setChangeFormsView(!changeFormsView)}
          />
        </div>
      </div>

      {changeFormsView ? (
        <div className="flex flex-col space-y-4">
          {forms.map((form) => (
            <div
              key={form.id}
              className="border border-gray-200 rounded-lg shadow p-4 bg-white hover:shadow-md transition-shadow"
            >
              <div className="bg-theme text-white p-4 rounded mb-4 text-center">
                <h3 className="text-lg font-bold">Form ID: {form.id}</h3>
                <h4 className="text-md font-semibold">{form.title}</h4>
              </div>
              <p
                className="text-gray-600 mb-4"
                dangerouslySetInnerHTML={{
                  __html:
                    form.description?.length > 100
                      ? `${form.description.substring(0, 100)}...`
                      : form.description,
                }}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  icon={<EyeOutlined className="text-theme" />}
                  onClick={() => onSelectForm(form.id)}
                />
                <Button
                  icon={<DockerOutlined className="text-theme" />}
                  onClick={() =>
                    router.push(`/formbuilder/form-responses/${form.id}`)
                  }
                />
                <Popconfirm
                  title="Are you sure you want to delete this form?"
                  onConfirm={() => handleDeleteForm(form.id)}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined className="text-red-500" />}
                  />
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div
              key={form.id}
              className="border border-gray-200 rounded-lg shadow p-4 bg-white hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="bg-theme text-white p-4 rounded mb-4 text-center">
                  <h3 className="text-lg font-bold">Form ID: {form.id}</h3>
                  <h4 className="text-md font-semibold">{form.title}</h4>
                </div>
                <p
                  className="text-gray-600 mb-4"
                  dangerouslySetInnerHTML={{
                    __html:
                      form.description?.length > 100
                        ? `${form.description.substring(0, 100)}...`
                        : form.description,
                  }}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  icon={<EyeOutlined className="text-theme" />}
                  onClick={() => onSelectForm(form.id)}
                />
                <Button
                  icon={<DockerOutlined className="text-theme" />}
                  onClick={() =>
                    router.push(`/formbuilder/form-responses/${form.id}`)
                  }
                />
                <Popconfirm
                  title="Are you sure you want to delete this form?"
                  onConfirm={() => handleDeleteForm(form.id)}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined className="text-red-500" />}
                  />
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer
        title={`Form ${selectedFormId} Elements`}
        placement="right"
        onClose={() => onSelectForm(null)}
        open={drawerVisible}
        width="60vw"
      >
        <div className="flex justify-end mb-4">
          <Button
            className="bg-theme text-white"
            onClick={() => {
              router.push(`/formbuilder/edit-form?id=${selectedFormId}`);
              onSelectForm(null);
            }}
          >
            Edit Form
          </Button>
        </div>
        {selectedFormId && (
          <MaveFormElements
            formId={selectedFormId}
            setDrawerVisible={setDrawerVisible}
          />
        )}
      </Drawer>
    </div>
  );
};

export default MaveFormsList;
