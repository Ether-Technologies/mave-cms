import React, { useState } from "react";
import { Form, Input, Select, Button } from "antd";
import RichTextEditor from "./RichTextEditor";

const FormBuilder = () => {
  const [fields, setFields] = useState([]);
  const [form] = Form.useForm();

  const handleAddField = () => {
    const newField = {
      name: "",
      type: "text",
    };
    setFields([...fields, newField]);
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleSubmit = (values) => {
    const formObject = {
      title_en: values.title_en,
      title_bn: values.title_bn,
      description_en: values.description_en,
      description_bn: values.description_bn,
      fields: values.fields,
      submit_direction: values.submit_direction,
      status: values.status,
    };
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item label="Title (English)" name="title_en">
        <Input placeholder="Form Title (English)" />
      </Form.Item>
      <Form.Item label="Title (Bengali)" name="title_bn">
        <Input placeholder="ফর্ম শিরোনাম" />
      </Form.Item>
      <Form.Item label="Description (English)" name="description_en">
        <RichTextEditor
          defaultValue=""
          onChange={(html) => form.setFieldsValue({ description_en: html })}
          editMode={true}
          maxLength={2000}
        />
      </Form.Item>
      <Form.Item label="Description (Bengali)" name="description_bn">
        <RichTextEditor
          defaultValue=""
          onChange={(html) => form.setFieldsValue({ description_bn: html })}
          editMode={true}
          maxLength={2000}
        />
      </Form.Item>
      {fields?.map((field, index) => (
        <div key={index}>
          <Input.Group compact>
            <Form.Item
              label={`Field Name (${index + 1})`}
              name={["fields", index, "name"]}
              initialValue={field.name}
            >
              <Input placeholder="Field Name" />
            </Form.Item>
            <Form.Item
              label={`Field Type (${index + 1})`}
              name={["fields", index, "type"]}
              initialValue={field.type}
            >
              <Select style={{ width: 120 }} showSearch>
                <Select.Option value="text">Text</Select.Option>
                <Select.Option value="textarea">Textarea</Select.Option>
                <Select.Option value="email">Email</Select.Option>
                <Select.Option value="password">Password</Select.Option>
                <Select.Option value="phone">Phone</Select.Option>
              </Select>
            </Form.Item>
          </Input.Group>
          <Button type="dashed" onClick={() => handleRemoveField(index)}>
            Remove Field
          </Button>
        </div>
      ))}
      <Button type="dashed" onClick={handleAddField}>
        Add Field
      </Button>
      <Form.Item label="Submit Direction" name="submit_direction">
        <Input placeholder="https://example.com/submit-form" />
      </Form.Item>
      <Form.Item label="Status" name="status" valuePropName="checked">
        <Select style={{ width: 120 }} showSearch>
          <Select.Option value={true}>Active</Select.Option>
          <Select.Option value={false}>Inactive</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Form
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormBuilder;
