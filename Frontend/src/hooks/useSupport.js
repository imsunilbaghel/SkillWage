import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { createSupport, getSupports } from "@/api/support";
import { getUploadSignature, uploadToCloudinary } from "@/api/cloudinary";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useSupports = () => {
  return useInfiniteQuery({
    queryKey: ["supports"],
    queryFn: ({ pageParam = 1 }) => getSupports({ page: pageParam, limit: 10 }),
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      if (page < totalPages) {
        return page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

export const useCreateSupport = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(["common"]);

  return useMutation({
    mutationFn: async ({ query, imageFile }) => {
      let screenshot = "";

      if (imageFile) {
        const toastId = toast.loading(t("support.uploading_image", "Uploading image..."));
        try {
          const sigData = await getUploadSignature();
          if (!sigData?.success) throw new Error("Failed to get signature");
          const { signature, timestamp } = sigData.data;
          
          screenshot = await uploadToCloudinary(imageFile, timestamp, signature);
          toast.dismiss(toastId);
        } catch (error) {
          toast.dismiss(toastId);
          throw new Error(t("support.upload_failed", "Image upload failed"));
        }
      }

      return createSupport({ query, screenshot });
    },
    onSuccess: () => {
      toast.success(t("support.create_success", "Support request created successfully!"));
      queryClient.invalidateQueries({ queryKey: ["supports"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message || t("support.create_error", "Failed to create support request"));
    }
  });
};
