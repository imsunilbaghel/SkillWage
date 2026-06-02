import { z } from "zod";

const wordCount = (str) => {
  return str.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const getCreatePostSchema = (t) => z.object({
  category: z.enum(['labour', 'electrician', 'plumber', 'mistri', 'painter', 'carpenter'], {
    errorMap: () => ({ message: t("posts.validation.category_required") })
  }),
  description: z.string().trim().refine((val) => wordCount(val) >= 10, {
    message: t("posts.validation.description_min_10"),
  }),
});

export const getUpdateDescriptionSchema = (t) => z.object({
  description: z.string().trim().refine((val) => wordCount(val) >= 10, {
    message: t("posts.validation.description_min_10"),
  }),
});
