"use client";

import { Loader2 } from "lucide-react";
import { DashboardStatCards } from "@/components/admin/dashboard/dashboard-stat-cards";
import { DashboardRevenueChart } from "@/components/admin/dashboard/dashboard-revenue-chart";
import { DashboardCategoryChart } from "@/components/admin/dashboard/dashboard-category-chart";
import { DashboardRecentOrders } from "@/components/admin/dashboard/dashboard-recent-orders";
import { useAdminDashboard } from "@/hooks/use-admin-dashboard";

export default function AdminDashboardPage() {
  const {
    loading,
    error,
    reload,
    chartYear,
    setChartYear,
    yearOptions,
    kpis,
    categorySlices,
    recentOrders,
    revenueSeriesForYear,
    formatVnd,
  } = useAdminDashboard();

  if (loading) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-slate-600">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm">Đang tải thống kê...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-red-800">{error}</p>
        <button
          type="button"
          onClick={() => reload()}
          className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm text-white hover:bg-red-800"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          Thống kê tổng quan
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Doanh thu, đơn hàng, tồn kho và khách hàng — dữ liệu từ hệ thống
        </p>
      </div>

      <DashboardStatCards items={kpis} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <DashboardRevenueChart
            year={chartYear}
            yearOptions={yearOptions}
            onYearChange={setChartYear}
            monthlyRevenue={revenueSeriesForYear}
          />
        </div>
        <div className="lg:col-span-2">
          <DashboardCategoryChart year={chartYear} slices={categorySlices} />
        </div>
      </div>

      <DashboardRecentOrders orders={recentOrders} formatCurrency={formatVnd} />
    </div>
  );
}
