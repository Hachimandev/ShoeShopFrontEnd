import type { Supplier } from "@/types/supplier";
import { SupplierTableRow } from "./supplier-table-row";

interface SupplierTableProps {
  suppliers: Supplier[];
  productCounts: Record<string, number>;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAllOnPage: (ids: string[], checked: boolean) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
  loading?: boolean;
}

export function SupplierTable({
  suppliers,
  productCounts,
  selectedIds,
  onToggleSelect,
  onToggleSelectAllOnPage,
  onDelete,
  deletingId,
  loading,
}: SupplierTableProps) {
  const pageIds = suppliers.map((s) => s.supplierId);
  const allSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        Đang tải...
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="flex justify-center py-16 text-slate-500">
        Không có nhà cung cấp phù hợp.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] text-left text-sm">
        <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) =>
                  onToggleSelectAllOnPage(pageIds, e.target.checked)
                }
                className="rounded border-slate-300"
                aria-label="Chọn tất cả trên trang"
              />
            </th>
            <th className="px-4 py-3 font-medium">Nhà cung cấp</th>
            <th className="px-4 py-3 font-medium">Liên hệ</th>
            <th className="px-4 py-3 font-medium">Địa chỉ</th>
            <th className="px-4 py-3 font-medium">Sản phẩm</th>
            <th className="px-4 py-3 font-medium">Trạng thái</th>
            <th className="px-4 py-3 font-medium">Ngày tạo</th>
            <th className="px-4 py-3 font-medium text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <SupplierTableRow
              key={s.supplierId}
              supplier={s}
              productCount={productCounts[s.supplierId] ?? 0}
              selected={selectedIds.has(s.supplierId)}
              onToggleSelect={onToggleSelect}
              onDelete={onDelete}
              deletingId={deletingId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
