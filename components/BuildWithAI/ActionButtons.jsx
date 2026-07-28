// components/BuildWithAI/ActionButtons.jsx

import React from "react";
import { Button } from "antd";

const ActionButtons = ({
  handleModify,
  handleCreatePage,
  conversation,
  isModifying,
  handleClearConversation,
  validJson,
}) => {
  if (conversation.length === 0 || isModifying) return null;

  return (
    <div className="flex justify-end gap-4 mt-6">
      <Button
        onClick={handleClearConversation}
        className="bg-gray-200 hover:bg-gray-200 text-white"
      >
        Clear Conversation
      </Button>
      {/* <Button
        onClick={handleModify}
        className="bg-gray-200 hover:bg-gray-200 text-white"
      >
        Modify
      </Button> */}
      <Button
        type="primary"
        onClick={handleCreatePage}
        className="bg-gray-200 hover:bg-gray-200 text-white"
        // disabled={!validJson}
      >
        Create Page
      </Button>
    </div>
  );
};

export default ActionButtons;
