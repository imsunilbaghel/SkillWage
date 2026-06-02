import { z } from "zod";

export const contactSchema = z.object({
  fullname: z.string().trim().min(1, "Full name is required").max(100),
  email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
  message: z.string().trim().refine((val) => val.split(/\s+/).length >= 10, {
    message: "Message must be at least 10 words",
  }),
});
