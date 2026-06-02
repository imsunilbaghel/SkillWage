import jwt from "jsonwebtoken";
import Worker from "../models/Worker.js";
import Customer from "../models/Customer.js";
import Admin from "../models/Admin.js";

export const verifyAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.role === "worker") {
      user = await Worker.findById(decoded._id).select("-password");
    } else if (decoded.role === "customer") {
      user = await Customer.findById(decoded._id).select("-password");
    } else if (decoded.role === "admin") {
      user = await Admin.findById(decoded._id).select("-password");
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User associated with this token no longer exists",
      });
    }

    req.user = user;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    next(error);
  }
};

export const isWorker = (req, res, next) => {
  if (req.userRole !== "worker") {
    return res.status(403).json({
      success: false,
      message: "Only Worker can access this endpoint",
    });
  }
  next();
};

export const isCustomer = (req, res, next) => {
  if (req.userRole !== "customer") {
    return res.status(403).json({
      success: false,
      message: "Only Customer can access this endpoint",
    });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Only Admin can access this endpoint",
    });
  }
  next();
};
