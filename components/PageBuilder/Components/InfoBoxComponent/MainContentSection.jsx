import React from "react";
import { Form, Input, Button } from "antd";
import Image from "next/image";
import RichTextEditor from "../../../RichTextEditor";

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
          <RichTextEditor
            defaultValue={infoBox.description}
            onChange={(html) => {
              const updatedInfoBox = {
                ...infoBox,
                description: html,
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
            editMode={true}
            maxLength={2000}
          />
        </Form.Item>
        <Form.Item label="Second Title">
          <Input
            value={infoBox.secondTitle || ""}
            onChange={(e) => {
              const updatedInfoBox = {
                ...infoBox,
                secondTitle: e.target.value,
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
            placeholder="Enter second title (optional)"
          />
        </Form.Item>
        <Form.Item label="Second Description">
          <RichTextEditor
            defaultValue={infoBox.secondDescription || ""}
            onChange={(html) => {
              const updatedInfoBox = {
                ...infoBox,
                secondDescription: html,
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
            editMode={true}
            maxLength={2000}
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
          <RichTextEditor
            defaultValue={infoBox.altDescription || ""}
            onChange={(html) => {
              const updatedInfoBox = {
                ...infoBox,
                altDescription: html,
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
            editMode={true}
            maxLength={2000}
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
