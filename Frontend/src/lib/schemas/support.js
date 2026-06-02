import { z } from "zod";

const wordCount = (str) => {
  return str.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const getCreateSupportSchema = (t) => z.object({
  query: z.string().trim().refine((val) => wordCount(val) >= 10, {
    message: t("support.min_words_error"),
  }),
});
