import api from "@/lib/api";
import { 
  AuthRequest, 
  AuthResponse, 
  ChangePasswordRequest, 
  RegisterRequest,
  UpdateAccountRequest,
  UserInfo 
} from "@/types/auth";

export const authService = {
  login: async (data: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("roles", JSON.stringify(response.data.roles));
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
  },

  getCurrentUser: async (username: string): Promise<UserInfo> => {
    const response = await api.get<UserInfo>(`/accounts/me/${username}`);
    return response.data;
  },

  updateAccount: async (username: string, data: UpdateAccountRequest): Promise<UserInfo> => {
    const response = await api.put<UserInfo>(`/accounts/update/${username}`, data);
    return response.data;
  },

  changePassword: async (username: string, data: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(`/accounts/change-password/${username}`, data);
    return response.data;
  },
};
