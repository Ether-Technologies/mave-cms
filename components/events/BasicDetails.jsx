import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Radio,
  Select,
  Button,
  message,
} from "antd";
import { useState } from "react";
import MediaSelectionModal from "../PageBuilder/Modals/MediaSelectionModal";
import Image from "next/image";
import RichTextEditor from "../RichTextEditor";
const { Option } = Select;

const BasicDetails = ({ form }) => {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  const handleMediaSelect = (mediaArray) => {
    if (mediaArray.length > 3) {
      message.warning("You can select up to 3 images.");
      return;
    }
    form.setFieldsValue({
      images: mediaArray.map((media) => media.id),
      coverImage: mediaArray[0].id, // Default cover image
    });
    setSelectedMedia(mediaArray);
    setIsMediaModalOpen(false);
  };

  return (
    <>
      <Form.Item
        preserve={true}
        name="images"
        label="Event Images"
        rules={[
          { required: true, message: "Please select event images (up to 3)" },
        ]}
      >
        <Button
          className="mavebutton"
          onClick={() => setIsMediaModalOpen(true)}
        >
          Select Images
        </Button>
      </Form.Item>
      {selectedMedia.length > 0 && (
        <div className="flex space-x-4 mt-4">
          {selectedMedia?.map((media) => (
            <div key={media.id} className="relative">
              <Image
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
                alt={`Selected Image`}
                width={300}
                height={200}
                objectFit="cover"
                className={`border ${
                  form.getFieldValue("coverImage") === media.id
                    ? "border-gray-300"
                    : "border-gray-300"
                }`}
                onClick={() => form.setFieldsValue({ coverImage: media.id })}
              />
              {form.getFieldValue("coverImage") === media.id && (
                <span className="absolute top-0 left-0 bg-gray-200 text-white px-1 text-xs">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <Form.Item
        preserve={true}
        name="title"
        label="Event Title"
        rules={[{ required: true, message: "Please enter the event title" }]}
      >
        <Input placeholder="Enter event title" />
      </Form.Item>

      <Form.Item
        preserve={true}
        name="shortDescription"
        label="Short Description"
        rules={[
          { required: true, message: "Please enter a short description" },
          { max: 140, message: "Maximum 140 characters allowed" },
        ]}
      >
        <RichTextEditor
          defaultValue=""
          onChange={() => {}}
          editMode={true}
          maxLength={140}
        />
      </Form.Item>

      <Form.Item
        preserve={true}
        name="date"
        label="Event Date"
        rules={[{ required: true, message: "Please select the event date" }]}
      >
        <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item
        preserve={true}
        name="time"
        label="Event Time"
        rules={[{ required: true, message: "Please select the event time" }]}
      >
        <TimePicker
          style={{ width: "100%" }}
          format="h:mm A"
          use12Hours
          minuteStep={5}
        />
      </Form.Item>

      <Form.Item
        preserve={true}
        name="locationType"
        label="Location Type"
        rules={[{ required: true, message: "Please select the location type" }]}
      >
        <Radio.Group>
          <Radio value="On-Site">On-Site</Radio>
          <Radio value="Online">Online</Radio>
          <Radio value="Both">Both</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        preserve={true}
        name="ticketing"
        label="Ticketing Options"
        rules={[
          {
            required: true,
            message: "Please select at least one ticketing option",
          },
        ]}
      >
        <Select mode="multiple" placeholder="Select ticketing options">
          <Option value="No Ticket">No Ticket</Option>
          <Option value="Free">Free</Option>
          <Option value="Paid">Paid</Option>
        </Select>
      </Form.Item>

      <MediaSelectionModal
        isVisible={isMediaModalOpen}
        onSelectMedia={handleMediaSelect}
        onClose={() => setIsMediaModalOpen(false)}
        selectionMode="multiple"
        maxSelection={3}
        initialSelectedMedia={selectedMedia}
      />
    </>
  );
};

export default BasicDetails;
