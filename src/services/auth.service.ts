import api from "@/lib/api";
import {
  AuthRequest,
  AuthResponse,
  ChangePasswordRequest,
  GoogleLoginRequest,
  RegisterRequest,
  UpdateAccountRequest,
  UserInfo,
} from "@/types/auth";

async function persistAuthSession(auth: AuthResponse) {
  localStorage.setItem("token", auth.token);
  localStorage.setItem("username", auth.username);
  localStorage.setItem("roles", JSON.stringify(auth.roles));

  const user = {
    accountId: auth.accountId,
    username: auth.username,
    fullName: auth.username,
    role: auth.roles && auth.roles.length > 0 ? auth.roles[0] : "USER",
  };
  localStorage.setItem("user", JSON.stringify(user));

  try {
    const customerResponse = await api.get(`/customers/${auth.username}`);
    if (customerResponse.data) {
      const fullUserData = {
        ...user,
        customerId: customerResponse.data.customerId,
        fullName: customerResponse.data.fullName || user.fullName,
        email: customerResponse.data.email,
        phoneNumber: customerResponse.data.phoneNumber,
        address: customerResponse.data.address,
      };
      localStorage.setItem("user", JSON.stringify(fullUserData));
    }
  } catch (err) {
    console.error("Failed to fetch customer info on login:", err);
  }

  window.dispatchEvent(new Event("auth-change"));
}

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
          `/customers/${response.data.username}`,
        );
        if (customerResponse.data) {
          const fullUserData = {
            ...user,
            customerId: customerResponse.data.customerId,
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

  loginWithGoogle: async (data: GoogleLoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login-google", data);
    if (response.data.token) {
      await persistAuthSession(response.data);
    }
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<string> => {
    const response = await api.post<string>("/auth/register", data);
    return response.data;
  },

  sendOtp: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/auth/register/send-otp", { email });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/auth/register/verify-otp", { email, otp });
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

  forgotPasswordSendOtp: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/auth/forgot-password/send-otp", { email });
    return response.data;
  },

  forgotPasswordVerifyOtp: async (email: string, otp: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/auth/forgot-password/verify-otp", { email, otp });
    return response.data;
  },

  forgotPasswordResetPassword: async (data: { email: string; password?: string; confirmPassword?: string }): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/auth/forgot-password/reset-password", data);
    return response.data;
  },
};
