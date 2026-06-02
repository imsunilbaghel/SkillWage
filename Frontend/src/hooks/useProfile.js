import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  updatePersonalDetails,
  updateProfileImage,
  updateAddressDetails,
  updateServiceCharge,
  updatePassword
} from "../api/profile";

export const useUpdatePersonal = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(["common", "posts", "home"]);

  return useMutation({
    mutationFn: updatePersonalDetails,
    onSuccess: () => {
      toast.success(t("common:profile_update_success", "Personal details updated successfully"));
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || t("common:profile_update_error", "Failed to update personal details"));
    }
  });
};

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(["common", "posts", "home"]);

  return useMutation({
    mutationFn: updateProfileImage,
    onSuccess: () => {
      toast.success(t("common:image_update_success", "Profile image updated successfully"));
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err.message || t("common:image_update_error", "Failed to update profile image"));
    }
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(["common"]);

  return useMutation({
    mutationFn: updateAddressDetails,
    onSuccess: () => {
      toast.success(t("common:address_update_success", "Address details updated successfully"));
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t("common:address_update_error", "Failed to update address details"));
    },
  });
};

export const useUpdateServiceCharge = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(["common", "posts", "home"]);

  return useMutation({
    mutationFn: updateServiceCharge,
    onSuccess: () => {
      toast.success(t("common:charge_update_success", "Service charge updated successfully"));
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || t("common:charge_update_error", "Failed to update service charge"));
    }
  });
};

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(["common", "posts", "home"]);

  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success(t("common:password_update_success", "Password updated successfully"));
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || t("common:password_update_error", "Failed to update password"));
    }
  });
};
