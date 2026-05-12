"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supplierService } from "@/services/supplier.service";
import type { Supplier } from "@/types/supplier";
import { SupplierForm } from "@/components/admin/suppliers/supplier-form";
import { Button } from "@/components/ui/button";

export default function EditSupplierPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await supplierService.getSupplierById(id);
        if (!cancelled) setSupplier(data);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (notFound || !supplier) {
    return (
      <div className="space-y-4 py-16 text-center">
        <p className="text-slate-600">Không tìm thấy nhà cung cấp.</p>
        <Button asChild variant="outline">
          <Link href="/admin/suppliers">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return <SupplierForm mode="edit" initial={supplier} />;
}
