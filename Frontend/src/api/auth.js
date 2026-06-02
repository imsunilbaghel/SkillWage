import { api } from "./axios";

// Register a skilled worker

export const registerWorker = async (workerData) => {
  const response = await api.post("/auth/worker/register", workerData);
  return response.data;
};

// Register a customer
export const registerCustomer = async (customerData) => {
  const response = await api.post("/auth/customer/register", customerData);
  return response.data;
};

// Login a skilled worker
export const loginWorker = async (credentials) => {
  const response = await api.post("/auth/worker/login", credentials);
  return response.data;
};

// Login a customer
export const loginCustomer = async (credentials) => {
  const response = await api.post("/auth/customer/login", credentials);
  return response.data;
};

// Get current logged in user
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Logout
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

// Forgot Password - Worker
export const workerForgotPassword = async (data) => {
  const response = await api.post("/auth/worker/forgot-password", data);
  return response.data;
};

// Forgot Password - Customer Send OTP
export const customerForgotSendOtp = async (data) => {
  const response = await api.post("/auth/customer/forgot-password/send-otp", data);
  return response.data;
};

// Forgot Password - Customer Reset
export const customerForgotResetPassword = async (data) => {
  const response = await api.post("/auth/customer/forgot-password/reset", data);
  return response.data;
};
