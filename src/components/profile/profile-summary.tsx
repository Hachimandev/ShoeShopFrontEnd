"use client";

import { Mail, Phone, MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ProfileSummaryProps {
  user: {
    email?: string;
    phone?: string;
    address?: string;
  };
  onOpenEdit: () => void;
}

export function ProfileSummary({ user, onOpenEdit }: ProfileSummaryProps) {
  return (
    <div className="lg:col-span-2 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tighter">
          Account Settings
        </h1>
        <Button
          onClick={onOpenEdit}
          variant="outline"
          className="rounded-2xl font-bold flex gap-2"
        >
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] dark:bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Email Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              {user.email || "Not provided"}
            </p>
            <Badge
              variant="outline"
              className="mt-2 text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900/50 dark:text-green-400"
            >
              Verified
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] dark:bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Phone Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              {user.phone || "Not provided"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] md:col-span-2 dark:bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Default Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              {user.address ||
                "No shipping address saved yet. Add one to speed up your checkout process."}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] dark:bg-slate-900/60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Security</CardTitle>
          </div>
          <CardDescription>
            Manage your password and account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
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
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
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
  );
}
