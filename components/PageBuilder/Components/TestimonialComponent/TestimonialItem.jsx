// components/PageBuilder/Components/TestimonialComponent/TestimonialItem.jsx

import React from "react";
import { Card, Rate, Button, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Image from "next/image";

const TestimonialItem = ({
  testimonial,
  onEdit,
  onDelete,
  font,
  color,
  background,
}) => {
  const getImageUrl = () => {
    if (!testimonial.image) return null;
    const imagePath =
      typeof testimonial.image === "string"
        ? testimonial.image
        : testimonial.image.file_path;
    const baseUrl = process.env.NEXT_PUBLIC_MEDIA_URL || "";
    return `${baseUrl}/${imagePath}`;
  };

  return (
    <Card
      style={{
        fontFamily: font,
        color: color,
        backgroundColor: background,
        margin: "10px",
      }}
      bordered
      hoverable
      actions={[
        <Tooltip title="Edit">
          <Button type="text" icon={<EditOutlined />} onClick={onEdit} />
        </Tooltip>,
        <Tooltip title="Delete">
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={onDelete}
            danger
          />
        </Tooltip>,
      ]}
    >
      {testimonial.image && (
        <Image
          src={getImageUrl()}
          alt={testimonial.author}
          className="w-full h-32 object-cover rounded-md mb-4"
          layout="responsive"
          width={250}
          height={200}
          objectFit="cover"
        />
      )}
      <p className="italic">"{testimonial.quote}"</p>
      <div className="flex justify-between items-center mt-4">
        <span className="font-semibold">{testimonial.author}</span>
        <Rate disabled defaultValue={testimonial.rating} />
      </div>
    </Card>
  );
};

export default TestimonialItem;
