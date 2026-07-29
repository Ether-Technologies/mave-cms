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
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        Clear Conversation
      </Button>
      {/* <Button
        onClick={handleModify}
        className="bg-brand hover:bg-brand-dark text-white"
      >
        Modify
      </Button> */}
      <Button
        type="primary"
        onClick={handleCreatePage}
        className="bg-green-500 hover:bg-green-600 text-white"
        // disabled={!validJson}
      >
        Create Page
      </Button>
    </div>
  );
};

export default ActionButtons;
