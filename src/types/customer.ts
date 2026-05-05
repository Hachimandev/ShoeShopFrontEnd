export interface Customer {
  customerId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  loyaltyPoints?: number;
  joinDate?: string;
  totalSpending?: number;
}

export interface CustomerDTO {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  ward: string;
  district: string;
  city: string;
}

export interface UpdateCustomerDTO {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}

export interface CustomerSearchParams {
  search?: string;
  minSpend?: number;
  maxSpend?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable?: unknown;
  totalElements: number;
  totalPages: number;
  last?: boolean;
  size: number;
  number: number;
  sort?: unknown;
  first?: boolean;
  numberOfElements?: number;
}
