"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { staffService } from "@/services/staff.service";
import { Staff } from "@/types/staff";
import { EmployeeForm } from "@/components/admin/employee-form";
import { Button } from "@/components/ui/button";

export default function EditEmployeePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [staff, setStaff] = useState<Staff | null>(null);
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
        const data = await staffService.getById(id);
        if (!cancelled) setStaff(data);
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
      <div className="flex justify-center items-center min-h-[240px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !staff) {
    return (
      <div className="space-y-4 text-center py-16">
        <p className="text-slate-600">Không tìm thấy nhân viên.</p>
        <Button asChild variant="outline">
          <Link href="/admin/employees">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return <EmployeeForm mode="edit" initialStaff={staff} />;
}
