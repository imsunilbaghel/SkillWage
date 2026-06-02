import { api } from "./axios";

export const createPost = async (postData) => {
  const response = await api.post("/post/create", postData);
  return response.data;
};

export const getPosts = async (params) => {
  const response = await api.get("/post/all-post", { params });
  return response.data;
};

export const updatePostDescription = async (id, description) => {
  const response = await api.put(`/post/update/${id}`, { description });
  return response.data;
};

export const updatePostStatus = async (id) => {
  const response = await api.patch(`/post/status/${id}`);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await api.delete(`/post/delete/${id}`);
  return response.data;
};
