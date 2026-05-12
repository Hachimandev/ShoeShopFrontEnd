import api from "@/lib/api";
import {
  AuthRequest,
  AuthResponse,
  ChangePasswordRequest,
  RegisterRequest,
  UpdateAccountRequest,
  UserInfo,
} from "@/types/auth";

export const authService = {
  login: async (data: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("roles", JSON.stringify(response.data.roles));

      // Tạo một object user giả lập tương ứng với logic Header đang dùng
      const user = {
        username: response.data.username,
        fullName: response.data.username,
        role:
          response.data.roles && response.data.roles.length > 0
            ? response.data.roles[0]
            : "USER",
      };
      localStorage.setItem("user", JSON.stringify(user));

      // Gọi API lấy thông tin chi tiết khách hàng và lưu vào localStorage
      try {
        const customerResponse = await api.get(
          `/customers/info/${response.data.username}`,
        );
        if (customerResponse.data) {
          const fullUserData = {
            ...user,
            fullName: customerResponse.data.fullName || user.fullName,
            email: customerResponse.data.email,
            phoneNumber: customerResponse.data.phoneNumber,
            address: customerResponse.data.address,
          };
          localStorage.setItem("user", JSON.stringify(fullUserData));
        }
      } catch (err) {
        console.error("Failed to fetch customer info on login:", err);
        // Vẫn tiếp tục, thông tin basic vẫn được lưu
      }

      // Phát sự kiện để Header cập nhật ngay lập tức
      window.dispatchEvent(new Event("auth-change"));
    }
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<string> => {
    const response = await api.post<string>("/auth/register", data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
    localStorage.removeItem("user");
    // Phát sự kiện để Header cập nhật ngay lập tức
    window.dispatchEvent(new Event("auth-change"));
  },

  getCurrentUser: async (username: string): Promise<UserInfo> => {
    const response = await api.get<UserInfo>(`/accounts/me/${username}`);
    return response.data;
  },

  updateAccount: async (
    username: string,
    data: UpdateAccountRequest,
  ): Promise<UserInfo> => {
    const response = await api.put<UserInfo>(
      `/accounts/update/${username}`,
      data,
    );
    return response.data;
  },

  changePassword: async (
    username: string,
    data: ChangePasswordRequest,
  ): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(
      `/accounts/change-password/${username}`,
      data,
    );
    return response.data;
  },
};
