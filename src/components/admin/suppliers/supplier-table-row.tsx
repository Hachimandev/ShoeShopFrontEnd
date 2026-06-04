import Link from "next/link";
import { Building2, Eye, Factory, Package, Pencil, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Supplier } from "@/types/supplier";
import { Badge } from "@/components/ui/badge";
import { SupplierStatusBadge } from "./supplier-status-badge";
import { deriveUiStatus, supplierIconVariant } from "./supplier-utils";

const iconWrap = [
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-800",
  "bg-emerald-100 text-emerald-800",
];

const icons = [Building2, Factory, Truck, Package];

interface SupplierTableRowProps {
  supplier: Supplier;
  productCount: number;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export function SupplierTableRow({
  supplier,
  productCount,
  selected,
  onToggleSelect,
  onDelete,
  deletingId,
}: SupplierTableRowProps) {
  const status = deriveUiStatus(productCount);
  const vi = supplierIconVariant(supplier.supplierId);
  const Icon = icons[vi];

  return (
    <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50/80">
      <td className="px-4 py-4 align-top">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(supplier.supplierId)}
          className="rounded border-slate-300"
          aria-label={`Chọn ${supplier.supplierName}`}
        />
      </td>
      <td className="px-4 py-4 align-top">
        <div className="flex gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconWrap[vi]}`}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-900">
              {supplier.supplierName || "—"}
            </div>
            <div className="text-xs text-slate-500">
              Mã: {supplier.supplierId}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 align-top text-sm text-slate-700">
        <div className="space-y-1">
          <div>{supplier.phoneNumber?.trim() || "—"}</div>
          <div className="truncate max-w-[220px] text-slate-600">
            {supplier.email?.trim() || "—"}
          </div>
        </div>
      </td>
      <td className="px-4 py-4 align-top text-sm text-slate-700 max-w-[260px]">
        <span className="line-clamp-3">{supplier.address?.trim() || "—"}</span>
      </td>
      <td className="px-4 py-4 align-top">
        <Badge className="rounded-full border-0 bg-sky-100 font-normal text-sky-800 hover:bg-sky-100">
          {productCount} sản phẩm
        </Badge>
      </td>
      <td className="px-4 py-4 align-top">
        <SupplierStatusBadge status={status} />
      </td>
      <td className="px-4 py-4 align-top whitespace-nowrap text-sm text-slate-500">
        —
      </td>
      <td className="px-4 py-4 align-top text-right whitespace-nowrap">
        <Button variant="ghost" size="icon" className="text-blue-600" asChild>
          <Link
            href={`/admin/suppliers/${encodeURIComponent(supplier.supplierId)}/edit`}
            aria-label="Xem / Sửa"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" className="text-emerald-600" asChild>
          <Link
            href={`/admin/suppliers/${encodeURIComponent(supplier.supplierId)}/edit`}
            aria-label="Chỉnh sửa"
          >
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
      </td>
    </tr>
  );
}
