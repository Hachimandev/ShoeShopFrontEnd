"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Package,
  Heart,
  LogOut,
  Camera,
  Edit2,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
    const loadUserData = () => {
      try {
        // Try to load from "user" key first
        const userData = localStorage.getItem("user");
        let parsedUser = userData ? JSON.parse(userData) : null;

        // If not found, try "userInfo" key
        if (!parsedUser) {
          const userInfo = localStorage.getItem("userInfo");
          parsedUser = userInfo ? JSON.parse(userInfo) : null;
        }

        // If still not found, try other auth keys
        if (!parsedUser) {
          const username = localStorage.getItem("username");
          const email = localStorage.getItem("email");
          const roles = localStorage.getItem("roles");
          if (username) {
            parsedUser = {
              username,
              email: email || undefined,
              role: roles ? JSON.parse(roles)[0] : "Customer",
            };
          }
        }

        // Set default profile if user exists, otherwise null
        if (parsedUser) {
          const userData = {
            username: parsedUser.username || "User",
            fullName:
              parsedUser.fullName ||
              parsedUser.customer?.fullName ||
              "User Profile",
            email: parsedUser.email || "Not provided",
            phone:
              parsedUser.phone ||
              parsedUser.customer?.phoneNumber ||
              "Not provided",
            address:
              parsedUser.address ||
              parsedUser.customer?.address ||
              "Not provided",
            role: parsedUser.role || "Customer",
          };
          setUser(userData);
          // Initialize edit form with user data
          setEditForm({
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
          });
        } else {
          setUser(null);
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Update user state
      setUser((prev) => (prev ? { ...prev, ...editForm } : null));
      // Could save to localStorage or API here
      localStorage.setItem("user", JSON.stringify({ ...user, ...editForm }));
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
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-b from-primary/5 to-white">
            <CardContent className="pt-10 pb-8 flex flex-col items-center">
              <div className="relative mb-6">
                <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                    {(user.fullName || user.username || "U")
                      .substring(0, 1)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-lg border-2 border-white"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
              <h2 className="text-2xl font-black tracking-tight">
                {user.fullName || user.username}
              </h2>
              <p className="text-muted-foreground font-medium mb-4">
                @{user.username}
              </p>
              <Badge
                variant="secondary"
                className="px-4 py-1 rounded-full font-bold uppercase tracking-wider"
              >
                {user.role || "Customer"}
              </Badge>
            </CardContent>
            <Separator />
            <CardContent className="p-0">
              <nav className="flex flex-col">
                <button className="flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors text-primary font-bold border-l-4 border-primary">
                  <User className="h-5 w-5" />
                  Profile Information
                </button>
                <button className="flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors text-slate-600 font-medium">
                  <Package className="h-5 w-5" />
                  My Orders
                </button>
                <button className="flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors text-slate-600 font-medium">
                  <Heart className="h-5 w-5" />
                  Wishlist
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-rose-50 transition-colors text-rose-600 font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black tracking-tighter">
              Account Settings
            </h1>
            <Button
              onClick={handleOpenEdit}
              variant="outline"
              className="rounded-2xl font-bold flex gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-100 shadow-sm rounded-[2rem]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 font-medium">
                  {user.email || "Not provided"}
                </p>
                <Badge
                  variant="outline"
                  className="mt-2 text-green-600 border-green-200 bg-green-50"
                >
                  Verified
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm rounded-[2rem]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Phone Number
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 font-medium">
                  {user.phone || "Not provided"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm rounded-[2rem] md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Default Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 font-medium">
                  {user.address ||
                    "No shipping address saved yet. Add one to speed up your checkout process."}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-100 shadow-sm rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                <div>
                  <p className="font-bold">Password</p>
                  <p className="text-sm text-muted-foreground">
                    Last changed 3 months ago
                  </p>
                </div>
                <Button variant="ghost" className="font-bold underline">
                  Change
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                <div>
                  <p className="font-bold">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Not enabled</p>
                </div>
                <Button variant="ghost" className="font-bold underline">
                  Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-2xl">Edit Profile</CardTitle>
              <button
                onClick={handleCloseEdit}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <Input
                  id="fullName"
                  name="fullName"
                  value={editForm.fullName}
                  onChange={handleFormChange}
                  placeholder="Your full name"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleFormChange}
                  placeholder="your@email.com"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleFormChange}
                  placeholder="0912345678"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Input
                  id="address"
                  name="address"
                  value={editForm.address}
                  onChange={handleFormChange}
                  placeholder="Your address"
                />
              </Field>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  onClick={handleCloseEdit}
                  variant="outline"
                  className="flex-1"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
