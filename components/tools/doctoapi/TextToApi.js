import React, { useState } from "react";
import { Layout, Typography, Divider, message } from "antd";
import YamlInputForm from "../../doctoapi/FormComponents/YamlInputForm";
import JsonPreview from "../../doctoapi/PreviewComponents/JsonPreview";
import ConfirmButton from "../../doctoapi/Confirmation/ConfirmButton";
import { parseYaml } from "../../doctoapi/utils/yamlParser";
import { pageSchema } from "../../doctoapi/utils/validationSchema";
import { mapYamlToJson } from "../../doctoapi/utils/jsonMapper";
import instance from "../../../axios";

export default function TextToApi() {
  const [parsedYaml, setParsedYaml] = useState(null);
  const [jsonPayload, setJsonPayload] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleYamlInput = async (yamlText) => {
    const { success, data, error } = parseYaml(yamlText);
    if (!success) {
      setParsedYaml(null);
      setJsonPayload(null);
      setValidationErrors([`YAML Parsing Error: ${error}`]);
      message.error(`YAML Parsing Error: ${error}`);
      return;
    }

    try {
      await pageSchema.validate(data, { abortEarly: false });
      console.log("YAML parsed successfully", data);
      setParsedYaml(data);
      setValidationErrors([]);
      const mappedJson = mapYamlToJson(data);
      console.log("Mapped JSON", mappedJson);
      setJsonPayload(mappedJson);
    } catch (validationError) {
      console.log("Validation Error", validationError);
      if (validationError.name === "ValidationError") {
        const errors = validationError.inner?.map(
          (err) => `${err.path}: ${err.message}`
        );
        setValidationErrors(errors);
        setParsedYaml(null);
        setJsonPayload(null);
        // message.error("YAML Validation Failed. Please check your input.");
      } else {
        setValidationErrors([`Unexpected Error: ${validationError.message}`]);
        setParsedYaml(null);
        setJsonPayload(null);
        message.error(`Unexpected Error: ${validationError.message}`);
      }
    } finally {
      // message.success("YAML parsed and validated successfully!");
      // window.scrollTo(0, document.body.scrollHeight);
    }
  };

  const handleFileUpload = async (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const yamlText = e.target.result;
      await handleYamlInput(yamlText);
    };
    reader.onerror = () => {
      message.error("Failed to read the uploaded file.");
    };
    reader.readAsText(file);
  };

  const handleSubmission = async () => {
    if (!jsonPayload) {
      message.error("No JSON payload to submit.");
      return;
    }

    try {
      const response = await instance.post("/pages", jsonPayload, {
        headers: {
          "Content-Type": "application/json",
          // Add Authorization header if required
          // 'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 201 || response.status === 200) {
        message.success("Page created successfully!");
        // Reset the form after successful submission
        setParsedYaml(null);
        setJsonPayload(null);
      } else {
        message.error("Failed to create page.");
      }
    } catch (error) {
      console.error(error);
      message.error(
        `Failed to create page. ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="mavecontainer">
      <YamlInputForm
        onYamlChange={handleYamlInput}
        onFileUpload={handleFileUpload}
      />
      {validationErrors.length > 0 && (
        <>
          <Divider orientation="left" plain>
            Validation Errors
          </Divider>
          <div className="bg-gray-200 p-4 rounded mb-6">
            <ul className="list-disc list-inside text-gray-800">
              {validationErrors?.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      {jsonPayload && (
        <>
          <JsonPreview payload={jsonPayload} />
          <ConfirmButton onConfirm={handleSubmission} />
        </>
      )}
    </div>
  );
}
