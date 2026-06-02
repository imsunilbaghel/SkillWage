import { Router } from "express";
import {
  loginWorker,
  loginCustomer,
  logout,
  getCurrentUser,
} from "../controllers/authController.js";
import {
  registerWorker,
  registerCustomer,
} from "../controllers/registerController.js";
import {
  workerForgotPassword,
  customerForgotSendOtp,
  customerForgotResetPassword,
} from "../controllers/forgotPasswordController.js";
import { validate } from "../middlewares/validate.js";
import { verifyAuth } from "../middlewares/auth.js";
import {
  workerRegisterSchema,
  workerLoginSchema,
  customerRegisterSchema,
  customerLoginSchema,
} from "../validators/authValidator.js";
import {
  workerForgotSchema,
  customerForgotSendOtpSchema,
  customerForgotResetSchema,
} from "../validators/forgotPasswordValidator.js";

const router = Router();

// Worker Auth Routes

// POST - /api/auth/worker/register
router.post(
  "/worker/register",
  validate(workerRegisterSchema),
  registerWorker
);

// POST - /api/auth/worker/login
router.post(
  "/worker/login",
  validate(workerLoginSchema),
  loginWorker
);

// POST - /api/auth/worker/forgot-password
router.post(
  "/worker/forgot-password",
  validate(workerForgotSchema),
  workerForgotPassword
);


// Customer Auth Routes

// POST - /api/auth/customer/register
router.post(
  "/customer/register",
  validate(customerRegisterSchema),
  registerCustomer
);

// POST - /api/auth/customer/login
router.post(
  "/customer/login",
  validate(customerLoginSchema),
  loginCustomer
);

// POST - /api/auth/customer/forgot-password/send-otp
router.post(
  "/customer/forgot-password/send-otp",
  validate(customerForgotSendOtpSchema),
  customerForgotSendOtp
);

// POST - /api/auth/customer/forgot-password/reset
router.post(
  "/customer/forgot-password/reset",
  validate(customerForgotResetSchema),
  customerForgotResetPassword
);


// Common Auth Routes

// POST - /api/auth/logout
router.post("/logout", logout);

// GET - /api/auth/me — requires authentication
router.get("/me", verifyAuth, getCurrentUser);

export default router;
