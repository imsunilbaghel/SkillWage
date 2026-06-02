import { z } from "zod";

export const updatePersonalSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100).optional(),
  phoneNumber: z.string().regex(/^[5-9]\d{9}$/, "Enter a valid 10-digit phone number starting with 5-9").optional(),
  email: z.string().email("Please enter a valid email address").toLowerCase().trim().optional(),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Date of birth must be a valid date" }).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  aadhaarNumber: z.string().refine((val) => val.replace(/\D/g, "").length === 12, { message: "Aadhaar number must be exactly 12 digits" }).optional(),
});

export const updateAddressSchema = z.object({
  address: z.string().trim().min(5, "Address must be at least 5 characters").optional(),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits").optional(),
  subdivision: z.string().trim().min(1, "Subdivision is required").optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
});

export const updateServiceChargeSchema = z.object({
  serviceCharge: z.union([
    z.number().positive("Service charge must be greater than 0"),
    z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Service charge must be a valid positive amount")
  ]).optional(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, "Password must include letters, numbers, and a special character"),
});
