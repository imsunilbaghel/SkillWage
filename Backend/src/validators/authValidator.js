import { z } from "zod";

// ─── Auth Validators (Zod Schemas) ───────────────────────────────────────────

export const workerRegisterSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phoneNumber: z.string().regex(/^[5-9]\d{9}$/, "Enter a valid 10-digit phone number starting with 5-9"),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Date of birth must be a valid date" }),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  aadhaarNumber: z.string().refine((val) => val.replace(/\D/g, "").length === 12, { message: "Aadhaar number must be exactly 12 digits" }),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  subdivision: z.string().trim().min(1, "Subdivision is required"),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  serviceCharge: z.union([
    z.number().positive("Service charge must be greater than 0"),
    z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Service charge must be a valid positive amount")
  ]),
  occupation: z.string().min(1, "Occupation is required"),
  profileImage: z.string().url("Profile image must be a valid URL").optional(),
  aadhaarImage: z.string().url("Aadhaar image must be a valid URL").optional(),
});

export const customerRegisterSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phoneNumber: z.string().regex(/^[5-9]\d{9}$/, "Enter a valid 10-digit phone number starting with 5-9"),
  email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, "Password must include letters, numbers, and a special character"),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  subdivision: z.string().trim().min(1, "Subdivision is required"),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  profileImage: z.string().url("Profile image must be a valid URL").optional(),
});

export const workerLoginSchema = z.object({
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  dateofbirth: z.string().min(1, "Date of birth is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const customerLoginSchema = z.object({
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
