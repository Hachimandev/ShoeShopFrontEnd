/** Matches backend enums in ShoeShopBackEnd model package */

export type WorkStatus = "Active" | "Resigned";

export type StaffGender = "Male" | "Female";

export type Department =
  | "Sales"
  | "Warehouse"
  | "Technical"
  | "Administrative"
  | "HumanResources"
  | "FinanceAccounting"
  | "Marketing";

export type Position =
  | "Staff"
  | "Specialist"
  | "Director"
  | "CEO"
  | "DeputyManager"
  | "DepartmentManager";

export interface Staff {
  staffId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  citizenId?: string;
  img?: string;
  birthDate?: string | null;
  workStatus?: WorkStatus | null;
  gender?: StaffGender | null;
  position?: Position | null;
  department?: Department | null;
}

export interface StaffListParams {
  search?: string;
  department?: string;
  status?: string;
  page?: number;
  size?: number;
}

export const DEPARTMENT_OPTIONS: { value: Department; label: string }[] = [
  { value: "Sales", label: "Bán hàng" },
  { value: "Warehouse", label: "Kho" },
  { value: "Technical", label: "Kỹ thuật" },
  { value: "Administrative", label: "Hành chính" },
  { value: "HumanResources", label: "Nhân sự" },
  { value: "FinanceAccounting", label: "Tài chính kế toán" },
  { value: "Marketing", label: "Marketing" },
];

export const WORK_STATUS_OPTIONS: { value: WorkStatus; label: string }[] = [
  { value: "Active", label: "Đang làm việc" },
  { value: "Resigned", label: "Đã nghỉ làm" },
];

export const GENDER_OPTIONS: { value: StaffGender; label: string }[] = [
  { value: "Male", label: "Nam" },
  { value: "Female", label: "Nữ" },
];

export const POSITION_OPTIONS: { value: Position; label: string }[] = [
  { value: "Staff", label: "Nhân viên" },
  { value: "Specialist", label: "Chuyên viên" },
  { value: "Director", label: "Giám đốc" },
  { value: "CEO", label: "CEO" },
  { value: "DeputyManager", label: "Phó phòng" },
  { value: "DepartmentManager", label: "Trưởng phòng" },
];

export function departmentLabel(d?: Department | null): string {
  if (!d) return "—";
  return DEPARTMENT_OPTIONS.find((x) => x.value === d)?.label ?? d;
}

export function workStatusLabel(s?: WorkStatus | null): string {
  if (!s) return "—";
  return WORK_STATUS_OPTIONS.find((x) => x.value === s)?.label ?? s;
}

export function positionLabel(p?: Position | null): string {
  if (!p) return "—";
  return POSITION_OPTIONS.find((x) => x.value === p)?.label ?? p;
}
