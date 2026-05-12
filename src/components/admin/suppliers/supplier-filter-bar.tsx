import { Filter, Loader2, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const filterSelectClass =
  "h-11 min-w-[160px] shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20";

interface SupplierFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | "active" | "paused";
  onStatusFilterChange: (value: "all" | "active" | "paused") => void;
  regionFilter: string;
  onRegionFilterChange: (value: string) => void;
  regions: string[];
  onExport: () => void;
  exporting: boolean;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  minProducts: number | "";
  onMinProductsChange: (value: number | "") => void;
}

export function SupplierFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  regionFilter,
  onRegionFilterChange,
  regions,
  onExport,
  exporting,
  showAdvanced,
  onToggleAdvanced,
  minProducts,
  onMinProductsChange,
}: SupplierFilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="relative min-w-0 flex-1 basis-0">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <Input
              placeholder="Tìm kiếm nhà cung cấp..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-11 rounded-lg border-slate-200 bg-white pl-10 shadow-sm placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:shrink-0 lg:justify-end">
            <select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(e.target.value as "all" | "active" | "paused")
              }
              className={filterSelectClass}
              aria-label="Lọc trạng thái"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="paused">Tạm dừng</option>
            </select>
            <select
              value={regionFilter}
              onChange={(e) => onRegionFilterChange(e.target.value)}
              className={filterSelectClass}
              aria-label="Lọc khu vực"
            >
              <option value="all">Tất cả khu vực</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="outline"
              className="h-11 shrink-0 rounded-lg border-emerald-600 text-emerald-700 hover:bg-emerald-50"
              onClick={onExport}
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
              type="button"
              variant="outline"
              className={[
                "h-11 shrink-0 rounded-lg border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                showAdvanced ? "border-blue-400 bg-blue-50/80 text-blue-900" : "",
              ].join(" ")}
              onClick={onToggleAdvanced}
            >
              <Filter className="mr-2 h-4 w-4" />
              Bộ lọc
            </Button>
          </div>
        </div>
      </div>

      {showAdvanced && (
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-4 shadow-sm">
          <p className="mb-3 text-sm font-medium text-slate-700">
            Bộ lọc nâng cao
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="min-products"
                className="text-xs font-medium text-slate-600"
              >
                Tối thiểu số sản phẩm
              </label>
              <Input
                id="min-products"
                type="number"
                min={0}
                placeholder="0"
                value={minProducts === "" ? "" : minProducts}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "") onMinProductsChange("");
                  else {
                    const n = parseInt(v, 10);
                    if (!Number.isNaN(n)) onMinProductsChange(Math.max(0, n));
                  }
                }}
                className="h-10 w-40 rounded-lg border-slate-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
