"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supplierService } from "@/services/supplier.service";
import { productService } from "@/services/product.service";
import type { Supplier } from "@/types/supplier";
import type { Product } from "@/types/product";
import { SupplierPageHeader } from "@/components/admin/suppliers/supplier-page-header";
import { SupplierFilterBar } from "@/components/admin/suppliers/supplier-filter-bar";
import { SupplierBulkToolbar } from "@/components/admin/suppliers/supplier-bulk-toolbar";
import { SupplierTable } from "@/components/admin/suppliers/supplier-table";
import { SupplierPagination } from "@/components/admin/suppliers/supplier-pagination";
import {
  deriveUiStatus,
  extractRegion,
} from "@/components/admin/suppliers/supplier-utils";

const PAGE_SIZE = 5;

function buildProductCounts(products: Product[]): Record<string, number> {
  const m: Record<string, number> = {};
  for (const p of products) {
    const sid =
      p.supplier &&
      typeof p.supplier === "object" &&
      "supplierId" in p.supplier
        ? (p.supplier as { supplierId?: string }).supplierId
        : undefined;
    if (!sid) continue;
    m[sid] = (m[sid] ?? 0) + 1;
  }
  return m;
}

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused">(
    "all",
  );
  const [regionFilter, setRegionFilter] = useState("all");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minProducts, setMinProducts] = useState<number | "">("");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [sups, prods] = await Promise.all([
        supplierService.getAllSuppliers(),
        productService.getAllProducts(),
      ]);
      setSuppliers(sups);
      setProducts(prods);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const productCounts = useMemo(
    () => buildProductCounts(products),
    [products],
  );

  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const s of suppliers) {
      set.add(extractRegion(s.address));
    }
    return [...set].sort((a, b) => a.localeCompare(b, "vi"));
  }, [suppliers]);

  const filteredSuppliers = useMemo(() => {
    const q = search.trim().toLowerCase();
    const minP = minProducts === "" ? 0 : minProducts;

    return suppliers.filter((s) => {
      if (q) {
        const ok =
          (s.supplierName?.toLowerCase().includes(q) ?? false) ||
          (s.supplierId?.toLowerCase().includes(q) ?? false);
        if (!ok) return false;
      }

      const count = productCounts[s.supplierId] ?? 0;
      const st = deriveUiStatus(count);
      if (statusFilter === "active" && st !== "active") return false;
      if (statusFilter === "paused" && st !== "paused") return false;

      if (regionFilter !== "all") {
        if (extractRegion(s.address) !== regionFilter) return false;
      }

      if (count < minP) return false;

      return true;
    });
  }, [
    suppliers,
    search,
    statusFilter,
    regionFilter,
    minProducts,
    productCounts,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, regionFilter, minProducts]);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [search, statusFilter, regionFilter, minProducts]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSuppliers.length / PAGE_SIZE),
  );

  const clampedPage = Math.min(Math.max(1, currentPage), totalPages);

  const pageSlice = useMemo(() => {
    const start = (clampedPage - 1) * PAGE_SIZE;
    return filteredSuppliers.slice(start, start + PAGE_SIZE);
  }, [filteredSuppliers, clampedPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllOnPage = (ids: string[], checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) ids.forEach((id) => next.add(id));
      else ids.forEach((id) => next.delete(id));
      return next;
    });
  };

  const handleDeleteOne = async (id: string) => {
    alert("Chức năng xóa nhà cung cấp đã bị vô hiệu hóa để bảo đảm tính toàn vẹn dữ liệu.");
  };

  const handleBulkDelete = async () => {
    alert("Chức năng xóa nhà cung cấp đã bị vô hiệu hóa để bảo đảm tính toàn vẹn dữ liệu.");
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await supplierService.exportToExcel();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Supplier.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Không xuất được Excel.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <SupplierPageHeader totalCount={suppliers.length} />

      <SupplierFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        regionFilter={regionFilter}
        onRegionFilterChange={setRegionFilter}
        regions={regions}
        onExport={handleExport}
        exporting={exporting}
        showAdvanced={showAdvanced}
        onToggleAdvanced={() => setShowAdvanced((v) => !v)}
        minProducts={minProducts}
        onMinProductsChange={setMinProducts}
      />

      <SupplierBulkToolbar
        selectedCount={selectedIds.size}
        deleting={bulkDeleting}
        onBulkDelete={handleBulkDelete}
      />

      <Card className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
        <CardContent className="p-0">
          <SupplierTable
            suppliers={pageSlice}
            productCounts={productCounts}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAllOnPage={toggleSelectAllOnPage}
            onDelete={handleDeleteOne}
            deletingId={deletingId}
            loading={loading}
          />
          <SupplierPagination
            currentPage={clampedPage}
            totalPages={totalPages}
            totalItems={filteredSuppliers.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
