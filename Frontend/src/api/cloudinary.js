import axios from "axios";
import { api } from "./axios";

// Fetch signed upload signature from backend

export const getUploadSignature = async () => {
  const response = await api.get("/cloudinary/signature");
  return response.data; // Returns { success: true, data: { signature, timestamp } }
};

// Direct upload to Cloudinary using secure signature
export const uploadToCloudinary = async (file, timestamp, signature) => {
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData
  );

  if (response.status !== 200) {
    throw new Error("Cloudinary upload failed");
  }

  return response.data.secure_url;
};
