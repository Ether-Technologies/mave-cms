import React from "react";
import { Form, Input, Button } from "antd";
import Image from "next/image";
import RichTextEditor from "../../../RichTextEditor";

const AddInfoItemForm = ({ form, onFinish, onMediaSelect, selectedMedia }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the title." }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter the description." }]}
        >
          <RichTextEditor
            defaultValue=""
            onChange={(html) => form.setFieldValue("description", html)}
            editMode={true}
            maxLength={2000}
          />
        </Form.Item>
        <Form.Item label="Second Title" name="secondTitle">
          <Input placeholder="Enter second title (optional)" />
        </Form.Item>
        <Form.Item label="Second Description" name="secondDescription">
          <RichTextEditor
            defaultValue=""
            onChange={(html) => form.setFieldValue("secondDescription", html)}
            editMode={true}
            maxLength={2000}
          />
        </Form.Item>
        <Form.Item
          label="Link"
          name="link"
          rules={[{ type: "url", message: "Please enter a valid URL" }]}
        >
          <Input placeholder="Enter link URL (optional)" />
        </Form.Item>
        <Form.Item label="Alternative Title" name="altTitle">
          <Input placeholder="Enter alternative title (optional)" />
        </Form.Item>
        <Form.Item label="Alternative Description" name="altDescription">
          <RichTextEditor
            defaultValue=""
            onChange={(html) => form.setFieldValue("altDescription", html)}
            editMode={true}
            maxLength={2000}
          />
        </Form.Item>
        <Form.Item label="Media">
          <Button
            className="mavebutton"
            onClick={() => onMediaSelect("multiple")}
          >
            Select Media
          </Button>
          {selectedMedia && selectedMedia.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedMedia.map((media, index) => (
                <Image
                  key={index}
                  src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
                  alt={media.title || media.title_en || "Media"}
                  width={50}
                  height={50}
                  objectFit="cover"
                  className="rounded-md"
                />
              ))}
            </div>
          )}
        </Form.Item>
        <Form.Item>
          <Button className="mavebutton" htmlType="submit">
            {form.getFieldValue("id") ? "Update Info Item" : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddInfoItemForm;
