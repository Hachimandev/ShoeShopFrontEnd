import api from "@/lib/api";
import {
  Staff,
  StaffListParams,
} from "@/types/staff";
import { PaginatedResponse } from "@/types/customer";

export const staffService = {
  list: async (
    params: StaffListParams,
  ): Promise<PaginatedResponse<Staff>> => {
    const response = await api.get<PaginatedResponse<Staff>>("/staffs", {
      params: {
        search: params.search || undefined,
        department:
          params.department && params.department !== "all"
            ? params.department
            : undefined,
        status:
          params.status && params.status !== "all"
            ? params.status
            : undefined,
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    });
    return response.data;
  },

  /** Fetch many rows for dashboard stats (backend paginates then filters in-memory). */
  fetchStaffSnapshot: async (): Promise<Staff[]> => {
    const response = await api.get<PaginatedResponse<Staff>>("/staffs", {
      params: { page: 0, size: 2000 },
    });
    return response.data.content ?? [];
  },

  getById: async (id: string): Promise<Staff> => {
    const response = await api.get<Staff>(`/staffs/${encodeURIComponent(id)}`);
    return response.data;
  },

  create: async (staff: Staff): Promise<Staff> => {
    const response = await api.post<Staff>("/staffs", staff);
    return response.data;
  },

  update: async (id: string, staff: Staff): Promise<Staff> => {
    const response = await api.put<Staff>(
      `/staffs/${encodeURIComponent(id)}`,
      staff,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/staffs/${encodeURIComponent(id)}`);
  },

  exportCsv: async (params: Omit<StaffListParams, "page" | "size">): Promise<Blob> => {
    const response = await api.get("/staffs/export", {
      params: {
        search: params.search || undefined,
        department:
          params.department && params.department !== "all"
            ? params.department
            : undefined,
        status:
          params.status && params.status !== "all"
            ? params.status
            : undefined,
      },
      responseType: "blob",
    });
    return response.data;
  },
};
