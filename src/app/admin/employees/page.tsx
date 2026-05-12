"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { staffService } from "@/services/staff.service";
import {
  Staff,
  DEPARTMENT_OPTIONS,
  WORK_STATUS_OPTIONS,
  departmentLabel,
  positionLabel,
  WorkStatus,
  workStatusLabel,
} from "@/types/staff";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";

const PAGE_SIZE = 10;

const filterSelectClass =
  "h-11 min-w-[168px] shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20";

export default function AdminEmployeesPage() {
  const [list, setList] = useState<Staff[]>([]);
  const [snapshot, setSnapshot] = useState<Staff[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [snapshotLoading, setSnapshotLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const rows = snapshot;
    const total = rows.length;
    let active = 0;
    let resigned = 0;
    const deptSet = new Set<string>();
    for (const s of rows) {
      if (s.workStatus === "Active") active++;
      if (s.workStatus === "Resigned") resigned++;
      if (s.department) deptSet.add(s.department);
    }
    return {
      total,
      active,
      resigned,
      departments: deptSet.size,
    };
  }, [snapshot]);

  const loadSnapshot = useCallback(async () => {
    try {
      setSnapshotLoading(true);
      const rows = await staffService.fetchStaffSnapshot();
      setSnapshot(rows);
    } catch (e) {
      console.error(e);
    } finally {
      setSnapshotLoading(false);
    }
  }, []);

  const loadTable = useCallback(async () => {
    try {
      setLoading(true);
      const res = await staffService.list({
        search: search.trim() || undefined,
        department,
        status,
        page,
        size: PAGE_SIZE,
      });
      setList(res.content ?? []);
      setTotalElements(res.totalElements ?? 0);
      setTotalPages(res.totalPages ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, department, status, page]);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  useEffect(() => {
    loadTable();
  }, [loadTable]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await staffService.exportCsv({
        search: search.trim() || undefined,
        department,
        status,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "staffs.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Không thể xuất CSV.");
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa nhân viên này?")) return;
    try {
      setDeletingId(id);
      await staffService.delete(id);
      await loadTable();
      await loadSnapshot();
    } catch (e) {
      console.error(e);
      alert("Không thể xóa nhân viên.");
    } finally {
      setDeletingId(null);
    }
  };

  const badgeClass = (ws?: WorkStatus | null) =>
    ws === "Active"
      ? "bg-sky-100 text-sky-800 border-0"
      : ws === "Resigned"
        ? "bg-slate-200 text-slate-700 border-0"
        : "bg-gray-100 text-gray-700 border-0";

  const fromIdx = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
  const toIdx =
    totalElements === 0 ? 0 : Math.min((page + 1) * PAGE_SIZE, totalElements);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Quản lý nhân viên
        </h1>
        <p className="text-muted-foreground mt-2">
          Quản lý thông tin và quyền hạn nhân viên
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">
                Tổng nhân viên
              </p>
              <p className="text-3xl font-bold tabular-nums text-slate-900">
                {snapshotLoading ? "—" : stats.total}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">
                Đang làm việc
              </p>
              <p className="text-3xl font-bold tabular-nums text-slate-900">
                {snapshotLoading ? "—" : stats.active}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <UserMinus className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">
                Không làm việc
              </p>
              <p className="text-3xl font-bold tabular-nums text-slate-900">
                {snapshotLoading ? "—" : stats.resigned}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Phòng ban</p>
              <p className="text-3xl font-bold tabular-nums text-slate-900">
                {snapshotLoading ? "—" : stats.departments}
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
                placeholder="Tìm kiếm theo tên hoặc mã NV..."
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
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setPage(0);
                }}
                className={filterSelectClass}
                aria-label="Lọc phòng ban"
              >
                <option value="all">Tất cả phòng ban</option>
                {DEPARTMENT_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(0);
                }}
                className={filterSelectClass}
                aria-label="Lọc trạng thái"
              >
                <option value="all">Tất cả trạng thái</option>
                {WORK_STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
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
              <Button
                asChild
                variant="outline"
                className="h-11 shrink-0 rounded-lg border-orange-500 px-4 text-orange-500 bg-white hover:bg-orange-50"
              >
                <Link href="/admin/employees/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm nhân viên
                </Link>
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
                  <th className="px-4 py-3 font-medium w-10">
                    <span className="sr-only">Chọn</span>
                  </th>
                  <th className="px-4 py-3 font-medium">Nhân viên</th>
                  <th className="px-4 py-3 font-medium">Mã NV</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phòng</th>
                  <th className="px-4 py-3 font-medium">Chức vụ</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : list.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-slate-500"
                    >
                      Không có nhân viên phù hợp.
                    </td>
                  </tr>
                ) : (
                  list.map((s) => (
                    <tr
                      key={s.staffId}
                      className="border-b border-slate-100 hover:bg-slate-50/80"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300"
                          aria-label={`Chọn ${s.staffId}`}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900">
                          {s.fullName || "—"}
                        </div>
                        <div className="text-xs text-slate-500 truncate max-w-[220px]">
                          {s.email || ""}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs">
                        {s.staffId}
                      </td>
                      <td className="px-4 py-4 text-slate-600 max-w-[180px] truncate">
                        {s.email || "—"}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {departmentLabel(s.department)}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {positionLabel(s.position)}
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          className={`rounded-full font-normal ${badgeClass(s.workStatus)}`}
                        >
                          {s.workStatus === "Active"
                            ? "Đang làm"
                            : workStatusLabel(s.workStatus)}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          asChild
                        >
                          <Link href={`/admin/employees/${encodeURIComponent(s.staffId)}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          asChild
                        >
                          <Link
                            href={`/admin/employees/${encodeURIComponent(s.staffId)}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={deletingId === s.staffId}
                          onClick={() => handleDelete(s.staffId)}
                        >
                          {deletingId === s.staffId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t bg-slate-50/50 text-sm text-slate-600">
            <span>
              Hiển thị {fromIdx}-{toIdx} trong tổng số {totalElements} nhân
              viên
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
              <span className="px-2 min-w-[2rem] text-center tabular-nums font-medium text-orange-600">
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
