import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { createPost, getPosts, updatePostDescription, updatePostStatus, deletePost } from "@/api/post";
import { getUploadSignature, uploadToCloudinary } from "@/api/cloudinary";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useCustomerPosts = () => {
  return useInfiniteQuery({
    queryKey: ["customerPosts"],
    queryFn: ({ pageParam = 1 }) => getPosts({ page: pageParam, limit: 10 }),
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

export const useWorkerPosts = (isVerified = true) => {
  return useInfiniteQuery({
    queryKey: ["workerPosts"],
    queryFn: ({ pageParam = 1 }) => getPosts({ page: pageParam, limit: 10 }),
    refetchOnWindowFocus: false,
    enabled: isVerified,
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

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(["common"]);

  return useMutation({
    mutationFn: async ({ postData, imageFile }) => {
      let postImage = "";

      if (imageFile) {
        const toastId = toast.loading(t("posts.toast.uploading_image", "Uploading image..."));
        try {
          const sigData = await getUploadSignature();
          if (!sigData?.success) throw new Error("Failed to get signature");
          const { signature, timestamp } = sigData.data;
          
          postImage = await uploadToCloudinary(imageFile, timestamp, signature);
          toast.dismiss(toastId);
        } catch (error) {
          toast.dismiss(toastId);
          throw new Error(t("posts.toast.upload_failed", "Image upload failed"));
        }
      }

      const finalData = { ...postData, postImage };
      return createPost(finalData);
    },
    onSuccess: () => {
      toast.success(t("posts.toast.create_success", "Post created successfully!"));
      queryClient.invalidateQueries({ queryKey: ["customerPosts"] });
      queryClient.invalidateQueries({ queryKey: ["workerPosts"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message || t("posts.toast.create_error", "Failed to create post"));
    }
  });
};

export const useUpdatePostDescription = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(["common"]);

  return useMutation({
    mutationFn: ({ id, description }) => updatePostDescription(id, description),
    onSuccess: () => {
      toast.success(t("posts.toast.update_success", "Description updated successfully!"));
      queryClient.invalidateQueries({ queryKey: ["customerPosts"] });
      queryClient.invalidateQueries({ queryKey: ["workerPosts"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || t("posts.toast.update_error", "Failed to update description"));
    }
  });
};

export const useCompletePost = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(["common"]);

  return useMutation({
    mutationFn: (id) => updatePostStatus(id),
    onSuccess: () => {
      toast.success(t("posts.toast.complete_success", "Post marked as completed!"));
      queryClient.invalidateQueries({ queryKey: ["customerPosts"] });
      queryClient.invalidateQueries({ queryKey: ["workerPosts"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || t("posts.toast.complete_error", "Failed to complete post"));
    }
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(["common"]);

  return useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: () => {
      toast.success(t("posts.toast.delete_success", "Post deleted successfully!"));
      queryClient.invalidateQueries({ queryKey: ["customerPosts"] });
      queryClient.invalidateQueries({ queryKey: ["workerPosts"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || t("posts.toast.delete_error", "Failed to delete post"));
    }
  });
};
