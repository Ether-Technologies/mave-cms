// components/BuildWithAI/MessageInput.jsx

import React from "react";
import { Input, Button, Tooltip } from "antd";
import { SendOutlined } from "@ant-design/icons";
import RichTextEditor from "../RichTextEditor";

const MessageInput = ({
  userInput,
  setUserInput,
  handleSendMessage,
  loading,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <RichTextEditor
        defaultValue={userInput}
        onChange={setUserInput}
        editMode={true}
        maxLength={2000}
      />
      <div className="flex justify-end">
        <Tooltip title="Click to send your message">
          <Button
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            loading={loading}
            className="bg-theme hover:bg-gray-200 text-white"
          >
            Send
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default MessageInput;
