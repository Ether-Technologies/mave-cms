// components/formbuilder/builder/FormElement.js
import React, { useRef, useState } from "react";
import { Button, Radio, Select, Input, Popconfirm, Upload, Switch } from "antd";
import { useDrag, useDrop } from "react-dnd";
import ElementConfig from "./ElementConfig";
import LocationFetcher from "../LocationFetcher";
import RichTextEditor from "../../RichTextEditor";

const { Option } = Select;

const FormElement = ({
  element,
  index,
  moveElement = () => { },
  onUpdateElement = () => { },
  isPreview = false, // New prop to disable editing in preview
}) => {
  const ref = useRef(null);
  const [configVisible, setConfigVisible] = useState(false);

  // DRAG
  const [{ isDragging }, dragRef] = useDrag({
    type: "formElement",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isPreview, // Disable drag if preview mode
  });

  // DROP
  const [, dropRef] = useDrop({
    accept: "formElement",
    hover: (draggedItem) => {
      if (isPreview) return; // No reorder in preview
      if (!ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveElement(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
    canDrop: () => !isPreview,
  });

  dragRef(dropRef(ref));

  const handleRemove = () => {
    if (isPreview) return;
    onUpdateElement(null, index);
  };

  const handleConfigChange = (updatedElement) => {
    onUpdateElement(updatedElement, index);
  };

  // For the display
  const renderPreview = () => {
    // Example "required" star if needed
    const requiredStar = element.required ? " *" : "";

    switch (element.element_type) {
      case "input":
        if (element.input_type === "radio") {
          return (
            <Radio.Group disabled>
              {element.options?.map((opt) => (
                <Radio key={opt._id} value={opt.value}>
                  {opt.title}
                </Radio>
              ))}
            </Radio.Group>
          );
        }
        if (element.input_type === "file") {
          return (
            <Upload disabled>
              <Button>Upload (Disabled Preview)</Button>
            </Upload>
          );
        }
        if (["submit", "save", "reset"].includes(element.input_type)) {
          return (
            <Button disabled>{element.placeholder || element.label}</Button>
          );
        }
        // text, email, number, password, tel, date
        return (
          <Input
            disabled
            type={element.input_type}
            placeholder={element.placeholder}
            addonAfter={requiredStar}
          />
        );

      case "textarea":
        return (
          <RichTextEditor
            defaultValue={element.placeholder}
            onChange={() => { }}
            editMode={false}
            maxLength={2000}
          />
        );

      case "select":
        return (
          <Select
            disabled
            placeholder={element.placeholder}
            style={{ width: "100%" }}
          >
            {element.options?.map((opt) => (
              <Option key={opt._id} value={opt.value}>
                {opt.title}
              </Option>
            ))}
          </Select>
        );

      case "location":
        return (
          <LocationFetcher
            divisionLabel={element.divisionLabel}
            districtLabel={element.districtLabel}
          />
        );

      case "button":
        return (
          <Button disabled>
            {element.placeholder || element.label || "Button"}
          </Button>
        );

      // New: "guideline" => just render a paragraph
      case "guideline":
        return (
          <div className="p-2 bg-gray-50 border-l-4 border-brand">
            <p className="text-gray-600 whitespace-pre-line">
              {element.content}
            </p>
          </div>
        );

      // New: "media"
      case "media":
        // If we have a mediaId, show a placeholder or image; real usage requires more logic
        return element.mediaId ? (
          <p>
            Media selected with ID: <strong>{element.mediaId}</strong>
          </p>
        ) : (
          <p>No media selected yet.</p>
        );

      default:
        return <p className="text-gray-500 italic">Unknown element type</p>;
    }
  };

  return (
    <div
      ref={ref}
      className={`border rounded p-4 mb-2 bg-white transition-shadow ${isPreview ? "" : "cursor-move"
        } ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-lg">
          {element.label}
          {element.required && <span className="text-red-500 ml-1">*</span>}
        </h4>

        {/* Hide these buttons in preview mode */}
        {!isPreview && (
          <div className="flex items-center gap-2">
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setConfigVisible(!configVisible);
              }}
            >
              {configVisible ? "Hide Config" : "Show Config"}
            </Button>
            <Popconfirm
              title="Remove this item?"
              onConfirm={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button size="small" danger>
                Remove
              </Button>
            </Popconfirm>
          </div>
        )}
      </div>

      <div className="my-2">{renderPreview()}</div>

      {/* Config panel for editing element metadata - hidden in preview */}
      {!isPreview && configVisible && (
        <ElementConfig element={element} onUpdate={handleConfigChange} />
      )}
    </div>
  );
};

export default FormElement;
