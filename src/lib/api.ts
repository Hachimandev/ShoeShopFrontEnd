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
      if (
        config.method === "post" &&
        (config.url?.includes("/checkout") || config.url?.includes("/ai"))
      ) {
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
    // Nếu là client-side rate limit (throttle), truyền thẳng xuống
    if (error.isRateLimited) {
      return Promise.reject(error);
    }

    const { config, response } = error;

    // ----------------------------------------------------------------
    // Xử lý 429 Too Many Requests từ server (Nginx hoặc Java Filter)
    // Hiển thị thông báo nổi bật cho người dùng thay vì chỉ thấy qua F12
    // ----------------------------------------------------------------
    if (response?.status === 429) {
      const serverMessage =
        response.data?.error ||
        "Bạn đang thao tác quá nhanh. Vui lòng chờ một chút rồi thử lại.";

      showRateLimitNotification(serverMessage);
      return Promise.reject(error);
    }

    // Check if we should retry: Network Error or Server Unavailable (503, 504)
    const isNetworkError = !response;
    const isServerError =
      response && (response.status === 503 || response.status === 504);

    if (config && (isNetworkError || isServerError)) {
      const customConfig = config as CustomAxiosRequestConfig;
      customConfig._retryCount = customConfig._retryCount || 0;

      if (customConfig._retryCount < MAX_RETRY_ATTEMPTS) {
        customConfig._retryCount += 1;
        console.warn(
          `[API] Request failed. Retrying attempt ${customConfig._retryCount} in ${RETRY_DELAY_MS / 1000}s...`,
          error.message,
        );

        // Wait for 3 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));

        // Re-execute Axios request with the same config
        return api(config);
      }
    }

    return Promise.reject(error);
  },
);

// ----------------------------------------------------------------
// Hiển thị thông báo rate limit nổi bật trên giao diện (không cần F12)
// Tạo toast tạm thời ở góc màn hình, tự động biến mất sau 5 giây
// ----------------------------------------------------------------
function showRateLimitNotification(message: string) {
  if (typeof window === "undefined") return;

  // Tránh hiển thị nhiều toast cùng lúc
  const existingToast = document.getElementById("rate-limit-toast");
  if (existingToast) return;

  const toast = document.createElement("div");
  toast.id = "rate-limit-toast";
  toast.setAttribute("role", "alert");
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 99999;
    background: #b91c1c;
    color: #ffffff;
    padding: 14px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    font-size: 14px;
    font-family: sans-serif;
    max-width: 360px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    animation: slideIn 0.3s ease;
  `;

  const icon = document.createElement("span");
  icon.textContent = "⚠️";
  icon.style.fontSize = "18px";

  const textBlock = document.createElement("div");

  const title = document.createElement("strong");
  title.textContent = "Quá nhiều yêu cầu";
  title.style.display = "block";
  title.style.marginBottom = "4px";

  const body = document.createElement("span");
  body.textContent = message;
  body.style.opacity = "0.9";

  textBlock.appendChild(title);
  textBlock.appendChild(body);
  toast.appendChild(icon);
  toast.appendChild(textBlock);

  // Thêm animation CSS vào head (chỉ 1 lần)
  if (!document.getElementById("rate-limit-style")) {
    const style = document.createElement("style");
    style.id = "rate-limit-style";
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(120%); opacity: 0; }
        to   { transform: translateX(0);   opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  // Tự xóa sau 5 giây
  setTimeout(() => {
    toast.style.transition = "opacity 0.4s";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

export default api;
