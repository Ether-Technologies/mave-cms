import React, { useState } from "react";
import { Modal, Button, Input, Select, Space, message } from "antd";
import { EditOutlined, CheckOutlined } from "@ant-design/icons";
import RichTextEditor from "../RichTextEditor";
const { Option } = Select;

const AIAssistantModal = ({ visible, setVisible, content, setContent }) => {
  const [improvementType, setImprovementType] = useState("grammar");
  const [improvedContent, setImprovedContent] = useState("");
  const [loading, setLoading] = useState(false);

  const improvementOptions = [
    { value: "grammar", label: "Grammar & Spelling" },
    { value: "clarity", label: "Clarity & Readability" },
    { value: "tone", label: "Tone & Style" },
    { value: "seo", label: "SEO Optimization" },
  ];

  const handleImprove = async () => {
    if (!content) {
      message.warning("Please add some content to improve");
      return;
    }

    setLoading(true);
    try {
      // Here you would typically call your AI service
      // For now, we'll simulate an improvement
      const response = await fetch("/api/ai/improve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          type: improvementType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to improve content");
      }

      const data = await response.json();
      setImprovedContent(data.improvedContent);
      message.success("Content improved successfully!");
    } catch (error) {
      console.error("Error improving content:", error);
      message.error("Failed to improve content. Please try again.");
    }
    setLoading(false);
  };

  const handleApply = () => {
    if (improvedContent) {
      setContent(improvedContent);
      setVisible(false);
      message.success("Improved content applied successfully!");
    }
  };

  return (
    <Modal
      title="AI Content Assistant"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={800}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Select
            value={improvementType}
            onChange={setImprovementType}
            className="w-48"
          >
            {improvementOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleImprove}
            loading={loading}
          >
            Improve Content
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Original Content</h4>
            <div className="bg-gray-50 p-3 rounded border min-h-[200px]">
              <RichTextEditor defaultValue={content} editMode={false} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Improved Content</h4>
            <RichTextEditor
              defaultValue={improvedContent}
              onChange={setImprovedContent}
              editMode={true}
              maxLength={5000}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => setVisible(false)}>Cancel</Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleApply}
            disabled={!improvedContent}
          >
            Apply Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AIAssistantModal;
