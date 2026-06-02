import { api } from "./axios";

export const createContact = async (data) => {
  const response = await api.post("/contact", data);
  return response.data;
};
