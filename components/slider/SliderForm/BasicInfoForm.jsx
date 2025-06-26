// components/slider/SliderForm/BasicInfoForm.jsx

import React from "react";
import { Form, Input, Select } from "antd";
import RichTextEditor from "../../RichTextEditor";

const BasicInfoForm = ({ allTags, form }) => (
  <>
    {/* Title in English */}
    <Form.Item
      label="Title English"
      name="title_en"
      rules={[
        { required: true, message: "Please enter the title in English." },
      ]}
    >
      <Input placeholder="Enter title in English" />
    </Form.Item>

    {/* Title in Bangla */}
    <Form.Item
      label="Title Bangla"
      name="title_bn"
      rules={[{ required: true, message: "Please enter the title in Bangla." }]}
    >
      <Input placeholder="Enter title in Bangla" />
    </Form.Item>

    {/* Description in English */}
    <Form.Item
      label="Description English"
      name="description_en"
      rules={[
        {
          required: true,
          message: "Please enter the description in English.",
        },
      ]}
    >
      <RichTextEditor
        editMode={true}
        defaultValue={form.getFieldValue("description_en") || ""}
      />
    </Form.Item>

    {/* Description in Bangla */}
    <Form.Item
      label="Description Bangla"
      name="description_bn"
      rules={[
        {
          required: true,
          message: "Please enter the description in Bangla.",
        },
      ]}
    >
      <RichTextEditor
        editMode={true}
        defaultValue={form.getFieldValue("description_bn") || ""}
      />
    </Form.Item>

    {/* Tags */}
    {/* <Form.Item label="Tags" name="tags">
      <Select
        mode="tags"
        placeholder="Select or add tags"
        style={{ width: "100%" }}
      >
        {allTags.map((tag) => (
          <Select.Option key={tag} value={tag}>
            {tag}
          </Select.Option>
        ))}
      </Select>
    </Form.Item> */}
  </>
);

export default BasicInfoForm;
