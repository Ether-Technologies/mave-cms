// components/WriteWithAI/ChatInput.jsx

import React from "react";
import { Input, Button } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import RichTextEditor from "../RichTextEditor";

const ChatInput = ({ prompt, setPrompt, onSend, loading }) => {
  return (
    <div className="flex items-center gap-2">
      <RichTextEditor
        defaultValue={prompt}
        onChange={setPrompt}
        editMode={true}
        maxLength={1000}
      />
      <Button
        type="primary"
        icon={<RobotOutlined />}
        onClick={onSend}
        loading={loading}
        disabled={!prompt.trim()}
        className="mavebutton"
      >
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
