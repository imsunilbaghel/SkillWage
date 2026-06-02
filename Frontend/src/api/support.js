import { api } from "./axios";

export const createSupport = async (data) => {
  const response = await api.post("/support", data);
  return response.data;
};

export const getSupports = async ({ page = 1, limit = 10 }) => {
  const response = await api.get(`/support?page=${page}&limit=${limit}`);
  return response.data;
};
