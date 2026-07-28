import React, { useState } from "react";
import { Card, Button, Tooltip, Input, Form } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import RichTextEditor from "../../../RichTextEditor";
import styles from "./InfoBoxItem.module.css";

const InfoBoxItem = ({
  item,
  onEdit,
  onDelete,
  onUpdate,
  font,
  color,
  background,
  preview = false,
  showAltContent = false,
}) => {
  const [isEditingAlt, setIsEditingAlt] = useState(false);
  const [tempAltTitle, setTempAltTitle] = useState(item.altTitle || "");
  const [tempAltDescription, setTempAltDescription] = useState(
    item.altDescription || ""
  );

  // Helper function to get display content based on language preference
  const getDisplayContent = () => {
    if (showAltContent) {
      return {
        title: item.altTitle || item.title || "",
        description: item.altDescription || item.description || "",
      };
    }
    return {
      title: item.title || "",
      description: item.description || "",
    };
  };

  const displayContent = getDisplayContent();

  const handleEditAltContent = () => {
    setTempAltTitle(item.altTitle || "");
    setTempAltDescription(item.altDescription || "");
    setIsEditingAlt(true);
  };

  const handleSaveAltContent = () => {
    if (onUpdate) {
      onUpdate({
        ...item,
        altTitle: tempAltTitle,
        altDescription: tempAltDescription,
      });
    }
    setIsEditingAlt(false);
  };

  const handleCancelAltContent = () => {
    setTempAltTitle(item.altTitle || "");
    setTempAltDescription(item.altDescription || "");
    setIsEditingAlt(false);
  };

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
              <Tooltip title="Edit Alt Content">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={handleEditAltContent}
                  style={{ color: "#1890ff" }}
                />
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
      <h4 className={styles.title}>{displayContent.title}</h4>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: displayContent.description }}
      />

      {/* Alt Content Editing Section */}
      {!preview && isEditingAlt && (
        <div className="mt-4 p-3 bg-gray-200 rounded border">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alternative Title
            </label>
            <Input
              value={tempAltTitle}
              onChange={(e) => setTempAltTitle(e.target.value)}
              placeholder="Enter alternative title"
              size="small"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alternative Description
            </label>
            <RichTextEditor
              defaultValue={tempAltDescription}
              onChange={setTempAltDescription}
              editMode={true}
              maxLength={1000}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              size="small"
              onClick={handleCancelAltContent}
              className="mavecancelbutton"
            >
              Cancel
            </Button>
            <Button
              size="small"
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleSaveAltContent}
              className="mavebutton"
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default InfoBoxItem;
