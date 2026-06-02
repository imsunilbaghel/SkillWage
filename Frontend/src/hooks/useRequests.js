import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
  acceptServiceRequest,
  getMyRequests,
  sendServiceRequest,
  rejectServiceRequest,
  generateOtp,
  verifyOtp,
  rateServiceRequest
} from "@/api/requests";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
export const useMyRequests = () => {
  return useInfiniteQuery({
    queryKey: ["myRequests"],
    queryFn: ({ pageParam = 1 }) => getMyRequests({ params: { page: pageParam } }),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 1 * 60 * 1000,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      if (page < totalPages) {
        return page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

export const useSendRequest = () => {

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workerId) => sendServiceRequest(workerId),
    onSuccess: () => {
      toast.success("Service request sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to send request");
    }
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (id) => rejectServiceRequest(id),
    onSuccess: () => {
      toast.success(t("requests.toast_reject_success"));
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || t("requests.toast_reject_error"));
    }
  });
}
export const useGenerateOtp = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (id) => generateOtp(id),
    onSuccess: (resData) => {
      toast.success(t("requests.toast_generate_otp_success", { otp: resData.data.otp }));
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || t("requests.toast_generate_otp_error"));
    }
  });
}
export const useAcceptRequest = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (id) => acceptServiceRequest(id),
    onSuccess: () => {
      toast.success(t("requests.toast_accept_success"));
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || t("requests.toast_accept_error"));
    }
  })
}
export const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({ id, otp }) => verifyOtp(id, otp),
    onSuccess: () => {
      toast.success(t("requests.toast_verify_otp_success"));
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || t("requests.toast_verify_otp_error"));
    }
  });
}
export const useRate = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({ id, rating }) => rateServiceRequest(id, rating),
    onSuccess: () => {
      toast.success(t("requests.toast_rate_success"));
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || t("requests.toast_rate_error"));
    }
  });
}