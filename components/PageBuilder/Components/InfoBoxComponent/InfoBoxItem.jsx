import React from "react";
import { Card, Button, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Image from "next/image";
import styles from "./InfoBoxItem.module.css";

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
      className={styles.infoItemCard}
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
        <div className={styles.mediaContainer}>
          {item.media.map((media, index) => (
            <Image
              key={index}
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
              alt={media.title || media.title_en || "Media"}
              width={120}
              height={120}
              objectFit="cover"
              className={styles.mediaImage}
            />
          ))}
        </div>
      )}
      <h4 className={styles.title}>{item.title}</h4>
      <p className={styles.description}>{item.description}</p>
    </Card>
  );
};

export default InfoBoxItem;
