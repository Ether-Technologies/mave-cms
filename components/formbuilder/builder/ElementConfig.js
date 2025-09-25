// components/formbuilder/builder/ElementConfig.js

import React, { useEffect, useState } from "react";
import { Button, Input, Switch, Modal } from "antd";
import MediaSelectionModal from "../../PageBuilder/Modals/MediaSelectionModal.jsx";
import RichTextEditor from "../../RichTextEditor";

const ElementConfig = ({ element, onUpdate }) => {
  const [label, setLabel] = useState(element.label || "");
  const [placeholder, setPlaceholder] = useState(element.placeholder || "");
  const [options, setOptions] = useState(element.options || []);
  const [divisionLabel, setDivisionLabel] = useState(
    element.divisionLabel || "Select Division"
  );
  const [districtLabel, setDistrictLabel] = useState(
    element.districtLabel || "Select District"
  );
  const [required, setRequired] = useState(!!element.required);

  // For "guideline"
  const [content, setContent] = useState(element.content || "");

  // For "media"
  const [mediaId, setMediaId] = useState(element.mediaId || null);
  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false);

  // Update parent any time local state changes
  useEffect(() => {
    onUpdate({
      ...element,
      label,
      placeholder,
      options,
      divisionLabel,
      districtLabel,
      required,
      content,
      mediaId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    label,
    placeholder,
    options,
    divisionLabel,
    districtLabel,
    required,
    content,
    mediaId,
  ]);

  // Options handlers (for radio/select)
  const addOption = () => {
    const newOption = { _id: Date.now().toString(), title: "", value: "" };
    setOptions((prev) => [...prev, newOption]);
  };

  const updateOption = (index, field, value) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const removeOption = (index) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  // Media selection
  const handleSelectMedia = (selectedMedia) => {
    // If single, we get the item directly
    setMediaId(selectedMedia?.id || null);
  };

  return (
    <div className="bg-gray-100 p-4 rounded mb-4">
      {/* REQUIRED TOGGLE */}
      <label className="block font-semibold mb-1">Required Field?</label>
      <Switch
        checked={required}
        onChange={(checked) => setRequired(checked)}
        className="mb-4"
        checkedChildren="Yes"
        unCheckedChildren="No"
      />

      {/* Only show label/placeholder for "input", "textarea", etc. */}
      {(element.element_type === "input" ||
        element.element_type === "textarea" ||
        element.element_type === "select" ||
        element.element_type === "button") && (
          <>
            <label className="block font-semibold mb-1">Label</label>
            <Input
              className="mb-4"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />

            <label className="block font-semibold mb-1">Placeholder</label>
            <Input
              className="mb-4"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
            />
          </>
        )}

      {element.element_type === "input" && element.input_type === "radio" && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Radio Options</label>
          {options.map((opt, idx) => (
            <div key={opt._id} className="flex items-center mb-2 gap-2">
              <Input
                placeholder="Title"
                value={opt.title}
                onChange={(e) => updateOption(idx, "title", e.target.value)}
              />
              <Input
                placeholder="Value"
                value={opt.value}
                onChange={(e) => updateOption(idx, "value", e.target.value)}
              />
              <Button danger onClick={() => removeOption(idx)}>
                Remove
              </Button>
            </div>
          ))}
          <Button onClick={addOption}>Add Option</Button>
        </div>
      )}

      {element.element_type === "select" && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Select Options</label>
          {options.map((opt, idx) => (
            <div key={opt._id} className="flex items-center mb-2 gap-2">
              <Input
                placeholder="Title"
                value={opt.title}
                onChange={(e) => updateOption(idx, "title", e.target.value)}
              />
              <Input
                placeholder="Value"
                value={opt.value}
                onChange={(e) => updateOption(idx, "value", e.target.value)}
              />
              <Button danger onClick={() => removeOption(idx)}>
                Remove
              </Button>
            </div>
          ))}
          <Button onClick={addOption}>Add Option</Button>
        </div>
      )}

      {element.element_type === "location" && (
        <>
          <label className="block font-semibold mb-1">Division Label</label>
          <Input
            className="mb-4"
            value={divisionLabel}
            onChange={(e) => setDivisionLabel(e.target.value)}
          />

          <label className="block font-semibold mb-1">District Label</label>
          <Input
            className="mb-4"
            value={districtLabel}
            onChange={(e) => setDistrictLabel(e.target.value)}
          />
        </>
      )}

      {/* GUIDELINE element */}
      {element.element_type === "guideline" && (
        <>
          <label className="block font-semibold mb-1">Guideline Text</label>
          <RichTextEditor
            defaultValue={content}
            onChange={(html) => setContent(html)}
            editMode={true}
            maxLength={2000}
          />
        </>
      )}

      {/* MEDIA element */}
      {element.element_type === "media" && (
        <>
          <label className="block font-semibold mb-1">Media ID</label>
          <Input
            className="mb-2"
            value={mediaId || ""}
            placeholder="Selected Media ID"
            readOnly
          />
          <Button onClick={() => setIsMediaModalVisible(true)}>
            Select Media
          </Button>
          <MediaSelectionModal
            isVisible={isMediaModalVisible}
            onClose={() => setIsMediaModalVisible(false)}
            onSelectMedia={handleSelectMedia}
            selectionMode="single"
          />
        </>
      )}
    </div>
  );
};

export default ElementConfig;
