// Example snippet in build-with-ai/index.jsx

import React, { useState, useEffect } from "react";
import { Button, message, Input, Modal } from "antd";
import axios from "axios";

// Importing BuildWithAI Components
import ChatContainer from "../../components/BuildWithAI/ChatContainer";
import MessageInput from "../../components/BuildWithAI/MessageInput";
import ActionButtons from "../../components/BuildWithAI/ActionButtons";
import LoadingSpinner from "../../components/BuildWithAI/LoadingSpinner";
import instance from "../../axios";
import RichTextEditor from "../../components/RichTextEditor";

export default function BuildWithAI() {
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingPage, setCreatingPage] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [modifyInput, setModifyInput] = useState("");

  useEffect(() => {
    const storedConversation = localStorage.getItem("conversation");
    if (storedConversation) {
      setConversation(JSON.parse(storedConversation));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("conversation", JSON.stringify(conversation));
  }, [conversation]);

  const handleClearConversation = () => {
    setConversation([]);
    localStorage.removeItem("conversation");
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) {
      message.warning("Please enter a message.");
      return;
    }

    const newConversation = [
      ...conversation,
      { role: "user", content: userInput },
    ];

    setConversation(newConversation);
    setUserInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/conversational-json", {
        messages: newConversation,
      });

      if (response.status === 200) {
        const { text, json, isValid, validationErrors } = response.data;

        // Construct the assistant message correctly
        const assistantMessage = {
          role: "assistant",
          content: text, // Must be a string
          json: json, // Parsed JSON object
          isValid: isValid, // Boolean indicating schema validity
          validationErrors: validationErrors || [], // Array of validation errors
        };

        setConversation([...newConversation, assistantMessage]);

        if (isValid) {
          message.success("JSON generated successfully!");
          console.log("Generated JSON:", json);
        } else {
          message.error("JSON generated but contains validation errors.");
          // Display validation errors in a modal
          const errorMessages = validationErrors.map((err, index) => (
            <li key={index}>
              {err.instancePath || "root"}: {err.message}
            </li>
          ));

          Modal.error({
            title: "JSON Validation Errors",
            content: <ul>{errorMessages}</ul>,
          });
        }
      } else {
        message.error(response.data.error || "Failed to generate JSON.");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(`Error: ${error.response.data.error}`);
        if (error.response.data.details) {
          console.log("Details:", error.response.data.details);
        }
      } else {
        message.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async () => {
    const lastAssistantMessage = conversation[conversation.length - 1];
    if (!lastAssistantMessage || lastAssistantMessage.role !== "assistant") {
      message.warning("No JSON to create a page.");
      return;
    }

    // Find the corresponding JSON response
    const jsonResponse = conversation.find(
      (msg) => msg.role === "assistant" && msg.json
    );

    if (!jsonResponse || !jsonResponse.isValid) {
      message.error("Cannot create page. The JSON is invalid or missing.");
      return;
    }

    setCreatingPage(true);

    try {
      const jsonPayload = jsonResponse.json;
      console.log("JSON Payload:", jsonPayload);
      const response = await instance.post("/pages", jsonPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201 || response.status === 200) {
        message.success("Page created successfully!");
        setConversation([]);
      } else {
        message.error("Failed to create page.");
      }
    } catch (error) {
      console.error("Error creating page:", error);
      message.error(
        `Failed to create page. ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setCreatingPage(false);
    }
  };

  const handleModify = () => {
    setIsModifying(true);
  };
  const handleSendModification = async () => {
    if (!modifyInput.trim()) {
      message.warning("Please enter a modification.");
      return;
    }

    const lastAssistantMessage = conversation[conversation.length - 1];
    if (!lastAssistantMessage || lastAssistantMessage.role !== "assistant") {
      message.warning("No JSON to modify.");
      return;
    }

    const jsonResponse = conversation.find(
      (msg) => msg.role === "assistant" && msg.json
    );

    if (!jsonResponse || !jsonResponse.isValid) {
      message.error(
        "Cannot modify JSON. The current JSON is invalid or missing."
      );
      return;
    }

    const newConversation = [
      ...conversation,
      { role: "user", content: modifyInput },
    ];

    setConversation(newConversation);
    setModifyInput("");
    setLoading(true);
    setIsModifying(false);

    try {
      const response = await axios.post("/api/conversational-json", {
        messages: newConversation,
      });

      if (response.status === 200) {
        const { text, json, isValid, validationErrors } = response.data;

        // Construct the assistant message correctly
        const assistantMessage = {
          role: "assistant",
          content: text, // Must be a string
          json: json, // Parsed JSON object
          isValid: isValid, // Boolean indicating schema validity
          validationErrors: validationErrors || [], // Array of validation errors
        };

        setConversation([...newConversation, assistantMessage]);

        if (isValid) {
          message.success("JSON modified successfully!");
          console.log("Modified JSON:", json);
        } else {
          message.error("JSON modified but contains validation errors.");
          // Display validation errors in a modal
          const errorMessages = validationErrors.map((err, index) => (
            <li key={index}>
              {err.instancePath || "root"}: {err.message}
            </li>
          ));

          Modal.error({
            title: "JSON Validation Errors",
            content: <ul>{errorMessages}</ul>,
          });
        }
      } else {
        message.error(response.data.error || "Failed to modify JSON.");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(`Error: ${error.response.data.error}`);
        if (error.response.data.details) {
          console.log("Validation Details:", error.response.data.details);
        }
      } else {
        message.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDiscardModification = () => {
    setIsModifying(false);
    setModifyInput("");
  };
  // Inside the BuildWithAI component

  const handleResend = (index) => {
    const failedUserMessage = conversation[index - 1]; // Assuming the error is in the assistant's response after the user message
    if (failedUserMessage && failedUserMessage.role === "user") {
      handleSendSpecificMessage(failedUserMessage.content, index - 1);
    }
  };

  const handleRegenerate = (index) => {
    const failedAssistantMessage = conversation[index];
    if (failedAssistantMessage && failedAssistantMessage.role === "assistant") {
      // Remove the failed assistant message
      const updatedConversation = conversation.filter((_, i) => i !== index);
      setConversation(updatedConversation);
      // Resend the last user message to regenerate assistant's response
      const lastUserMessage = conversation[index - 1];
      if (lastUserMessage && lastUserMessage.role === "user") {
        handleSendSpecificMessage(lastUserMessage.content, index - 1);
      }
    }
  };

  // New helper function to resend a specific message
  const handleSendSpecificMessage = async (messageContent, messageIndex) => {
    setLoading(true);
    try {
      const newConversation = [...conversation];
      // Update the user message if necessary
      newConversation[messageIndex] = { role: "user", content: messageContent };
      setConversation(newConversation);

      const response = await axios.post("/api/conversational-json", {
        messages: newConversation,
      });

      if (response.status === 200) {
        const { text, json, isValid, validationErrors } = response.data;

        // Construct the assistant message correctly
        const assistantMessage = {
          role: "assistant",
          content: text, // Must be a string
          json: json, // Parsed JSON object
          isValid: isValid, // Boolean indicating schema validity
          validationErrors: validationErrors || [], // Array of validation errors
        };

        setConversation([...newConversation, assistantMessage]);

        if (isValid) {
          message.success("JSON generated successfully!");
          console.log("Generated JSON:", json);
        } else {
          message.error("JSON generated but contains validation errors.");
          // Display validation errors in a modal
          const errorMessages = validationErrors.map((err, idx) => (
            <li key={idx}>
              {err.instancePath || "root"}: {err.message}
            </li>
          ));

          Modal.error({
            title: "JSON Validation Errors",
            content: <ul>{errorMessages}</ul>,
          });
        }
      } else {
        message.error(response.data.error || "Failed to generate JSON.");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(`Error: ${error.response.data.error}`);
        if (error.response.data.details) {
          console.log("Details:", error.response.data.details);
        }
      } else {
        message.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mavecontainer">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-center text-theme">
          Build Page with AI
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Describe the page you want to create, and AI will generate the
          corresponding JSON configuration.
        </p>

        {/* Chat Container */}
        <ChatContainer
          conversation={conversation}
          handleResend={handleResend}
          handleRegenerate={handleRegenerate}
        />

        {/* Input Area */}
        {isModifying ? (
          <>
            <RichTextEditor
              defaultValue={modifyInput}
              onChange={setModifyInput}
              editMode={true}
              maxLength={5000}
            />
            <div className="flex justify-end gap-4">
              <Button
                onClick={handleDiscardModification}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Discard
              </Button>
              <Button
                type="primary"
                onClick={handleSendModification}
                loading={loading}
                className="bg-theme hover:bg-yellow-600 text-white"
              >
                Send
              </Button>
            </div>
          </>
        ) : (
          <MessageInput
            userInput={userInput}
            setUserInput={setUserInput}
            handleSendMessage={handleSendMessage}
            loading={loading}
          />
        )}

        {/* Action Buttons */}
        <ActionButtons
          handleModify={handleModify}
          handleCreatePage={handleCreatePage}
          conversation={conversation}
          isModifying={isModifying}
          handleClearConversation={handleClearConversation}
        />

        {/* Loading Spinner */}
        <LoadingSpinner
          loading={loading || creatingPage}
          text={creatingPage ? "Creating Page..." : "Processing..."}
        />
      </div>
    </div>
  );
}
