import { z } from "zod";

export const getUpdatePersonalSchema = (t, role) => z.object({
  fullName: z
    .string()
    .min(2, t("auth:validation.name_min_2", "Name must be at least 2 characters"))
    .refine((val) => !val.startsWith(" "), t("auth:validation.name_no_start_space", "Name cannot start with a space")),

  phoneNumber: z
    .string()
    .regex(/^[5-9]\d{9}$/, t("auth:validation.phone_valid_5_9", "Enter a valid 10-digit phone number starting with 5-9")),

  ...(role === "customer" && {
    email: z
      .string()
      .email(t("auth:validation.email_invalid", "Please enter a valid email address")),
  }),

  ...(role === "worker" && {
    dateOfBirth: z
      .string()
      .min(1, t("auth:validation.dob_required", "Date of birth is required"))
      .refine((value) => {
        const dob = new Date(value);
        const today = new Date();
        const age =
          today.getFullYear() -
          dob.getFullYear() -
          (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
        return age >= 18;
      }, t("auth:validation.dob_min_18", "You must be at least 18 years old")),

    gender: z
      .enum(["male", "female", "other"], {
        errorMap: () => ({ message: t("auth:validation.gender_required", "Please select gender") })
      }),

    aadhaarNumber: z
      .string()
      .refine(
        (val) => val.replace(/\D/g, "").length === 12,
        t("auth:validation.aadhaar_12_digits", "Aadhaar number must be exactly 12 digits")
      ),
  })
});

export const getUpdateAddressSchema = (t) => z.object({
  address: z
    .string()
    .min(5, t("auth:validation.address_min_5", "Address must be at least 5 characters"))
    .refine((val) => !val.startsWith(" "), t("auth:validation.address_no_start_space", "Address cannot start with a space")),

  pincode: z
    .string()
    .regex(/^\d{6}$/, t("auth:validation.pincode_6_digits", "Pincode must be exactly 6 digits")),

  subdivision: z
    .string()
    .min(1, t("auth:validation.subdivision_required", "Subdivision is required")),

  city: z.string().optional(),
  state: z.string().optional(),
});

export const getUpdateServiceChargeSchema = (t) => z.object({
  serviceCharge: z
    .string()
    .min(1, t("auth:validation.service_charge_required", "Service charge is required"))
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, t("auth:validation.service_charge_invalid", "Service charge must be a positive number")),
});

export const getUpdatePasswordSchema = (t) => z.object({
  currentPassword: z.string().min(1, t("auth:validation.current_password_required", "Current password is required")),
  
  newPassword: z
    .string()
    .min(8, t("auth:validation.password_min_8", "Password must be at least 8 characters"))
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      t("auth:validation.password_strength", "Password must include letters, numbers, and a special character")
    ),

  confirmPassword: z
    .string()
    .min(1, t("auth:validation.confirm_password_required", "Please confirm your password")),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: t("auth:validation.passwords_must_match", "Passwords do not match"),
  path: ["confirmPassword"],
});
