import axios from "axios";
const API_URL = "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Client-side Rate Limiting (Throttle) to prevent rapid submissions
const lastRequestTimes: Record<string, number> = {};
const MIN_REQUEST_INTERVAL = 1000; // 1 second minimum interval between similar POST requests

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
      }

      // Check client-side rate limit/throttle for POST requests
      const requestKey = `${config.method}:${config.url}`;
      if (config.method === "post" && (config.url?.includes("/checkout") || config.url?.includes("/ai"))) {
        const now = Date.now();
        const lastTime = lastRequestTimes[requestKey] || 0;
        if (now - lastTime < MIN_REQUEST_INTERVAL) {
          // Reject request on client-side rate limiting
          return Promise.reject({
            isRateLimited: true,
            message: "Bạn đang gửi yêu cầu quá nhanh. Vui lòng đợi 1 giây.",
          });
        }
        lastRequestTimes[requestKey] = now;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Configuration for Axios Retry
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 3000; // 3 seconds retry delay

interface CustomAxiosRequestConfig {
  _retryCount?: number;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If it's a client-side rate limit error, propagate it
    if (error.isRateLimited) {
      return Promise.reject(error);
    }

    const { config, response } = error;

    // Check if we should retry: Network Error or Server Unavailable (503, 504)
    const isNetworkError = !response;
    const isServerError = response && (response.status === 503 || response.status === 504);

    if (config && (isNetworkError || isServerError)) {
      const customConfig = config as CustomAxiosRequestConfig;
      customConfig._retryCount = customConfig._retryCount || 0;

      if (customConfig._retryCount < MAX_RETRY_ATTEMPTS) {
        customConfig._retryCount += 1;
        console.warn(
          `[API] Request failed. Retrying attempt ${customConfig._retryCount} in ${RETRY_DELAY_MS / 1000}s...`,
          error.message
        );

        // Wait for 3 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));

        // Re-execute Axios request with the same config
        return api(config);
      }
    }

    if (response) {
      // console.error(
      //   `[API] Response error: ${response.status} ${response.statusText}`,
      //   response.data,
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
