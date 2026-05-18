import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { id } = req.query;

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!backendUrl) {
    return res.status(500).json({ message: "API base URL is not configured" });
  }

  const headers = {};
  if (req.headers.authorization) {
    headers["Authorization"] = req.headers.authorization;
  }

  try {
    const response = await axios.delete(`${backendUrl}/tenants/${id}`, { headers });
    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    console.error("Delete tenant error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
