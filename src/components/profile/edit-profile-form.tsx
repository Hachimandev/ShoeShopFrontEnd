"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCustomer } from "@/hooks/useCustomer";
import { UpdateCustomerDTO } from "@/types/customer";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface EditProfileFormProps {
  username: string;
}

export function EditProfileForm({ username }: EditProfileFormProps) {
  const router = useRouter();
  const { getCustomerInfo, updateCustomerInfo, loading, error } = useCustomer();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    ward: "",
    district: "",
    city: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadCustomerInfo = async () => {
      try {
        const info = await getCustomerInfo(username);
        if (info) {
          setFormData({
            fullName: info.fullName || "",
            email: info.email || "",
            phoneNumber: info.phoneNumber || "",
            address: info.address || "",
            ward: info.ward || "",
            district: info.district || "",
            city: info.city || "",
          });
        }
      } catch (err) {
        console.error("Failed to load customer info:", err);
        setSaveError("Failed to load customer information");
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomerInfo();
  }, [username, getCustomerInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSaveError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setSaveError("Full name is required");
      return;
    }
    if (!formData.email.trim()) {
      setSaveError("Email is required");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setSaveError("Phone number is required");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const fullAddress = [
        formData.address,
        formData.ward,
        formData.district,
        formData.city,
      ]
        .filter(Boolean)
        .join(", ");

      const updateData: UpdateCustomerDTO = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: fullAddress,
      };

      await updateCustomerInfo(username, updateData);
      setSaveSuccess(true);

      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setSaveError(
        err?.message || "Failed to update profile. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-6">
        <Link href="/profile">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Profile
          </Button>
        </Link>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">
                Basic Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="fullName">Full Name *</FieldLabel>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email *</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </Field>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">
                Contact Information
              </h3>
              <Field>
                <FieldLabel htmlFor="phoneNumber">Phone Number *</FieldLabel>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="0912345678"
                  required
                />
              </Field>
            </div>

            {/* Address Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Shipping Address</h3>
              <Field>
                <FieldLabel htmlFor="address">Street / House No.</FieldLabel>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="ward">Ward / Commune</FieldLabel>
                  <Input
                    id="ward"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    placeholder="Ward/Commune"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="district">District</FieldLabel>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="District"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="city">City / Province</FieldLabel>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </Field>
              </div>
            </div>

            {/* Error/Success Messages */}
            {saveError && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                {saveError}
              </div>
            )}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                {error}
              </div>
            )}
            {saveSuccess && (
              <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
                Profile updated successfully! Redirecting...
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSaving || loading}
                className="flex-1"
              >
                {isSaving || loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Link href="/profile" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
