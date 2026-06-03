import { Button } from "@/components/ui/button";

interface SupplierBulkToolbarProps {
  selectedCount: number;
  deleting: boolean;
  onBulkDelete: () => void;
}

export function SupplierBulkToolbar({
  selectedCount,
  deleting,
  onBulkDelete,
}: SupplierBulkToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-slate-800">
        <span className="tabular-nums">{selectedCount}</span> đã chọn
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-slate-200 bg-white text-slate-400"
          disabled
          title="Backend hiện chưa có trường trạng thái — chỉ hiển thị UI"
        >
          Tạm dừng
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-slate-200 bg-white text-slate-400"
          disabled
          title="Backend hiện chưa có trường trạng thái — chỉ hiển thị UI"
        >
          Kích hoạt
        </Button>
      </div>
    </div>
  );
}
