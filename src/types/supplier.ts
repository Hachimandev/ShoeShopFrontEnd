/** Aligns with ShoeShopBackEnd model Supplier */

export interface Supplier {
  supplierId: string;
  supplierName: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
}

/** Derived UI status when backend has no status field */
export type SupplierUiStatus = "active" | "paused";
