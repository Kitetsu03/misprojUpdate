// import dotenv from "dotenv";
// dotenv.config();
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers = req.headers || {};
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// Handle global errors
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const message = err.response?.data?.message;

      if (message === "Invalid token" || message === "No token provided") {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
    return Promise.reject(err);
  },
);

export default API;
