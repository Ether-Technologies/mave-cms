import React from "react";
import { Form, Input, Button } from "antd";
import Image from "next/image";

const MainContentSection = ({
  infoBox,
  onInfoBoxChange,
  onMediaSelect,
  media,
}) => {
  return (
    <div className="mb-4">
      <Form layout="vertical">
        <Form.Item label="Title">
          <Input
            value={infoBox.title}
            onChange={(e) =>
              onInfoBoxChange({ ...infoBox, title: e.target.value })
            }
            placeholder="Enter title"
          />
        </Form.Item>
        <Form.Item label="Description">
          <Input.TextArea
            value={infoBox.description}
            onChange={(e) =>
              onInfoBoxChange({ ...infoBox, description: e.target.value })
            }
            placeholder="Enter description"
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
