import type { Customer } from "@/types/customer";
import type { Order } from "@/types/order";
import { OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";
import type { CategorySlice, TrendInfo } from "@/types/dashboard";

const CATEGORY_COLORS = [
  "#f97316",
  "#1e3a5f",
  "#64748b",
  "#94a3b8",
  "#0ea5e9",
  "#8b5cf6",
  "#22c55e",
];

export function parseOrderDate(o: Order): Date | null {
  const raw = o.orderDate;
  if (raw == null) return null;
  const d = new Date(raw as string);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function isDelivered(o: Order): boolean {
  return o.orderStatus === OrderStatus.DELIVERED;
}

export function totalRevenueDelivered(orders: Order[]): number {
  return orders.filter(isDelivered).reduce((s, o) => s + (o.totalAmount ?? 0), 0);
}

export function revenueInMonth(
  orders: Order[],
  year: number,
  monthIndex: number,
): number {
  return orders.filter(isDelivered).reduce((sum, o) => {
    const d = parseOrderDate(o);
    if (!d || d.getFullYear() !== year || d.getMonth() !== monthIndex) return sum;
    return sum + (o.totalAmount ?? 0);
  }, 0);
}

export function countOrdersInMonth(
  orders: Order[],
  year: number,
  monthIndex: number,
): number {
  return orders.reduce((n, o) => {
    const d = parseOrderDate(o);
    if (!d || d.getFullYear() !== year || d.getMonth() !== monthIndex) return n;
    return n + 1;
  }, 0);
}

export function monthOverMonthPercent(
  current: number,
  previous: number,
): number | null {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function formatTrend(percent: number | null): TrendInfo {
  if (percent === null) {
    return {
      percent: null,
      label: "— so với tháng trước",
      direction: "unknown",
    };
  }
  const rounded = Math.round(percent * 10) / 10;
  const abs = Math.abs(rounded);
  const dir: TrendInfo["direction"] =
    rounded > 0.05 ? "up" : rounded < -0.05 ? "down" : "flat";
  const sign = rounded > 0 ? "+" : "";
  return {
    percent: rounded,
    label: `${sign}${abs}% so với tháng trước`,
    direction: dir,
  };
}

export function revenueByMonth(orders: Order[], year: number): number[] {
  const arr = Array.from({ length: 12 }, () => 0);
  for (const o of orders) {
    if (!isDelivered(o)) continue;
    const d = parseOrderDate(o);
    if (!d || d.getFullYear() !== year) continue;
    arr[d.getMonth()] += o.totalAmount ?? 0;
  }
  return arr;
}

export function totalStockUnits(products: Product[]): number {
  return products.reduce((sum, p) => {
    const details = p.productDetails ?? [];
    return (
      sum +
      details.reduce((s, d) => s + (Number(d.stockQuantity) || 0), 0)
    );
  }, 0);
}

export function unitsSoldInMonth(
  orders: Order[],
  year: number,
  monthIndex: number,
): number {
  let u = 0;
  for (const o of orders) {
    if (o.orderStatus === OrderStatus.CANCELLED) continue;
    const d = parseOrderDate(o);
    if (!d || d.getFullYear() !== year || d.getMonth() !== monthIndex) continue;
    const details = o.orderDetails ?? [];
    for (const line of details) {
      u += Number((line as { quantity?: number }).quantity) || 0;
    }
  }
  return u;
}

/** Ước tính % thay đổi tồn kho: so tồn hiện tại với (tồn + đã bán trong tháng này). */
export function stockTrendPercent(
  products: Product[],
  orders: Order[],
  now: Date = new Date(),
): number | null {
  const y = now.getFullYear();
  const m = now.getMonth();
  const current = totalStockUnits(products);
  const sold = unitsSoldInMonth(orders, y, m);
  const estStart = current + sold;
  if (estStart === 0) return current === 0 ? 0 : null;
  return ((current - estStart) / estStart) * 100;
}

export function countCustomersJoinedInMonth(
  customers: Customer[],
  year: number,
  monthIndex: number,
): number {
  return customers.filter((c) => {
    if (!c.joinDate) return false;
    const d = new Date(c.joinDate as string);
    if (Number.isNaN(d.getTime())) return false;
    return d.getFullYear() === year && d.getMonth() === monthIndex;
  }).length;
}

function categoryNameFromProduct(product: unknown): string {
  if (!product || typeof product !== "object") return "Khác";
  const p = product as {
    category?: { categoryName?: string } | string;
  };
  const c = p.category;
  if (c && typeof c === "object" && "categoryName" in c && c.categoryName) {
    return String(c.categoryName);
  }
  if (typeof c === "string" && c) return c;
  return "Khác";
}

/** Mỗi đơn gán vào danh mục có tổng tiền dòng lớn nhất (bỏ qua đơn đã hủy). */
export function ordersByCategory(orders: Order[]): CategorySlice[] {
  const map = new Map<string, number>();
  for (const o of orders) {
    if (o.orderStatus === OrderStatus.CANCELLED) continue;
    const details = (o.orderDetails ?? []) as Array<{
      product?: unknown;
      totalPrice?: number;
    }>;
    const subByCat = new Map<string, number>();
    for (const line of details) {
      const cat = categoryNameFromProduct(line?.product);
      const price = Number(line?.totalPrice) || 0;
      subByCat.set(cat, (subByCat.get(cat) ?? 0) + price);
    }
    let bestCat = "Khác";
    let best = -1;
    for (const [cat, val] of subByCat) {
      if (val > best) {
        best = val;
        bestCat = cat;
      }
    }
    if (details.length === 0) bestCat = "Khác";
    map.set(bestCat, (map.get(bestCat) ?? 0) + 1);
  }
  const total = [...map.values()].reduce((a, b) => a + b, 0) || 1;
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count], i) => ({
      name,
      count,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      percent: Math.round((count / total) * 1000) / 10,
    }));
}

export function recentOrdersSorted(orders: Order[], limit: number): Order[] {
  return [...orders]
    .sort((a, b) => {
      const da = parseOrderDate(a)?.getTime() ?? 0;
      const db = parseOrderDate(b)?.getTime() ?? 0;
      return db - da;
    })
    .slice(0, limit);
}

export function firstProductName(order: Order): string {
  const details = order.orderDetails ?? [];
  const first = details[0] as { product?: { productName?: string } } | undefined;
  const n = first?.product?.productName;
  return n?.trim() ? n : "—";
}

export function formatVndCompact(n: number): string {
  if (n >= 1_000_000_000) {
    return `${(n / 1_000_000_000).toLocaleString("vi-VN", {
      maximumFractionDigits: 1,
    })} tỷ VNĐ`;
  }
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toLocaleString("vi-VN", {
      maximumFractionDigits: 1,
    })} triệu VNĐ`;
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatVnd(n: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
}
