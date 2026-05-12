import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SupplierPageHeaderProps {
  totalCount: number;
}

export function SupplierPageHeader({ totalCount }: SupplierPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Danh sách nhà cung cấp
          </h1>
          <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-0.5 text-sm font-medium text-sky-800">
            {totalCount} nhà cung cấp
          </span>
        </div>
        <p className="text-sm text-slate-600">
          Quản lý nhà cung cấp và thông tin liên hệ
        </p>
      </div>
      <Button
        asChild
        className="h-10 shrink-0 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        <Link href="/admin/suppliers/new">
          <Plus className="mr-2 h-4 w-4" />
          Thêm nhà cung cấp
        </Link>
      </Button>
    </div>
  );
}
