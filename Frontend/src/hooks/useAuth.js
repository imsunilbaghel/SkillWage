import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, logoutUser } from "../api/auth";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isAuthKnown = localStorage.getItem("isAuthenticated") === "true";

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUser,
    retry: false, // Do not retry on 401
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthKnown,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.success(t("nav.logout_success"));
      queryClient.setQueryData(["authUser"], null);
      localStorage.removeItem("isAuthenticated");
      navigate("/auth/login");
    },
  });

  const user = data?.data?.user || null;
  const role = data?.data?.user.role || null;
  const isAuthenticated = !!user;

  const actualIsLoading = isAuthKnown ? isLoading : false;

  return {
    user,
    role,
    isAuthenticated,
    isLoading: actualIsLoading,
    error,
    refetch,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};
