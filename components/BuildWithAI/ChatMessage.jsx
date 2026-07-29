import React from "react";
import { Button, message as antdMessage } from "antd";
import Image from "next/image";
import CodeBlock from "./CodeBlock";

const ChatMessage = ({ message, onResend, onRegenerate }) => {
  const isUser = message.role === "user";

  // Debugging: Log the message object to verify fields
  console.log("ChatMessage:", message);

  return (
    <div
      className={`chat-message flex gap-2 ${
        isUser ? "flex-row-reverse items-center" : "flex-row items-start"
      }`}
    >
      {/* Avatar */}
      <Image
        src={
          isUser ? "/icons/mave_icons/user.svg" : "/icons/mave/maveai.png" // Ensure these paths are correct
        }
        alt={message.role}
        width={30}
        height={30}
        objectFit="contain"
        className={`${isUser ? "rounded-full border-2 border-theme" : ""}`}
      />

      {/* Message Content */}
      <div
        className={`rounded-lg p-4 max-w-6xl ${
          isUser
            ? "bg-theme text-white font-semibold"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {isUser ? (
          <span>{message.content}</span>
        ) : (
          <>
            {/* Render Text Explanation */}
            {message.text && <p className="mb-6 text-xl">{message.text}</p>}

            {/* Render JSON Configuration */}
            {message.json && (
              <CodeBlock
                language="json"
                content={JSON.stringify(message.json, null, 2)}
              />
            )}

            {/* Render Validation Errors and Buttons */}
            {!message.isValid && message.validationErrors && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p className="font-semibold">Validation Errors:</p>
                <ul className="list-disc list-inside">
                  {message.validationErrors.map((err, index) => (
                    <li key={index}>
                      {err.instancePath || "root"}: {err.message}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-2">
                  <Button
                    type="primary"
                    onClick={onResend}
                    className="bg-theme hover:bg-brand-dark text-white"
                  >
                    Resend
                  </Button>
                  <Button
                    onClick={onRegenerate}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                  >
                    Regenerate
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
