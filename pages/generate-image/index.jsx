import React, { useState } from "react";
import { Input, Button, Spin, Alert, Image, Select } from "antd";
import { SendOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;

const GenerateImagePage = () => {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("dall-e-2");
  const [size, setSize] = useState("1024x1024");
  const [quality, setQuality] = useState("standard");
  const [style, setStyle] = useState("vivid");
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const modelOptions = [
    { label: "DALL·E 2", value: "dall-e-2" },
    { label: "DALL·E 3", value: "dall-e-3" },
  ];

  const sizeOptions = {
    "dall-e-2": ["256x256", "512x512", "1024x1024"],
    "dall-e-3": ["1024x1024", "1792x1024", "1024x1792"],
  };

  const qualityOptions = ["standard", "hd"];
  const styleOptions = ["vivid", "natural"];

  const handleGenerate = async () => {
    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }
    setLoading(true);
    setError("");
    setImageUrls([]);
    try {
      const response = await axios.post("/api/generate-image", {
        prompt,
        model,
        size,
        ...(model === "dall-e-3" ? { quality, style } : {}),
      });
      if (response.status === 200) {
        setImageUrls(response.data.imageUrls);
      } else {
        setError(response.data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mavecontainer">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Generate Image from Prompt
      </h1>
      <div className="flex flex-col items-center">
        <TextArea
          rows={4}
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full sm:w-2/3 lg:w-1/2 mb-4"
          onPressEnter={handleGenerate}
        />
        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 w-full sm:w-2/3 lg:w-1/2 mb-4">
          <Select
            value={model}
            onChange={(value) => {
              setModel(value);
              setSize(sizeOptions[value][0]);
              if (value === "dall-e-2") {
                setQuality("standard");
                setStyle("vivid");
              }
            }}
            className="w-full sm:w-1/2 mb-4 sm:mb-0"
          >
            {modelOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          <Select
            value={size}
            onChange={(value) => setSize(value)}
            className="w-full sm:w-1/2"
          >
            {sizeOptions[model].map((size) => (
              <Option key={size} value={size}>
                {size}
              </Option>
            ))}
          </Select>
        </div>
        {model === "dall-e-3" && (
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 w-full sm:w-2/3 lg:w-1/2 mb-4">
            <Select
              value={quality}
              onChange={(value) => setQuality(value)}
              className="w-full sm:w-1/2 mb-4 sm:mb-0"
            >
              {qualityOptions.map((quality) => (
                <Option key={quality} value={quality}>
                  {quality.charAt(0).toUpperCase() + quality.slice(1)} Quality
                </Option>
              ))}
            </Select>
            <Select
              value={style}
              onChange={(value) => setStyle(value)}
              className="w-full sm:w-1/2"
            >
              {styleOptions.map((style) => (
                <Option key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)} Style
                </Option>
              ))}
            </Select>
          </div>
        )}
        <Button
          icon={<SendOutlined />}
          onClick={handleGenerate}
          loading={loading}
          className="mavebutton mb-6"
          size="large"
        >
          Generate
        </Button>
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-4 w-full sm:w-2/3 lg:w-1/2"
          />
        )}
        {loading && <Spin size="large" />}
        {imageUrls.length > 0 && (
          <div className="flex justify-center items-center">
            {imageUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Generated Image ${index + 1}`}
                width={`70vw`}
                height={`auto`}
                className="rounded-lg shadow-md"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImagePage;