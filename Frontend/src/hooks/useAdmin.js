import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminLoginAPI, adminLogoutAPI, adminGetMeAPI, adminGetSupportsAPI, adminUpdateSupportAPI, adminGetWorkersAPI, adminUpdateWorkerAPI, adminGetCustomersAPI, adminUpdateCustomerAPI, adminGetRequestsAPI, adminUpdateReqStatusAPI, adminGenerateReqOtpAPI, adminGetContactsAPI, adminDeleteContactAPI } from "../api/admin";
import { toast } from "sonner";
import { useNavigate } from "react-router";

// Admin Auth Hooks
export const useAdminAuth = () => {
  const isAdminAuthKnown = localStorage.getItem("isAdminAuthenticated") === "true";

  const {
    data: admin,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin"],
    queryFn: async () => {
      const data = await adminGetMeAPI();
      return data.data.user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: isAdminAuthKnown,
  });

  const actualIsLoading = isAdminAuthKnown ? isLoading : false;

  return { admin, isAuthenticated: !!admin, isLoading: actualIsLoading, isError };
};

export const useAdminLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: adminLoginAPI,
    onSuccess: (data) => {
      localStorage.setItem("isAdminAuthenticated", "true");
      queryClient.setQueryData(["admin"], data.data.user);
      toast.success(data.message || "Logged in successfully");
      navigate("/admin/workers");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
};

export const useAdminLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: adminLogoutAPI,
    onSuccess: () => {
      localStorage.removeItem("isAdminAuthenticated");
      queryClient.setQueryData(["admin"], null);
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/admin/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Logout failed");
    },
  });
};

// Admin Support Hooks
export const useAdminSupports = (filters) => {
  return useQuery({
    queryKey: ["adminSupports", filters],
    queryFn: async () => {
      const data = await adminGetSupportsAPI(filters);
      return data.data; // { supports, pagination }
    },
    keepPreviousData: true,
  });
};

export const useUpdateAdminSupport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminUpdateSupportAPI,
    onSuccess: (data) => {
      toast.success("Support query updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminSupports"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update support query");
    },
  });
};

// Admin Worker Hooks
export const useAdminWorkers = (filters) => {
  return useQuery({
    queryKey: ["adminWorkers", filters],
    queryFn: async () => {
      const data = await adminGetWorkersAPI(filters);
      return data.data; // { workers, pagination }
    },
    keepPreviousData: true,
  });
};

export const useUpdateAdminWorker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminUpdateWorkerAPI,
    onSuccess: () => {
      toast.success("Worker details updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminWorkers"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update worker");
    },
  });
};

// Admin Customer Hooks
export const useAdminCustomers = (filters) => {
  return useQuery({
    queryKey: ["adminCustomers", filters],
    queryFn: async () => {
      const data = await adminGetCustomersAPI(filters);
      return data.data; // { customers, pagination }
    },
    keepPreviousData: true,
  });
};

export const useUpdateAdminCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminUpdateCustomerAPI,
    onSuccess: () => {
      toast.success("Customer details updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminCustomers"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update customer");
    },
  });
};

// Admin Service Request Hooks
export const useAdminRequests = (filters) => {
  return useQuery({
    queryKey: ["adminRequests", filters],
    queryFn: async () => {
      const data = await adminGetRequestsAPI(filters);
      return data.data; // { requests, pagination }
    },
    keepPreviousData: true,
  });
};

export const useUpdateAdminRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminUpdateReqStatusAPI,
    onSuccess: () => {
      toast.success("Request status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminRequests"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });
};

export const useAdminGenerateRequestOTP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminGenerateReqOtpAPI,
    onSuccess: (data) => {
      toast.success(`OTP Generated: ${data.data.otp}`);
      queryClient.invalidateQueries({ queryKey: ["adminRequests"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to generate OTP");
    },
  });
};

// Admin Contact Hooks
export const useAdminContacts = (filters) => {
  return useQuery({
    queryKey: ["adminContacts", filters],
    queryFn: async () => {
      const data = await adminGetContactsAPI(filters);
      return data;
    },
    keepPreviousData: true,
  });
};

export const useAdminDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminDeleteContactAPI,
    onSuccess: () => {
      toast.success("Contact deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminContacts"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete contact");
    },
  });
};
