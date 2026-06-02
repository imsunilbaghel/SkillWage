import Worker from "../models/Worker.js";
import Customer from "../models/Customer.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import { sanitizeUser } from "./authController.js";

// Helper to get user model
const getUserModel = (role) => (role === "worker" ? Worker : Customer);

// PUT /api/profile/personal
export const updatePersonalDetails = async (req, res, next) => {
  try {
    const { fullName, phoneNumber, email, dateOfBirth, gender, aadhaarNumber } = req.body;
    const Model = getUserModel(req.userRole);

    // Find current user
    const user = await Model.findById(req.user._id);

    // Check if phone number is changing and cross-check across both collections
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const existingWorker = await Worker.findOne({ phoneNumber });
      const existingCustomer = await Customer.findOne({ phoneNumber });

      if (existingWorker || existingCustomer) {
        return res.status(409).json({ success: false, message: "Phone number is already in use by another account" });
      }
      user.phoneNumber = phoneNumber;
    }

    if (fullName) user.fullName = fullName;
    if (gender) user.gender = gender;

    if (req.userRole === "customer") {
      if (email && email.toLowerCase() !== user.email) {
        const existingCustomerEmail = await Customer.findOne({ email: email.toLowerCase() });
        if (existingCustomerEmail) {
          return res.status(409).json({ success: false, message: "Email is already in use" });
        }
        user.email = email.toLowerCase();
      }
    } else if (req.userRole === "worker") {
      if (!user.isVerified) {
        if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
        if (aadhaarNumber) {
          const cleanAadhaar = aadhaarNumber.replace(/\D/g, "");
          if (cleanAadhaar !== user.aadhaarNumber) {
            const existingWorkerAadhaar = await Worker.findOne({ aadhaarNumber: cleanAadhaar });
            if (existingWorkerAadhaar) {
              return res.status(409).json({ success: false, message: "Aadhaar number is already in use" });
            }
            user.aadhaarNumber = cleanAadhaar;
          }
        }
      }
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Personal details updated successfully",
      data: { user: sanitizeUser(user, req.userRole) }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/profile/image
export const updateProfileImage = async (req, res, next) => {
  try {
    const { profileImage } = req.body;
    const Model = getUserModel(req.userRole);

    const user = await Model.findById(req.user._id);
    
    if (user.profileImage && user.profileImage !== profileImage) {
      await deleteFromCloudinary(user.profileImage);
    }

    user.profileImage = profileImage || "";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: { user: sanitizeUser(user, req.userRole) }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/profile/address
export const updateAddressDetails = async (req, res, next) => {
  try {
    const { address, pincode, subdivision, city, state } = req.body;
    const Model = getUserModel(req.userRole);
    const user = await Model.findById(req.user._id);

    if (address) user.address = address;
    if (pincode) user.pincode = pincode;
    if (subdivision) user.subdivision = subdivision;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address details updated successfully",
      data: { user: sanitizeUser(user, req.userRole) }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/profile/service-charge
export const updateServiceCharge = async (req, res, next) => {
  try {
    const { serviceCharge } = req.body;
    const user = await Worker.findById(req.user._id);

    if (serviceCharge !== undefined) user.serviceCharge = Number(serviceCharge);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Service charge updated successfully",
      data: { user: sanitizeUser(user, req.userRole) }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/profile/password
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const Model = getUserModel(req.userRole);

    const user = await Model.findById(req.user._id).select("+password");

    const isPasswordValid = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    next(error);
  }
};
