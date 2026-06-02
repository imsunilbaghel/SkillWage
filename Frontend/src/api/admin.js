import { api } from "./axios";

export const adminLoginAPI = async (credentials) => {
  const { data } = await api.post("/admin/auth/login", credentials);
  return data;
};

export const adminLogoutAPI = async () => {
  const { data } = await api.post("/admin/auth/logout");
  return data;
};

export const adminGetMeAPI = async () => {
  const { data } = await api.get("/admin/auth/me");
  return data;
};

export const adminGetSupportsAPI = async (filters) => {
  const { data } = await api.get("/admin/support", { params: filters });
  return data;
};

export const adminUpdateSupportAPI = async ({ id, status, statusMessage }) => {
  const { data } = await api.put(`/admin/support/${id}`, {
    status,
    statusMessage,
  });
  return data;
};

export const adminGetWorkersAPI = async (filters) => {
  const { data } = await api.get("/admin/workers", { params: filters });
  return data;
};

export const adminUpdateWorkerAPI = async ({ id, ...updateData }) => {
  const { data } = await api.put(`/admin/workers/${id}`, updateData);
  return data;
};

export const adminGetCustomersAPI = async (filters) => {
  const { data } = await api.get("/admin/customers", { params: filters });
  return data;
};

export const adminUpdateCustomerAPI = async ({ id, ...updateData }) => {
  const { data } = await api.put(`/admin/customers/${id}`, updateData);
  return data;
};

export const adminGetRequestsAPI = async (filters) => {
  const { data } = await api.get("/admin/requests", { params: filters });
  return data;
};

export const adminUpdateReqStatusAPI = async ({ id, status }) => {
  const { data } = await api.put(`/admin/requests/${id}/status`, { status });
  return data;
};

export const adminGenerateReqOtpAPI = async (id) => {
  const { data } = await api.put(`/admin/requests/${id}/otp`);
  return data;
};

export const adminGetContactsAPI = async (filters) => {
  const { data } = await api.get("/admin/contacts", { params: filters });
  return data;
};

export const adminDeleteContactAPI = async (id) => {
  const { data } = await api.delete(`/admin/contacts/${id}`);
  return data;
};
