import FormData from "form-data";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { imageUrl, token } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: "No imageUrl provided" });
    }

    // Fetch the image
    const remoteResponse = await fetch(imageUrl);
    if (!remoteResponse.ok) {
      throw new Error(
        `Could not fetch remote URL. Status: ${remoteResponse.status}`
      );
    }

    // Get the content type
    const contentType = remoteResponse.headers.get("content-type");
    if (!contentType || !contentType.startsWith("image/")) {
      throw new Error("URL must point to an image file");
    }

    // Convert to base64 for preview
    const arrayBuffer = await remoteResponse.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const previewUrl = `data:${contentType};base64,${base64}`;

    return res.status(200).json({
      success: true,
      previewUrl,
      type: contentType,
    });
  } catch (error) {
    console.error("fetchAndPreview error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
