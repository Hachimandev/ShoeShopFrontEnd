import type { SupplierUiStatus } from "@/types/supplier";

export function extractRegion(address?: string): string {
  if (!address?.trim()) return "Không xác định";
  const parts = address.split(",").map((s) => s.trim()).filter(Boolean);
  return parts[parts.length - 1] || "Không xác định";
}

export function deriveUiStatus(productCount: number): SupplierUiStatus {
  return productCount > 0 ? "active" : "paused";
}

/** Stable pseudo-random icon variant from id */
export function supplierIconVariant(id: string): 0 | 1 | 2 | 3 {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 1)) % 997;
  return (h % 4) as 0 | 1 | 2 | 3;
}
