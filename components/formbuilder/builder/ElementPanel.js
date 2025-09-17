// components/formbuilder/builder/ElementPanel.js

import React from "react";
import { Card } from "antd";
import DraggableElement from "./DraggableElement";
import {
  EditOutlined,
  MailOutlined,
  NumberOutlined,
  LockOutlined,
  PhoneOutlined,
  CalendarOutlined,
  CheckOutlined,
  SwapOutlined,
  AlignLeftOutlined,
  UploadOutlined,
  EnvironmentOutlined,
  SaveOutlined,
  ReloadOutlined,
  FileTextOutlined,
  PictureOutlined,
} from "@ant-design/icons";

const elements = [
  {
    type: "input",
    label: "Text Input",
    icon: <EditOutlined />,
    element_type: "input",
    input_type: "text",
    placeholder: "Enter your text",
  },
  {
    type: "input",
    label: "Email",
    icon: <MailOutlined />,
    element_type: "input",
    input_type: "email",
    placeholder: "Enter your email",
  },
  {
    type: "input",
    label: "Number",
    icon: <NumberOutlined />,
    element_type: "input",
    input_type: "number",
    placeholder: "Enter a number",
  },
  {
    type: "input",
    label: "Password",
    icon: <LockOutlined />,
    element_type: "input",
    input_type: "password",
    placeholder: "Enter a password",
  },
  {
    type: "input",
    label: "Phone",
    icon: <PhoneOutlined />,
    element_type: "input",
    input_type: "tel",
    placeholder: "Enter a phone number",
  },
  {
    type: "input",
    label: "Date",
    icon: <CalendarOutlined />,
    element_type: "input",
    input_type: "date",
    placeholder: "Select a date",
  },
  {
    type: "input",
    label: "Radio",
    icon: <CheckOutlined />,
    element_type: "input",
    input_type: "radio",
    placeholder: null,
    options: [],
  },
  {
    type: "select",
    label: "Select",
    icon: <SwapOutlined />,
    element_type: "select",
    placeholder: "Select an option",
    options: [],
  },
  {
    type: "location",
    label: "Location",
    icon: <EnvironmentOutlined />,
    element_type: "location",
  },
  {
    type: "textarea",
    label: "Textarea",
    icon: <AlignLeftOutlined />,
    element_type: "textarea",
    placeholder: "Enter your message",
  },
  {
    type: "file",
    label: "File Upload",
    icon: <UploadOutlined />,
    element_type: "input",
    input_type: "file",
    placeholder: "Upload a file",
  },
  {
    type: "button",
    label: "Submit",
    icon: <CheckOutlined />,
    element_type: "button",
    input_type: "submit",
    placeholder: "Submit",
  },
  {
    type: "button",
    label: "Save Draft",
    icon: <SaveOutlined />,
    element_type: "button",
    input_type: "save",
    placeholder: "Save Draft",
  },
  {
    type: "button",
    label: "Reset",
    icon: <ReloadOutlined />,
    element_type: "button",
    input_type: "reset",
    placeholder: "Reset",
  },

  // 1) New "Guideline" element
  {
    type: "guideline",
    label: "Guideline",
    icon: <FileTextOutlined />,
    element_type: "guideline",
    content: "This is a paragraph or guideline text.",
  },

  // 2) New "Media" element
  {
    type: "media",
    label: "Media",
    icon: <PictureOutlined />,
    element_type: "media",
    mediaId: null, // or "placeholder-id"
  },
];

const ElementPanel = () => {
  return (
    <>
      <h3 className="text-center text-lg sm:text-xl font-bold px-2">Elements</h3>
      <Card className="border-2 border-theme p-2 sm:p-4 h-[65vh] overflow-auto mt-4 sm:mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2 sm:gap-4">
          {elements.map((element, index) => (
            <DraggableElement key={index} element={element} />
          ))}
        </div>
      </Card>
    </>
  );
};

export default ElementPanel;
