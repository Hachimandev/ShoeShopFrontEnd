"use client";

import { useCallback, useEffect, useState } from "react";
import { customerService } from "@/services/customer.service";
import { Customer } from "@/types/customer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Loader2,
  Search,
  Upload,
  UserPlus,
  Users,
  X,
} from "lucide-react";

const PAGE_SIZE = 10;

const filterSelectClass =
  "h-11 min-w-[200px] shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20";

type SpendPreset =
  | "all"
  | "lt1m"
  | "1_10"
  | "10_20"
  | "20_50"
  | "50_100"
  | "gt100";

const SPEND_OPTIONS: { id: SpendPreset; label: string }[] = [
  { id: "all", label: "— Tất cả tổng chi tiêu —" },
  { id: "lt1m", label: "Dưới 1 triệu" },
  { id: "1_10", label: "1 - 10 triệu" },
  { id: "10_20", label: "10 - 20 triệu" },
  { id: "20_50", label: "20 - 50 triệu" },
  { id: "50_100", label: "50 - 100 triệu" },
  { id: "gt100", label: "Trên 100 triệu" },
];

function spendPresetToParams(preset: SpendPreset): {
  minSpend?: number;
  maxSpend?: number;
} {
  switch (preset) {
    case "all":
      return {};
    case "lt1m":
      return { maxSpend: 1_000_000 };
    case "1_10":
      return { minSpend: 1_000_000, maxSpend: 10_000_000 };
    case "10_20":
      return { minSpend: 10_000_000, maxSpend: 20_000_000 };
    case "20_50":
      return { minSpend: 20_000_000, maxSpend: 50_000_000 };
    case "50_100":
      return { minSpend: 50_000_000, maxSpend: 100_000_000 };
    case "gt100":
      return { minSpend: 100_000_000 };
    default:
      return {};
  }
}

function formatVnd(n: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
}

function parseJoinDate(raw: unknown): Date | null {
  if (raw == null) return null;
  if (typeof raw === "string") return new Date(raw);
  if (Array.isArray(raw) && raw.length >= 3) {
    const [y, m, d, h = 0, min = 0, sec = 0] = raw as number[];
    return new Date(y, m - 1, d, h, min, sec);
  }
  return null;
}

export default function AdminCustomersPage() {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [newThisMonth, setNewThisMonth] = useState<number>(0);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [spendPreset, setSpendPreset] = useState<SpendPreset>("all");
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const [t, n] = await Promise.all([
        customerService.getTotalCustomerCount(),
        customerService.getNewCustomersThisMonth(),
      ]);
      setTotalCount(Number(t));
      setNewThisMonth(Number(n));
    } catch (e) {
      console.error(e);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadTable = useCallback(async () => {
    try {
      setLoading(true);
      const { minSpend, maxSpend } = spendPresetToParams(spendPreset);
      const res = await customerService.searchCustomers({
        search: search.trim() || undefined,
        minSpend,
        maxSpend,
        page,
        size: PAGE_SIZE,
      });
      setCustomers(res.content ?? []);
      setTotalElements(res.totalElements ?? 0);
      setTotalPages(res.totalPages ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, spendPreset, page]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadTable();
  }, [loadTable]);

  const handleClearFilters = () => {
    setSearch("");
    setSpendPreset("all");
    setPage(0);
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await customerService.exportCustomersToExcel();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "customers.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Không thể xuất Excel.");
    } finally {
      setExporting(false);
    }
  };

  const fromIdx = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
  const toIdx =
    totalElements === 0 ? 0 : Math.min((page + 1) * PAGE_SIZE, totalElements);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Quản lý khách hàng
        </h1>
        <p className="text-muted-foreground mt-2">
          Quản lý thông tin và theo dõi hoạt động của khách hàng
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">
                Tổng khách hàng
              </p>
              <p className="text-3xl font-bold tabular-nums text-slate-900">
                {statsLoading ? "—" : totalCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">
                Mới tháng này
              </p>
              <p className="text-3xl font-bold tabular-nums text-slate-900">
                {statsLoading ? "—" : newThisMonth}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border border-slate-200/90 bg-white shadow-sm">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="relative min-w-0 flex-1 basis-0">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="h-11 rounded-lg border-slate-200 bg-white pl-10 shadow-sm placeholder:text-slate-400"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:shrink-0 lg:justify-end">
              <select
                value={spendPreset}
                onChange={(e) => {
                  setSpendPreset(e.target.value as SpendPreset);
                  setPage(0);
                }}
                className={filterSelectClass}
                aria-label="Lọc theo tổng chi tiêu"
              >
                {SPEND_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
                className="h-11 shrink-0 rounded-lg border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              >
                <X className="mr-2 h-4 w-4" />
                Xóa bộ lọc
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 shrink-0 rounded-lg border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                onClick={handleExport}
                disabled={exporting}
              >
                {exporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Xuất Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-600 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Tên khách hàng</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Số điện thoại</th>
                  <th className="px-4 py-3 font-medium">Tổng chi tiêu</th>
                  <th className="px-4 py-3 font-medium">Ngày tham gia</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-slate-500"
                    >
                      Không có khách hàng phù hợp.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => {
                    const jd = parseJoinDate(c.joinDate as unknown);
                    const initial =
                      (c.fullName || "?").trim().charAt(0).toUpperCase() ||
                      "?";
                    return (
                      <tr
                        key={c.customerId}
                        className="border-b border-slate-100 hover:bg-slate-50/80"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-slate-200 text-slate-700 text-xs font-medium">
                                {initial}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-slate-900">
                              {c.fullName || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-600 max-w-[200px] truncate">
                          {c.email || "—"}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {c.phoneNumber?.trim() ? c.phoneNumber : "—"}
                        </td>
                        <td className="px-4 py-4 font-semibold text-red-600 tabular-nums">
                          {formatVnd(c.totalSpending ?? 0)}
                        </td>
                        <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                          {jd
                            ? jd.toLocaleDateString("vi-VN")
                            : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t bg-slate-50/50 text-sm text-slate-600">
            <span>
              Hiển thị {fromIdx}-{toIdx} trong tổng số {totalElements} khách
              hàng
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 0 || loading}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Trước
              </Button>
              <span className="px-2 tabular-nums font-medium text-slate-900">
                {totalPages > 0 ? page + 1 : 0}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={
                  loading || totalPages === 0 || page >= totalPages - 1
                }
                onClick={() =>
                  setPage((p) =>
                    totalPages ? Math.min(totalPages - 1, p + 1) : p,
                  )
                }
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
