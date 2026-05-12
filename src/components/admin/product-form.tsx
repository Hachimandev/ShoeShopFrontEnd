"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductDetail } from "@/types/product";
import { Category, categoryService } from "@/services/category.service";
import type { Supplier } from "@/types/supplier";
import { supplierService } from "@/services/supplier.service";
import { productService } from "@/services/product.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload, X, Save } from "lucide-react";
import Link from "next/link";

interface ProductFormProps {
  initialData?: Product;
  isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [productId, setProductId] = useState(initialData?.productId || "");
  const [productName, setProductName] = useState(initialData?.productName || initialData?.name || "");
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [origin, setOrigin] = useState(initialData?.origin || "");
  const [material, setMaterial] = useState(initialData?.material || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState<number>(initialData?.price || 0);
  const [tax, setTax] = useState<number>(initialData?.tax || 0);
  const [gender, setGender] = useState(initialData?.gender || "Male");
  const [categoryId, setCategoryId] = useState<string>(
    typeof initialData?.category === "object" ? initialData?.category?.categoryId : initialData?.category || ""
  );
  const [supplierId, setSupplierId] = useState<string>(initialData?.supplier?.supplierId || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [productDetails, setProductDetails] = useState<Partial<ProductDetail>[]>(
    initialData?.productDetails || []
  );

  useEffect(() => {
    Promise.all([
      categoryService.getAllCategories().catch(() => []),
      supplierService.getAllSuppliers().catch(() => [])
    ]).then(([cats, sups]) => {
      setCategories(cats);
      setSuppliers(sups);
      
      // Auto-select first item if empty and options exist
      if (!categoryId && cats.length > 0) setCategoryId(cats[0].categoryId);
      if (!supplierId && sups.length > 0) setSupplierId(sups[0].supplierId);
    });
  }, [categoryId, supplierId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const imageUrl = await productService.uploadImage(file);
      setImage(imageUrl);
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image to S3.");
    } finally {
      setIsUploading(false);
    }
  };

  const addVariant = () => {
    setProductDetails([
      ...productDetails,
      {
        productDetailId: `PD-TEMP-${Date.now()}`, // Temporary ID for new variants
        size: 40,
        color: "Black",
        stockQuantity: 0
      }
    ]);
  };

  const updateVariant = (index: number, field: keyof ProductDetail, value: any) => {
    const newDetails = [...productDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setProductDetails(newDetails);
  };

  const removeVariant = (index: number) => {
    setProductDetails(productDetails.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: any = {
        productId: productId || undefined,
        productName,
        brand,
        origin,
        material,
        description,
        price,
        tax,
        gender,
        image,
        category: { categoryId },
        supplier: { supplierId },
        productDetails: productDetails.map(pd => ({
          productDetailId: pd.productDetailId?.startsWith("PD-TEMP") ? null : pd.productDetailId,
          size: Number(pd.size),
          color: pd.color,
          stockQuantity: Number(pd.stockQuantity)
        }))
      };

      if (isEdit && initialData?.productId) {
        await productService.updateProduct(initialData.productId, payload);
      } else {
        await productService.createProduct(payload);
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product. Please check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>
        <div className="flex gap-4">
          <Link href="/admin/products">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isLoading || isUploading}>
            {isLoading ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Product</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEdit && (
                <div>
                  <label className="block text-sm font-medium mb-1">Product ID (optional)</label>
                  <input
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="PRD001"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input
                  required
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Brand *</label>
                  <input
                    required
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Origin</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($) *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tax (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={tax}
                    onChange={(e) => setTax(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Material</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Variants (Sizes & Colors)</CardTitle>
              <Button type="button" onClick={addVariant} size="sm" variant="outline" className="gap-1">
                <Plus className="h-4 w-4" /> Add Variant
              </Button>
            </CardHeader>
            <CardContent>
              {productDetails.length === 0 ? (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                  No variants added. Please add at least one variant.
                </div>
              ) : (
                <div className="space-y-4">
                  {productDetails.map((detail, index) => (
                    <div key={index} className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Size</label>
                        <input
                          type="number"
                          required
                          value={detail.size}
                          onChange={(e) => updateVariant(index, "size", Number(e.target.value))}
                          className="w-full p-2 text-sm border rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Color</label>
                        <input
                          type="text"
                          required
                          value={detail.color}
                          onChange={(e) => updateVariant(index, "color", e.target.value)}
                          className="w-full p-2 text-sm border rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Stock</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={detail.stockQuantity}
                          onChange={(e) => updateVariant(index, "stockQuantity", Number(e.target.value))}
                          className="w-full p-2 text-sm border rounded-md"
                        />
                      </div>
                      <div className="pt-5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeVariant(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2 border rounded-md bg-white"
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map(c => (
                    <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Supplier *</label>
                <select
                  required
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full p-2 border rounded-md bg-white"
                >
                  <option value="" disabled>Select Supplier</option>
                  {suppliers.map(s => (
                    <option key={s.supplierId} value={s.supplierId}>{s.supplierName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2 border rounded-md bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="MALE">MALE</option>
                  <option value="UNISEX">UNISEX</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Image */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {image ? (
                  <div className="relative rounded-lg overflow-hidden border aspect-square">
                    <img src={image} alt="Product" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white text-red-600 shadow-sm transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center aspect-square bg-slate-50">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Click to upload an image</p>
                    <p className="text-xs text-slate-500 mb-4">PNG, JPG up to 5MB</p>
                  </div>
                )}
                
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <Button type="button" variant="outline" className="w-full" disabled={isUploading}>
                    {isUploading ? "Uploading to S3..." : image ? "Replace Image" : "Upload Image"}
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500 mt-2 text-center">
                  Or paste image URL:
                </div>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://...s3.amazonaws.com/img.jpg"
                  className="w-full p-2 border rounded-md text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
