// components/PageBuilder/Components/TestimonialComponent/TestimonialItem.jsx

import React from "react";
import { Card, Rate, Button, Tooltip, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const TestimonialItem = ({
  testimonial,
  onEdit,
  onDelete,
  onEditAltContent,
  font,
  color,
  background,
  preview = false,
  isEditMode,
  showAltContent = false,
  getDisplayContent,
  testimonialIndex,
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

  // Get display content based on language preference
  const displayContent = getDisplayContent
    ? getDisplayContent(testimonial, showAltContent)
    : {
        quote: testimonial.quote || "",
        author: testimonial.author || "",
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
      actions={
        isEditMode
          ? [
              <Tooltip title="Edit">
                <Button type="text" icon={<EditOutlined />} onClick={onEdit} />
              </Tooltip>,
              <Tooltip title="Edit Alternative Content">
                <Button
                  type="text"
                  icon={<GlobalOutlined />}
                  onClick={() =>
                    onEditAltContent && onEditAltContent(testimonialIndex)
                  }
                />
              </Tooltip>,
              <Tooltip title="Delete">
                <Popconfirm
                  title="Delete Testimonial"
                  description="Are you sure you want to delete this testimonial?"
                  onConfirm={onDelete}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Button type="text" icon={<DeleteOutlined />} danger />
                </Popconfirm>
              </Tooltip>,
            ]
          : null
      }
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
      <p className="italic">"{displayContent.quote}"</p>
      <div className="flex justify-between items-center mt-4">
        <span className="font-semibold">{displayContent.author}</span>
        <Rate disabled defaultValue={testimonial.rating} />
      </div>
    </Card>
  );
};

export default TestimonialItem;
