import axios from "axios";
import { toast } from "sonner";

const getBaseURL = () => {
  // if (typeof window !== "undefined" && window.location) {
  //   const { hostname } = window.location;
  //   return `http://${hostname}:8080/api`;
  // }
  // return import.meta.env.VITE_API_URL || "http://localhost:8080/api";
  // Utilizing Vercel Rewrites in production and Vite proxy in development.
  // This ensures all requests are treated as same-origin, completely avoiding CORS and Cookie issues!
  return "/api";
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isUnauthorizedToastShown = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!isUnauthorizedToastShown && window.location.pathname !== "/auth/login" && window.location.pathname !== "/auth/register" && window.location.pathname !== "/admin/login") {
        isUnauthorizedToastShown = true;
        const errorMessage = error.response.data?.message || "Session expired. Please log in again.";
        toast.error(errorMessage);

        setTimeout(() => {
          if (window.location.pathname.startsWith("/admin")) {
            window.location.href = "/admin/login";
          } else {
            window.location.href = "/auth/login";
          }
        }, 1500);
      }
    }
    return Promise.reject(error);
  }
);
