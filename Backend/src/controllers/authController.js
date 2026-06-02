import Worker from "../models/Worker.js";
import Customer from "../models/Customer.js";

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
});

export const sanitizeUser = (user, role) => {
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.__v;
  userObj.role = role;
  return userObj;
};


//POST /api/auth/worker/login 
export const loginWorker = async (req, res, next) => {
  try {
    const { phoneNumber, dateofbirth, password } = req.body;

    const worker = await Worker.findOne({ phoneNumber }).select("+password");

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "No worker account found with this phone number",
      });
    }

    const inputDob = new Date(dateofbirth);
    const storedDob = new Date(worker.dateOfBirth);

    if (
      inputDob.getFullYear() !== storedDob.getFullYear() ||
      inputDob.getMonth() !== storedDob.getMonth() ||
      inputDob.getDate() !== storedDob.getDate()
    ) {
      return res.status(401).json({
        success: false,
        message: "Date of birth does not match our records",
      });
    }

    const isPasswordValid = await worker.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const accessToken = worker.generateAccessToken();
    const sanitizedWorker = sanitizeUser(worker, "worker");

    return res
      .status(200)
      .cookie("accessToken", accessToken, getCookieOptions())
      .json({
        success: true,
        message: "Worker logged in successfully",
        data: { user: sanitizedWorker },
      });
  } catch (error) {
    next(error);
  }
};


// POST /api/auth/customer/login 
export const loginCustomer = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;

    const customer = await Customer.findOne({ phoneNumber }).select("+password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "No customer account found with this phone number",
      });
    }

    const isPasswordValid = await customer.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const accessToken = customer.generateAccessToken();
    const sanitizedCustomer = sanitizeUser(customer, "customer");

    return res
      .status(200)
      .cookie("accessToken", accessToken, getCookieOptions())
      .json({
        success: true,
        message: "Customer logged in successfully",
        data: { user: sanitizedCustomer },
      });
  } catch (error) {
    next(error);
  }
};

//POST /api/auth/logout
export const logout = async (req, res, next) => {

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

// GET /api/auth/me
export const getCurrentUser = async (req, res, next) => {
  const sanitizedUser = sanitizeUser(req.user, req.userRole);
  try {
    return res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      data: {
        user: sanitizedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
