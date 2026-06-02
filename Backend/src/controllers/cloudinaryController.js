import { generateUploadSignature } from "../utils/cloudinary.js";

// GET /api/cloudinary/signature
export const getSignature = async (req, res, next) => {
  try {
    const signatureData = generateUploadSignature();

    return res.status(200).json({
      success: true,
      message: "Signature generated successfully",
      data: signatureData,
    });
  } catch (error) {
    next(error);
  }
};
