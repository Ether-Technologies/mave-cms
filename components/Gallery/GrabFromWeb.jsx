import React, { useState } from "react";
import { Input, Button, message } from "antd";

const GrabFromWeb = ({ onUploadSuccess, addMediaToDB }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGrabAndUpload = async () => {
    if (!imageUrl) {
      message.warning("Please enter a remote image URL!");
      return;
    }

    try {
      setIsLoading(true);

      // 1) Read the token from localStorage in the browser
      const token = localStorage.getItem("token"); // or whatever key you use

      console.log("Sending: ", imageUrl, token);

      // 2) Pass the URL + token to the Next.js API route
      const response = await fetch("/api/fetchAndUpload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          token, // We'll attach this in the Authorization header server-side
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      message.success("Successfully grabbed and uploaded!");

      // If you want to do something with the response
      onUploadSuccess?.(result.data || []);
      addMediaToDB?.(result.data || []);
    } catch (error) {
      console.error("Grab & upload error:", error);
      message.error("Failed to fetch & upload the remote image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "16px", background: "#fff" }}>
      <Input
        placeholder="Paste a public image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={{ marginBottom: 8 }}
        onPressEnter={handleGrabAndUpload}
      />
      <Button type="primary" loading={isLoading} onClick={handleGrabAndUpload}>
        Grab & Upload
      </Button>
    </div>
  );
};

export default GrabFromWeb;
