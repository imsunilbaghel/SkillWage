import {z} from "zod";

export const getWorkerLoginSchema = (t) => z.object({
    phoneNumber: z.string().regex(/^\d{10}$/, t("auth:validation.phone_10_digits")),
    password: z
      .string()
      .min(8, t("auth:validation.password_min_8")),
    dateofbirth: z
        .string()
        .refine((value) => {
        const dob = new Date(value);
        const today = new Date();

        const age =
            today.getFullYear() -
            dob.getFullYear() -
            (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())
            ? 1
            : 0);

        return age >= 18;
        }, t("auth:validation.dob_min_18")),
});

export const getCustomerLoginSchema = (t) => z.object({
    phoneNumber: z.string().regex(/^\d{10}$/, t("auth:validation.phone_10_digits")),
    password: z
      .string()
      .min(8, t("auth:validation.password_min_8"))
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        t("auth:validation.password_strength")
      ),
});

export const getWorkerForgotSchema = (t) => z.object({
    phoneNumber: z.string().regex(/^\d{10}$/, t("auth:validation.phone_10_digits")),
    dateOfBirth: z.string().refine((value) => {
        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear() - (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
        return age >= 18;
    }, t("auth:validation.dob_min_18")),
    aadhaarNumber: z.string().regex(/^\d{12}$/, t("auth:validation.aadhaar_12_digits")),
    newPassword: z.string().min(8, t("auth:validation.password_min_8")),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: t("auth:validation.passwords_must_match"),
    path: ["confirmPassword"],
});

export const getCustomerForgotEmailSchema = (t) => z.object({
    email: z.string().email(t("auth:validation.email_invalid")),
});

export const getCustomerForgotResetSchema = (t) => z.object({
    otp: z.string().min(6, "OTP must be 6 digits"),
    newPassword: z.string().min(8, t("auth:validation.password_min_8")).regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, t("auth:validation.password_strength")),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: t("auth:validation.passwords_must_match"),
    path: ["confirmPassword"],
});