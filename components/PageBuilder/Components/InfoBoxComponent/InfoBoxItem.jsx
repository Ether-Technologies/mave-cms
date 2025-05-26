import React from "react";
import { Card, Button, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Image from "next/image";

const InfoBoxItem = ({
  item,
  onEdit,
  onDelete,
  font,
  color,
  background,
  preview = false,
}) => {
  return (
    <Card
      style={{
        fontFamily: font,
        color: color,
        backgroundColor: background,
      }}
      bordered
      hoverable
      actions={
        !preview
          ? [
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
            ]
          : null
      }
    >
      {item.media && item.media.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {item.media.map((media, index) => (
            <Image
              key={index}
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
              alt={media.title_en || "Media"}
              width={100}
              height={100}
              objectFit="cover"
              className="rounded-md"
            />
          ))}
        </div>
      )}
      <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
      <p className="text-gray-600">{item.description}</p>
    </Card>
  );
};

export default InfoBoxItem;
