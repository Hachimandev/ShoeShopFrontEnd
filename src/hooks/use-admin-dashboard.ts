"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { dashboardService } from "@/services/dashboard.service";
import type { DashboardRawData, KpiCardData } from "@/types/dashboard";
import type { CategorySlice } from "@/types/dashboard";
import {
  countCustomersJoinedInMonth,
  countOrdersInMonth,
  formatTrend,
  formatVnd,
  formatVndCompact,
  monthOverMonthPercent,
  ordersByCategory,
  parseOrderDate,
  recentOrdersSorted,
  revenueByMonth,
  revenueInMonth,
  stockTrendPercent,
  totalRevenueDelivered,
  totalStockUnits,
} from "@/lib/dashboard-stats";
import type { Order } from "@/types/order";

const RECENT_LIMIT = 7;

function buildKpis(
  data: DashboardRawData,
  now: Date,
): { kpis: KpiCardData[]; recent: Order[] } {
  const y = now.getFullYear();
  const m = now.getMonth();
  const prevM = m === 0 ? 11 : m - 1;
  const prevY = m === 0 ? y - 1 : y;

  const revTotal = totalRevenueDelivered(data.orders);
  const revThis = revenueInMonth(data.orders, y, m);
  const revPrev = revenueInMonth(data.orders, prevY, prevM);
  const revMom = formatTrend(monthOverMonthPercent(revThis, revPrev));

  const ordTotal = data.orders.length;
  const ordThis = countOrdersInMonth(data.orders, y, m);
  const ordPrev = countOrdersInMonth(data.orders, prevY, prevM);
  const ordMom = formatTrend(monthOverMonthPercent(ordThis, ordPrev));

  const stock = totalStockUnits(data.products);
  const stockMom = formatTrend(stockTrendPercent(data.products, data.orders, now));

  const custTotal = data.customerTotal;
  const newThis = countCustomersJoinedInMonth(data.customers, y, m);
  const newPrev = countCustomersJoinedInMonth(data.customers, prevY, prevM);
  const custMom = formatTrend(monthOverMonthPercent(newThis, newPrev));

  const kpis: KpiCardData[] = [
    {
      title: "Tổng doanh thu",
      value: formatVndCompact(revTotal),
      trend: revMom,
      icon: "revenue",
    },
    {
      title: "Tổng đơn hàng",
      value: ordTotal.toLocaleString("vi-VN"),
      trend: ordMom,
      icon: "orders",
    },
    {
      title: "Sản phẩm tồn kho",
      value: stock.toLocaleString("vi-VN"),
      trend: stockMom,
      icon: "stock",
    },
    {
      title: "Tổng khách hàng",
      value: custTotal.toLocaleString("vi-VN"),
      trend: custMom,
      icon: "customers",
    },
  ];

  const recent = recentOrdersSorted(data.orders, RECENT_LIMIT);

  return { kpis, recent };
}

export function useAdminDashboard() {
  const [chartYear, setChartYear] = useState(() => new Date().getFullYear());
  const [raw, setRaw] = useState<DashboardRawData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await dashboardService.fetchDashboardData();
      setRaw(d);
    } catch (e) {
      console.error(e);
      setError("Không tải được dữ liệu thống kê.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const metrics = useMemo(() => {
    if (!raw) return null;
    return buildKpis(raw, new Date());
  }, [raw]);

  const revenueSeriesForYear = useMemo(() => {
    if (!raw) return Array.from({ length: 12 }, () => 0);
    return revenueByMonth(raw.orders, chartYear);
  }, [raw, chartYear]);

  const categorySlices = useMemo((): CategorySlice[] => {
    if (!raw) return [];
    const filtered = raw.orders.filter((o) => {
      const d = parseOrderDate(o);
      return d && d.getFullYear() === chartYear;
    });
    return ordersByCategory(filtered);
  }, [raw, chartYear]);

  const yearOptions = useMemo(() => {
    const cy = new Date().getFullYear();
    const years = new Set<number>([cy, chartYear]);
    if (raw) {
      for (const o of raw.orders) {
        const d = o.orderDate ? new Date(o.orderDate as string) : null;
        if (d && !Number.isNaN(d.getTime())) years.add(d.getFullYear());
      }
    }
    return [...years].sort((a, b) => b - a);
  }, [raw, chartYear]);

  return {
    loading,
    error,
    reload: load,
    chartYear,
    setChartYear,
    yearOptions,
    kpis: metrics?.kpis ?? [],
    categorySlices,
    recentOrders: metrics?.recent ?? [],
    revenueSeriesForYear,
    formatVnd,
  };
}
