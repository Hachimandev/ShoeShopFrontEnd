"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { staffService } from "@/services/staff.service";
import {
  Staff,
  Department,
  Position,
  StaffGender,
  WorkStatus,
  DEPARTMENT_OPTIONS,
  GENDER_OPTIONS,
  POSITION_OPTIONS,
  WORK_STATUS_OPTIONS,
} from "@/types/staff";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function birthDateToInputValue(raw: unknown): string {
  if (raw == null) return "";
  const d =
    typeof raw === "number"
      ? new Date(raw)
      : typeof raw === "string"
        ? new Date(raw)
        : null;
  if (!d || Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function inputDateToIso(dateStr: string): string | undefined {
  const t = dateStr.trim();
  if (!t) return undefined;
  const d = new Date(`${t}T12:00:00`);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

function computeAgeYears(birthIso: string): number {
  const birth = new Date(birthIso);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

interface EmployeeFormProps {
  mode: "create" | "edit";
  initialStaff?: Staff | null;
}

export function EmployeeForm({ mode, initialStaff }: EmployeeFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [staffId, setStaffId] = useState(initialStaff?.staffId ?? "");
  const [fullName, setFullName] = useState(initialStaff?.fullName ?? "");
  const [email, setEmail] = useState(initialStaff?.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(
    initialStaff?.phoneNumber ?? "",
  );
  const [citizenId, setCitizenId] = useState(initialStaff?.citizenId ?? "");
  const [birthInput, setBirthInput] = useState(
    birthDateToInputValue(initialStaff?.birthDate),
  );
  const [gender, setGender] = useState<StaffGender>(
    initialStaff?.gender ?? "Male",
  );
  const [position, setPosition] = useState<Position>(
    initialStaff?.position ?? "Staff",
  );
  const [department, setDepartment] = useState<Department>(
    initialStaff?.department ?? "Sales",
  );
  const [workStatus, setWorkStatus] = useState<WorkStatus>(
    initialStaff?.workStatus ?? "Active",
  );
  const [img, setImg] = useState(initialStaff?.img ?? "");

  const validate = (): string | null => {
    if (mode === "create") {
      if (!/^NV\d{3}$/.test(staffId.trim())) {
        return "Mã NV phải có dạng NVxxx (ví dụ NV001).";
      }
    }
    if (!fullName.trim()) return "Họ tên không được để trống.";
    if (!email.trim()) return "Email không được để trống.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Email không hợp lệ.";
    }
    if (phoneNumber.trim()) {
      if (!/^0\d{9}$/.test(phoneNumber.trim())) {
        return "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0.";
      }
    }
    if (citizenId.trim()) {
      if (!/^0\d{11}$/.test(citizenId.trim())) {
        return "CCCD phải có 12 chữ số và bắt đầu bằng 0.";
      }
    }
    const birthIso = birthInput.trim() ? inputDateToIso(birthInput) : undefined;
    if (birthIso) {
      if (computeAgeYears(birthIso) < 15) {
        return "Tuổi phải từ 15 trở lên.";
      }
    }
    return null;
  };

  const buildPayload = (): Staff => {
    const birthIso = birthInput.trim() ? inputDateToIso(birthInput) : undefined;
    return {
      staffId: staffId.trim(),
      fullName: fullName.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim() || undefined,
      citizenId: citizenId.trim() || undefined,
      birthDate: birthIso,
      gender,
      position,
      department,
      workStatus,
      img: img.trim() || undefined,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    const payload = buildPayload();
    try {
      setSubmitting(true);
      if (mode === "create") {
        await staffService.create(payload);
      } else {
        await staffService.update(initialStaff!.staffId, payload);
      }
      router.push("/admin/employees");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        typeof (err.response as { data?: { message?: string } }).data
          ?.message === "string"
        ? (err.response as { data: { message: string } }).data.message
        : "Không lưu được. Kiểm tra dữ liệu và thử lại.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const title =
    mode === "create" ? "Thêm nhân viên" : "Cập nhật nhân viên";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/admin/employees" aria-label="Quay lại">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
      </div>

      <Card className="border-0 shadow-sm max-w-5xl">
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
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="staffId">Mã NV</Label>
                <Input
                  id="staffId"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  disabled={mode === "edit"}
                  placeholder="NV001"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ tên</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0901234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cccd">CCCD</Label>
                <Input
                  id="cccd"
                  value={citizenId}
                  onChange={(e) => setCitizenId(e.target.value)}
                  placeholder="012345678901"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth">Ngày sinh</Label>
                <Input
                  id="birth"
                  type="date"
                  value={birthInput}
                  onChange={(e) => setBirthInput(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Giới tính</Label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value as StaffGender)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Chức vụ</Label>
                <select
                  id="position"
                  value={position}
                  onChange={(e) =>
                    setPosition(e.target.value as Position)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {POSITION_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Phòng ban</Label>
                <select
                  id="department"
                  value={department}
                  onChange={(e) =>
                    setDepartment(e.target.value as Department)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {DEPARTMENT_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workStatus">Trạng thái làm việc</Label>
                <select
                  id="workStatus"
                  value={workStatus}
                  onChange={(e) =>
                    setWorkStatus(e.target.value as WorkStatus)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {WORK_STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="img">Ảnh đại diện (URL)</Label>
                <Input
                  id="img"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground">
                  Dán URL ảnh hoặc để trống. Upload file có thể bổ sung sau khi có API.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/employees">Hủy</Link>
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-orange-500 hover:bg-orange-600 text-white min-w-[120px]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
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
