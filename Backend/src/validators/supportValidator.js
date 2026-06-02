import { z } from "zod";

const wordCount = (str) => {
  return str.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const CreateSupportSchema = z.object({
    query: z.string().trim().refine((val) => wordCount(val) >= 10, {
        message: "Query must be at least 10 words",
    }),
    screenshot: z.string().optional()
});
