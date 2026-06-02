import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

//Generates an upload signature for direct-to-cloud frontend uploads.
export const generateUploadSignature = () => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Create the signature using the api secret
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.CLOUDINARY_API_SECRET
  );

  return {
    timestamp,
    signature,
  };
};

export const deleteFromCloudinary = async (url) => {
  if (!url) return;
  try {
    const splitUrl = url.split("/");
    const lastSegment = splitUrl[splitUrl.length - 1];
    const publicId = lastSegment.split(".")[0];

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted orphaned image from Cloudinary: ${publicId}`);
    }
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
  }
};

export default cloudinary;
