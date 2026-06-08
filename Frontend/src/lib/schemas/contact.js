import { z } from "zod";
export const contactusSchema = (t) => z.object({
    fullname: z.string().trim().min(1, t("contactus.fullname_error")),
    email: z.string().email(t("contactus.email_error")),
    message: z
        .string()
        .refine(
            (val) => val.trim().split(/\s+/).filter(w => w.length > 0).length >= 10,
            t("contactus.message_error")
        ),
})