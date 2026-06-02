import { z } from "zod";

// ─── Worker Registration Schema ─────────────────────────────────────────────
export const getWorkerRegistrationSchema = (t) => z.object({
  fullName: z
    .string()
    .min(2, t("auth:validation.name_min_2"))
    .refine((val) => !val.startsWith(" "), t("auth:validation.name_no_start_space")),

  phoneNumber: z
    .string()
    .regex(/^[5-9]\d{9}$/, t("auth:validation.phone_valid_5_9")),

  dateOfBirth: z
    .string()
    .min(1, t("auth:validation.dob_required"))
    .refine((value) => {
      const dob = new Date(value);
      const today = new Date();
      const age =
        today.getFullYear() -
        dob.getFullYear() -
        (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
      return age >= 18;
    }, t("auth:validation.dob_min_18")),

  gender: z
    .enum(["male", "female", "other"], {
      errorMap: () => ({ message: t("auth:validation.gender_required") || "Please select gender" })
    }),

  aadhaarNumber: z
    .string()
    .refine(
      (val) => val.replace(/\D/g, "").length === 12,
      t("auth:validation.aadhaar_12_digits")
    ),

  address: z
    .string()
    .min(5, t("auth:validation.address_min_5"))
    .refine((val) => !val.startsWith(" "), t("auth:validation.address_no_start_space")),

  pincode: z
    .string()
    .regex(/^\d{6}$/, t("auth:validation.pincode_6_digits")),

  subdivision: z
    .string()
    .min(1, t("auth:validation.subdivision_required")),

  city: z.string().optional(),
  state: z.string().optional(),

  serviceCharge: z
    .string()
    .min(1, t("auth:validation.service_charge_required"))
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, t("auth:validation.service_charge_invalid")),

  occupation: z
    .string()
    .min(1, "Occupation is required")
    .refine((val) => ['labour', 'electrician', 'plumber', 'mistri', 'painter', 'carpenter'].includes(val), "Invalid occupation"),
});

// ─── Customer Registration Schema ───────────────────────────────────────────
export const getCustomerRegistrationSchema = (t) => z.object({
  fullName: z
    .string()
    .min(2, t("auth:validation.name_min_2"))
    .refine((val) => !val.startsWith(" "), t("auth:validation.name_no_start_space")),

  phoneNumber: z
    .string()
    .regex(/^[5-9]\d{9}$/, t("auth:validation.phone_valid_5_9")),

  email: z
    .string()
    .email(t("auth:validation.email_invalid")),

  password: z
    .string()
    .min(8, t("auth:validation.password_min_8"))
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      t("auth:validation.password_strength")
    ),

  confirmPassword: z
    .string()
    .min(1, t("auth:validation.confirm_password_required")),

  address: z
    .string()
    .min(5, t("auth:validation.address_min_5"))
    .refine((val) => !val.startsWith(" "), t("auth:validation.address_no_start_space")),

  pincode: z
    .string()
    .regex(/^\d{6}$/, t("auth:validation.pincode_6_digits")),

  subdivision: z
    .string()
    .min(1, t("auth:validation.subdivision_required")),

  city: z.string().optional(),
  state: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: t("auth:validation.passwords_must_match"),
  path: ["confirmPassword"],
});
