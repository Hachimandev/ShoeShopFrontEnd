export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  accountId: string;
  roles: string[];
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface UpdateAccountRequest {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  oldPassword?: string;
  newPassword?: string;
}

export interface UserInfo {
  accountId: string;
  username: string;
  email: string;
  roles: string[];
  customer?: {
    customerId: string;
    fullName: string;
    phoneNumber: string;
    address: string;
  };
}
