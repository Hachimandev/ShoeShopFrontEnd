"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Edit2, Loader2 } from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";
import { toast } from "sonner";

export default function EditProfilePage() {
  return null; // This component is intended to be used as a client component elsewhere
}

export function EditProfileForm({
  user,
  onSuccess,
}: {
  user: any;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { updateCustomerInfo, loading } = useCustomer();
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
    phoneNumber: user.phone || "",
    address: user.address || "",
  });

  const handleSave = async () => {
    try {
      // Gọi API update[cite: 2]
      const result = await updateCustomerInfo(user.username, {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      });

      if (result) {
        toast.success("Profile updated successfully!");
        onSuccess(); // Load lại data ở trang Profile
        setOpen(false);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-2xl font-bold flex gap-2">
          <Edit2 className="h-4 w-4" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update your personal information below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <FieldLabel>Full Name</FieldLabel>
            <Input
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>Email</FieldLabel>
            <Input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>Phone Number</FieldLabel>
            <Input
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>Address</FieldLabel>
            <Input
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 rounded-xl font-bold"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1 rounded-xl font-bold"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
