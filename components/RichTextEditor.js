// components/RichTextEditor.js

import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import DOMPurify from "dompurify";
import { Spin, Alert } from "antd";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const RichTextEditor = ({
  defaultValue,
  onChange,
  editMode,
  maxLength = 10000,
}) => {
  const [editorHtml, setEditorHtml] = useState(
    DOMPurify.sanitize(defaultValue || "")
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [error, setError] = useState(null);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background",
    "align",
  ];

  const handleChange = useCallback(
    (html) => {
      const sanitizedHtml = DOMPurify.sanitize(html);
      const text = sanitizedHtml.replace(/<[^>]*>/g, "");
      const words = text.trim().split(/\s+/).filter(Boolean).length;

      if (text.length > maxLength) {
        setError(`Content exceeds maximum length of ${maxLength} characters`);
        return;
      }

      setError(null);
      setWordCount(words);
      setEditorHtml(sanitizedHtml);

      if (onChange) {
        onChange(sanitizedHtml);
      }
    },
    [maxLength, onChange]
  );

  useEffect(() => {
    setEditorHtml(DOMPurify.sanitize(defaultValue || ""));
  }, [defaultValue]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.all([
        import("react-quill/dist/quill.snow.css"),
        import("react-quill/dist/quill.bubble.css"),
        import("react-quill/dist/quill.core.css"),
      ])
        .then(() => setIsLoaded(true))
        .catch((err) => {
          console.error("Failed to load Quill styles:", err);
          setError("Failed to load editor styles");
        });
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!ReactQuill) {
    return (
      <Alert
        message="Error"
        description="Failed to load editor"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="rich-text-editor">
      {editMode ? (
        <div className="space-y-2">
          <ReactQuill
            value={editorHtml}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            theme="snow"
            className="bg-white rounded-lg"
          />
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Words: {wordCount}</span>
            <span>
              Characters: {editorHtml.replace(/<[^>]*>/g, "").length}/
              {maxLength}
            </span>
          </div>
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mt-2"
            />
          )}
        </div>
      ) : (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: editorHtml }}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
