/**
 * Utility xử lý lỗi từ Axios / API responses.
 * Dùng chung cho toàn bộ project để đảm bảo nhất quán.
 */

interface AxiosErrorShape {
  response?: {
    status?: number;
    data?: unknown;
  };
  isRateLimited?: boolean;
  message?: string;
}

/**
 * Trích xuất chuỗi thông báo lỗi từ response của server.
 * Xử lý cả dạng string lẫn object {timestamp, status, error, message, path}.
 */
export function extractErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === "string" && data.trim().length > 0) {
    if (data.trim().toLowerCase().startsWith("<!doctype html") || data.includes("<html")) {
      return fallback;
    }
    return data;
  }
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const msg = obj["message"] ?? obj["error"];
    if (typeof msg === "string" && msg.trim().length > 0) {
      return msg;
    }
  }
  return fallback;
}

/**
 * Xử lý lỗi catch block cho các form gọi API.
 * Trả về chuỗi lỗi phù hợp để set vào state.
 *
 * @param err         - Lỗi bắt được từ catch
 * @param fallback    - Thông báo mặc định nếu không parse được
 * @returns           - Chuỗi thông báo lỗi hiển thị cho user
 */
export function handleApiError(err: unknown, fallback: string): string {
  if (!err || typeof err !== "object") {
    return fallback;
  }

  const error = err as AxiosErrorShape;

  // Client-side rate limit (throttle từ api.ts interceptor)
  if (error.isRateLimited) {
    return error.message || "Bạn đang gửi yêu cầu quá nhanh. Vui lòng đợi một chút.";
  }

  if (!error.response) {
    // Network error (không kết nối được server)
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
  }

  const { status, data } = error.response;

  // Rate limit từ server (Nginx hoặc Java Filter)
  if (status === 429) {
    return extractErrorMessage(data, "Quá nhiều yêu cầu. Vui lòng chờ một phút rồi thử lại.");
  }

  // Unauthorized
  if (status === 401) {
    return extractErrorMessage(data, "Tên đăng nhập hoặc mật khẩu không đúng.");
  }

  // Forbidden
  if (status === 403) {
    return extractErrorMessage(data, "Bạn không có quyền thực hiện thao tác này.");
  }

  // Bad Request
  if (status === 400) {
    return extractErrorMessage(data, "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
  }

  // Server Error
  if (status && status >= 500) {
    return "Lỗi máy chủ. Vui lòng thử lại sau.";
  }

  return extractErrorMessage(data, fallback);
}
