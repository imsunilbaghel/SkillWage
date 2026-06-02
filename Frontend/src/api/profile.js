import { api } from "./axios";
import { getUploadSignature, uploadToCloudinary } from "./cloudinary";

export const updatePersonalDetails = async (data) => {
  const res = await api.put("/profile/personal", data);
  return res.data;
};

export const updateProfileImage = async (imageFile) => {
  let profileImage = "";
  if (imageFile) {
    const sigData = await getUploadSignature();
    if (!sigData?.success) throw new Error("Failed to get signature");
    const { signature, timestamp } = sigData.data;
    profileImage = await uploadToCloudinary(imageFile, timestamp, signature);
  }

  const res = await api.put("/profile/image", { profileImage });
  return res.data;
};

export const updateAddressDetails = async (data) => {
  const response = await api.put('/profile/address', data);
  return response.data;
};

export const updateServiceCharge = async (data) => {
  const res = await api.put("/profile/service-charge", data);
  return res.data;
};

export const updatePassword = async (data) => {
  const res = await api.put("/profile/password", data);
  return res.data;
};
