import React, { useState, useRef } from "react";
import { Button, Form, Input, Select } from "antd";
import useForm from "./UseForm";
import RichTextEditor from "./RichTextEditor";

const FormComponent = ({ formData }) => {
  const [editMode, setEditMode] = useState(false);
  const { form, handleChange, handleSubmit } = useForm({
    title_en: formData.title_en,
    title_bn: formData.title_bn,
    description_en: formData.description_en,
    description_bn: formData.description_bn,
    submit_direction: formData.submit_direction,
    status: formData.status,
    fields: JSON.parse(formData.fields),
  });

  return (
    <div
      className="formContainer"
      style={{
        display: "grid",
        padding: "2em",
        border: "1px solid #e8e8e8",
        marginBottom: "2em",
        borderRadius: "5px",
      }}
    >
      <Form
        name="basic"
        onFinish={handleSubmit}
        onChange={(e) => handleChange(e)}
      >
        <Form.Item label="Title (English)">
          <Input
            name="title_en"
            initialValue={form.title_en}
            disabled={!editMode}
            placeholder={form.title_en}
          />
        </Form.Item>
        <Form.Item label="Title (Bengali)">
          <Input
            name="title_bn"
            initialValue={form.title_bn}
            disabled={!editMode}
            placeholder={form.title_bn}
          />
        </Form.Item>
        <Form.Item label="Description (English)">
          <RichTextEditor
            defaultValue={form.description_en}
            onChange={(html) => handleChange({ target: { value: html } }, "description_en")}
            editMode={editMode}
            maxLength={2000}
          />
        </Form.Item>
        <Form.Item label="Description (Bengali)">
          <RichTextEditor
            defaultValue={form.description_bn}
            onChange={(html) => handleChange({ target: { value: html } }, "description_bn")}
            editMode={editMode}
            maxLength={2000}
          />
        </Form.Item>
        <Form.Item label="Submit Direction">
          <Input
            name="submit_direction"
            initialValue={form.submit_direction}
            disabled={!editMode}
            placeholder={form.submit_direction}
          />
        </Form.Item>
        <Form.Item label="Status">
          <Select
            showSearch
            name="status"
            // initialValue={form.status}
            disabled={!editMode}
          // defaultValue={form.status}
          >
            <Select.Option value="1">Active</Select.Option>
            <Select.Option value="0">Inactive</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Fields">
          {/* {JSON.parse(form.fields)?.map((field, index) => ( */}
          {JSON.parse(JSON.stringify(form.fields))?.map((field, index) => (
            <div key={index}>
              <Input.Group name="fields" compact>
                <Input
                  placeholder={field.name}
                  initialValue={field.name}
                  disabled={!editMode}
                />
                <Select
                  defaultValue={field.type}
                  disabled={!editMode}
                  showSearch
                >
                  <Select.Option initialValue="text">Text</Select.Option>
                  <Select.Option initialValue="email">Email</Select.Option>
                  <Select.Option initialValue="textarea">
                    Textarea
                  </Select.Option>
                </Select>
              </Input.Group>
            </div>
          ))}
        </Form.Item>
        <Form.Item>
          {editMode ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <Button htmlType="submit">Update</Button>
              <Button type="primary" danger onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button type="primary" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormComponent;
