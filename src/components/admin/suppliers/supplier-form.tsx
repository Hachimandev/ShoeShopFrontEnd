"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supplierService } from "@/services/supplier.service";
import type { Supplier } from "@/types/supplier";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SupplierFormProps {
  mode: "create" | "edit";
  initial?: Supplier | null;
}

export function SupplierForm({ mode, initial }: SupplierFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [supplierName, setSupplierName] = useState(initial?.supplierName ?? "");
  const [phoneNumber, setPhoneNumber] = useState(initial?.phoneNumber ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");

  const title =
    mode === "create" ? "Thêm nhà cung cấp" : "Cập nhật nhà cung cấp";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!supplierName.trim()) {
      setError("Tên nhà cung cấp không được để trống.");
      return;
    }
    const payload: Supplier = {
      supplierId: initial?.supplierId ?? "",
      supplierName: supplierName.trim(),
      phoneNumber: phoneNumber.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
    };
    try {
      setSubmitting(true);
      if (mode === "create") {
        await supplierService.createSupplier(payload);
      } else {
        await supplierService.updateSupplier(initial!.supplierId, payload);
      }
      router.push("/admin/suppliers");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Không lưu được. Thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/admin/suppliers" aria-label="Quay lại">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
      </div>

      <Card className="max-w-3xl rounded-xl border border-slate-200/90 shadow-sm">
        <CardContent className="p-6 md:p-8">
          {error && (
            <div
              className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              role="alert"
            >
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "edit" && initial && (
              <div className="space-y-2">
                <Label>Mã nhà cung cấp</Label>
                <Input
                  value={initial.supplierId}
                  disabled
                  className="font-mono bg-slate-50"
                />
              </div>
            )}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="supplierName">Tên nhà cung cấp *</Label>
                <Input
                  id="supplierName"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Công ty TNHH ..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="090..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, phường, quận, thành phố"
                />
                <p className="text-xs text-muted-foreground">
                  Phần cuối địa chỉ (sau dấu phẩy) được dùng làm &quot;khu
                  vực&quot; cho bộ lọc.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t pt-6">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/suppliers">Hủy</Link>
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="min-w-[120px] rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : mode === "create" ? (
                  "Tạo mới"
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
