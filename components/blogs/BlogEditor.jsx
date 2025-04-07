// components/Blog/BlogEditor.jsx

import React, { useState } from "react";
import { Button, Space, Tooltip, Divider } from "antd";
import {
  RobotOutlined,
  BulbOutlined,
  EditOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import RichTextEditor from "../RichTextEditor";
import WriteWithAI from "./WriteWithAI/WriteWithAI";
import AIAssistantModal from "./AIAssistantModal";

const BlogEditor = ({ content, setContent }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleAIAssist = (type) => {
    switch (type) {
      case "generate":
        setModalVisible(true);
        break;
      case "improve":
        setAiAssistantVisible(true);
        break;
      case "suggest":
        // Implement suggestion logic
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col">
      {/* AI Assistance Buttons */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg">
        <Space>
          <Tooltip title="Generate Content with AI">
            <Button
              icon={<RobotOutlined />}
              className="mavebutton"
              onClick={() => handleAIAssist("generate")}
            >
              Generate Content
            </Button>
          </Tooltip>
          <Tooltip title="Improve Existing Content">
            <Button
              icon={<EditOutlined />}
              className="mavebutton"
              onClick={() => handleAIAssist("improve")}
            >
              Improve Content
            </Button>
          </Tooltip>
          <Tooltip title="Get Writing Suggestions">
            <Button
              icon={<BulbOutlined />}
              className="mavebutton"
              onClick={() => handleAIAssist("suggest")}
            >
              Get Suggestions
            </Button>
          </Tooltip>
        </Space>
        <Tooltip title="View Content History">
          <Button
            icon={<HistoryOutlined />}
            className="mavebutton"
            onClick={() => {
              /* Implement history view */
            }}
          >
            History
          </Button>
        </Tooltip>
      </div>

      {/* Rich Text Editor */}
      <RichTextEditor
        editMode={true}
        defaultValue={content}
        onChange={handleContentChange}
        className="h-96 mb-6 p-4 bg-white text-gray-800 rounded-lg border border-gray-300"
      />

      {/* AI Generation Modal */}
      <WriteWithAI
        visible={modalVisible}
        setVisible={setModalVisible}
        setContent={(newContent) => {
          const updatedContent = content + "\n" + newContent;
          setContent(updatedContent);
        }}
      />

      {/* AI Assistant Modal */}
      <AIAssistantModal
        visible={aiAssistantVisible}
        setVisible={setAiAssistantVisible}
        content={content}
        setContent={setContent}
      />

      {/* Content Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold mb-2">Writing Suggestions</h4>
          <Divider className="my-2" />
          <ul className="list-disc pl-5">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-gray-600 mb-1">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BlogEditor;
