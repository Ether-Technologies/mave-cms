// components/PageBuilder/Sections/SectionHeader.jsx

import React, { useState } from "react";
import { Input, Button, Modal, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  DragOutlined,
} from "@ant-design/icons";

const SectionHeader = ({
  section,
  updateSection,
  deleteSection,
  dragHandleProps,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.sectionTitle);
  const [originalTitle, setOriginalTitle] = useState(section.sectionTitle); // To store the original title

  // Handle entering edit mode
  const handleEdit = () => {
    setOriginalTitle(title); // Save the current title before editing
    setIsEditing(true);
  };

  // Handle submitting the edited title
  const handleSubmit = () => {
    if (title.trim() === "") {
      Modal.error({
        title: "Validation Error",
        content: "Section title cannot be empty.",
      });
      return;
    }
    updateSection({ ...section, sectionTitle: title, _category: "root" });
    setIsEditing(false);
  };

  // Handle canceling the edit
  const handleCancel = () => {
    setTitle(originalTitle); // Revert to the original title
    setIsEditing(false);
  };

  return (
    <div className="section-header flex justify-between items-center mb-4">
      {/* Left Side: Drag Handle and Title/Input */}
      <div className="flex items-center">
        <Button {...dragHandleProps} icon={<DragOutlined />} />
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onPressEnter={handleSubmit}
            className="ml-2 w-72"
            autoFocus
            allowClear
          />
        ) : (
          <h2
            className="text-xl font-bold ml-2 cursor-pointer"
            onClick={handleEdit}
          >
            {section.sectionTitle}
          </h2>
        )}
      </div>

      {/* Right Side: Edit/Delete or Submit/Cancel Buttons */}
      <div>
        {!isEditing ? (
          <>
            <Button
              icon={<EditOutlined />}
              onClick={handleEdit}
              className="mr-2"
            />
            <Popconfirm
              title="Delete Section"
              description="Are you sure you want to delete this section? This action cannot be undone."
              onConfirm={deleteSection}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button icon={<DeleteOutlined />} className="mavecancelbutton" />
            </Popconfirm>
          </>
        ) : (
          <>
            <Button
              icon={<CheckOutlined />}
              onClick={handleSubmit}
              className="mavebutton"
            >
              Submit
            </Button>
            <Button
              icon={<CloseOutlined />}
              onClick={handleCancel}
              className="mavecancelbutton"
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
