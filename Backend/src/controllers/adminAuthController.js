import Admin from "../models/Admin.js";
import { getCookieOptions, sanitizeUser } from "./authController.js";

// POST /api/admin/auth/login
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await admin.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = admin.generateAccessToken();
    const sanitizedAdmin = sanitizeUser(admin, "admin");

    return res
      .status(200)
      .cookie("accessToken", accessToken, getCookieOptions())
      .json({
        success: true,
        message: "Admin logged in successfully",
        data: { user: sanitizedAdmin },
      });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/auth/logout
export const logoutAdmin = async (req, res, next) => {
  try {
    return res
      .status(200)
      .clearCookie("accessToken", getCookieOptions())
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/auth/me
export const getCurrentAdmin = async (req, res, next) => {
  const sanitizedAdmin = sanitizeUser(req.user, req.userRole);

  return res.status(200).json({
    success: true,
    data: { user: sanitizedAdmin },
  });
};
