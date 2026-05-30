"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProfileSummary } from "@/components/profile/profile-summary";
import { customerService } from "@/services/customer.service";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    username?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    role?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Lấy username từ localStorage
        const username = localStorage.getItem("username");
        if (!username) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Gọi API lấy thông tin khách hàng
        try {
          const customerInfo = await customerService.getCustomer(username);
          const userData = {
            username: username,
            fullName: customerInfo.fullName || "User Profile",
            email: customerInfo.email || "Not provided",
            phone: customerInfo.phoneNumber || "Not provided",
            address: customerInfo.address || "Not provided",
            role: localStorage.getItem("roles")
              ? JSON.parse(localStorage.getItem("roles") || "[]")[0]
              : "Customer",
          };
          setUser(userData);
          setEditForm({
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
          });
        } catch (apiError) {
          console.error("Failed to fetch customer info from API:", apiError);
          // Fallback: Lấy từ localStorage
          const userData = localStorage.getItem("user");
          const parsedUser = userData ? JSON.parse(userData) : null;

          if (parsedUser) {
            const user = {
              username: parsedUser.username || "User",
              fullName: parsedUser.fullName || "User Profile",
              email: parsedUser.email || "Not provided",
              phone: parsedUser.phone || "Not provided",
              address: parsedUser.address || "Not provided",
              role: parsedUser.role || "Customer",
            };
            setUser(user);
            setEditForm({
              fullName: user.fullName,
              email: user.email,
              phone: user.phone,
              address: user.address,
            });
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
    window.addEventListener("auth-change", loadUserData);
    return () => window.removeEventListener("auth-change", loadUserData);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  };

  const handleOpenEdit = () => {
    if (user) {
      setEditForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    const username = localStorage.getItem("username");
    if (!username) return;

    setIsSaving(true);
    try {
      // Gọi API cập nhật thông tin trong database
      const updatedCustomer = await customerService.updateCustomerInfo(username, {
        fullName: editForm.fullName,
        email: editForm.email,
        phoneNumber: editForm.phone,
        address: editForm.address,
      });

      const userData = {
        username: username,
        fullName: updatedCustomer.fullName || editForm.fullName,
        email: updatedCustomer.email || editForm.email,
        phone: updatedCustomer.phoneNumber || editForm.phone,
        address: updatedCustomer.address || editForm.address,
        role: user?.role || "Customer"
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Phát sự kiện để Header và các component liên quan cập nhật thông tin mới
      window.dispatchEvent(new Event("auth-change"));

      setIsEditOpen(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">You are not logged in</h2>
        <Button onClick={() => router.push("/auth/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <ProfileCard
            user={user}
            onLogout={handleLogout}
            activeNav="profile"
          />
        </div>
        <ProfileSummary user={user} onOpenEdit={handleOpenEdit} />
      </div>

      <EditProfileModal
        isOpen={isEditOpen}
        formValues={editForm}
        onChange={handleFormChange}
        onClose={handleCloseEdit}
        onSave={handleSaveProfile}
        isSaving={isSaving}
      />
    </div>
  );
}
