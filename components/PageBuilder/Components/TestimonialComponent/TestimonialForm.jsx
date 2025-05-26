import React from "react";
import { Form, Input, Rate, Button, Space } from "antd";
import Image from "next/image";

const TestimonialForm = ({
  form,
  onFinish,
  selectedImage,
  onImageSelect,
  onCancel,
  isEdit = false,
}) => {
  const getImageUrl = () => {
    if (!selectedImage) return null;
    const imagePath =
      typeof selectedImage === "string"
        ? selectedImage
        : selectedImage.file_path;
    const baseUrl = process.env.NEXT_PUBLIC_MEDIA_URL || "";
    return `${baseUrl}/${imagePath}`;
  };

  const handleSubmit = (values) => {
    if (!values.quote || !values.author) return;

    onFinish({
      ...values,
      image: selectedImage,
    });
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleSubmit}
      initialValues={{
        rating: 5,
        image: selectedImage,
      }}
    >
      <Form.Item
        label="Quote"
        name="quote"
        rules={[{ required: true, message: "Please enter the quote." }]}
      >
        <Input.TextArea rows={4} placeholder="Enter customer quote" />
      </Form.Item>
      <Form.Item
        label="Author"
        name="author"
        rules={[{ required: true, message: "Please enter the author's name." }]}
      >
        <Input placeholder="Enter author's name" />
      </Form.Item>
      <Form.Item label="Rating" name="rating" initialValue={5}>
        <Rate />
      </Form.Item>
      <Form.Item label="Image" name="image">
        <Button onClick={onImageSelect}>
          {selectedImage ? "Change Image" : "Select Image"}
        </Button>
        {selectedImage && (
          <div className="mt-2">
            <div className="relative w-[100px] h-[100px]">
              <Image
                src={getImageUrl()}
                alt={
                  typeof selectedImage === "string"
                    ? "Selected"
                    : selectedImage.title || "Selected"
                }
                width={100}
                height={100}
                className="object-cover rounded-md"
                unoptimized
              />
            </div>
          </div>
        )}
      </Form.Item>
      <Form.Item>
        <Space>
          <Button className="mavebutton" type="primary" htmlType="submit">
            {isEdit ? "Update Testimonial" : "Add Testimonial"}
          </Button>
          <Button className="mavecancelbutton" onClick={onCancel}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default TestimonialForm;
