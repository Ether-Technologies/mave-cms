import FormData from "form-data";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { imageUrl, token } = req.body; // <-- token comes from the client
    if (!imageUrl) {
      return res.status(400).json({ error: "No imageUrl provided" });
    }

    // 1) Fetch remote image on the server side
    const remoteResponse = await fetch(imageUrl);
    if (!remoteResponse.ok) {
      throw new Error(
        `Could not fetch remote URL. Status: ${remoteResponse.status}`
      );
    }
    const arrayBuffer = await remoteResponse.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 2) Build form-data to match Laravel's /media/upload
    const formData = new FormData();
    formData.append("file[]", fileBuffer, "remote.jpg");

    // 3) Make a raw axios POST request to your Laravel
    //    Pass the token as Bearer in Authorization header
    const uploadResponse = await axios.post(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/media/upload",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${token}`, // 401 if missing or invalid
        },
      }
    );

    // 4) Relay the Laravel response to the client
    return res.status(200).json(uploadResponse.data);
  } catch (error) {
    console.error("fetchAndUpload error:", error);
    return res.status(500).json({ error: error.message });
  }
}
