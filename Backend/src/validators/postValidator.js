import { z } from "zod";

const wordCount = (str) => {
  return str.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const CreatePostSchema = z.object({
    description: z.string().trim().refine((val) => wordCount(val) >= 10, {
        message: "Description must be at least 10 words.",
    }),
    category: z.enum(['labour', 'electrician', 'plumber', 'mistri', 'painter', 'carpenter'], {
        errorMap: () => ({ message: "Invalid category" })
    }),
    postImage: z.string().optional(),
});

export const UpdateDescriptionSchema = z.object({
    description: z.string().trim().refine((val) => wordCount(val) >= 10, {
        message: "Description must be at least 10 words.",
    }),
});