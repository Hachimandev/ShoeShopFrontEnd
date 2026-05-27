import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        if (config.headers) {
          if (typeof config.headers.set === "function") {
            config.headers.set("Authorization", `Bearer ${token}`);
          } else {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }
        // console.log(
        //   `[API] Request: ${config.method?.toUpperCase()} ${config.url}, Token present: true`,
        // );
      } else {
        // console.warn(
        //   `[API] Request: ${config.method?.toUpperCase()} ${config.url}, Token missing!`,
        // );
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Thêm interceptor để log response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // console.error(
      //   `[API] Response error: ${error.response.status} ${error.response.statusText}`,
      //   error.response.data,
      // );
    } else if (error.request) {
      // console.error("[API] No response received:", error.request);
    } else {
      // console.error("[API] Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
