import { Badge } from "@/components/ui/badge";
import type { SupplierUiStatus } from "@/types/supplier";

interface SupplierStatusBadgeProps {
  status: SupplierUiStatus;
}

export function SupplierStatusBadge({ status }: SupplierStatusBadgeProps) {
  if (status === "active") {
    return (
      <Badge className="rounded-full border-0 bg-emerald-100 font-normal text-emerald-800 hover:bg-emerald-100">
        Hoạt động
      </Badge>
    );
  }
  return (
    <Badge className="rounded-full border-0 bg-amber-100 font-normal text-amber-900 hover:bg-amber-100">
      Tạm dừng
    </Badge>
  );
}
