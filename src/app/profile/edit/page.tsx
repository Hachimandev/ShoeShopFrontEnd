"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { EditProfileForm } from "@/components/profile/edit-profile-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const { isLoggedIn, username } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">You are not logged in</h2>
        <Button onClick={() => router.push("/auth/login")}>Go to Login</Button>
      </div>
    );
  }

  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return <EditProfileForm username={username} />;
}
