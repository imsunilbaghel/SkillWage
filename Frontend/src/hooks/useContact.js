import { useMutation } from "@tanstack/react-query";
import { createContact } from "@/api/contact";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useCreateContact = () => {
  const { t } = useTranslation(["common"]);

  return useMutation({
    mutationFn: (data) => createContact(data),
    onSuccess: (data) => {
      toast.success(data?.message || t("contactus.success", "Message sent successfully!"));
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || error.message || "Failed to send message";
      toast.error(msg);
    },
  });
};
