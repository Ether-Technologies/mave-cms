import React from "react";
import { Form, Input, Button } from "antd";
import Image from "next/image";

const MainContentSection = ({
  infoBox,
  onInfoBoxChange,
  onMediaSelect,
  media,
  updateComponent,
  component,
  layout,
  font,
  color,
  background,
  showAltContent,
}) => {
  return (
    <div className="mb-4">
      <Form layout="vertical">
        <Form.Item label="Title">
          <Input
            value={infoBox.title}
            onChange={(e) => {
              const updatedInfoBox = { ...infoBox, title: e.target.value };
              onInfoBoxChange(updatedInfoBox);
              // Also update component immediately
              updateComponent({
                ...component,
                _mave: {
                  ...updatedInfoBox,
                  layout,
                  font,
                  color,
                  background,
                  showAltContent,
                },
              });
            }}
            placeholder="Enter title"
          />
        </Form.Item>
        <Form.Item label="Description">
          <Input.TextArea
            value={infoBox.description}
            onChange={(e) => {
              const updatedInfoBox = {
                ...infoBox,
                description: e.target.value,
              };
              onInfoBoxChange(updatedInfoBox);
              // Also update component immediately
              updateComponent({
                ...component,
                _mave: {
                  ...updatedInfoBox,
                  layout,
                  font,
                  color,
                  background,
                  showAltContent,
                },
              });
            }}
            placeholder="Enter description"
            rows={4}
          />
        </Form.Item>
        <Form.Item label="Alternative Title">
          <Input
            value={infoBox.altTitle || ""}
            onChange={(e) => {
              const updatedInfoBox = { ...infoBox, altTitle: e.target.value };
              onInfoBoxChange(updatedInfoBox);
              // Also update component immediately
              updateComponent({
                ...component,
                _mave: {
                  ...updatedInfoBox,
                  layout,
                  font,
                  color,
                  background,
                  showAltContent,
                },
              });
            }}
            placeholder="Enter alternative title (optional)"
          />
        </Form.Item>
        <Form.Item label="Alternative Description">
          <Input.TextArea
            value={infoBox.altDescription || ""}
            onChange={(e) => {
              const updatedInfoBox = {
                ...infoBox,
                altDescription: e.target.value,
              };
              onInfoBoxChange(updatedInfoBox);
              // Also update component immediately
              updateComponent({
                ...component,
                _mave: {
                  ...updatedInfoBox,
                  layout,
                  font,
                  color,
                  background,
                  showAltContent,
                },
              });
            }}
            placeholder="Enter alternative description (optional)"
            rows={4}
          />
        </Form.Item>
        <Form.Item label="Main Media">
          <div className="flex gap-2 items-center">
            <Button
              className="mavebutton"
              onClick={() => onMediaSelect("single")}
            >
              Select Media
            </Button>
            {media && media.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2 cursor-pointer">
                {media.map((mediaItem, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer"
                    onClick={() => onMediaSelect("single")}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${mediaItem.file_path}`}
                      alt={mediaItem.title || mediaItem.title_en || "Media"}
                      width={200}
                      height={200}
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 text-gray-500">No media selected</div>
            )}
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MainContentSection;
