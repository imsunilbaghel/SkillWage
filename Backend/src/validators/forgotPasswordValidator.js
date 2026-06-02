import { z } from "zod";

export const workerForgotSchema = z.object({
  phoneNumber: z.string().regex(/^\d{10}$/, "Invalid phone number"),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  aadhaarNumber: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
});

export const customerForgotSendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const customerForgotResetSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "OTP must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long").regex(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
    "Password must include letters, numbers, and a special character"
  ),
});
