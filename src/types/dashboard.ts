import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import type { Customer } from "@/types/customer";

export interface DashboardRawData {
  orders: Order[];
  products: Product[];
  customers: Customer[];
  customerTotal: number;
}

export interface TrendInfo {
  percent: number | null;
  label: string;
  direction: "up" | "down" | "flat" | "unknown";
}

export interface KpiCardData {
  title: string;
  value: string;
  trend: TrendInfo;
  icon: "revenue" | "orders" | "stock" | "customers";
}

export interface CategorySlice {
  name: string;
  count: number;
  color: string;
  percent: number;
}
