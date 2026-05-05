"use client";

import { Mail, Phone, MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { UserInfo } from "@/types/auth";

interface ProfileInfoProps {
  userInfo: UserInfo | null;
}

export function ProfileInfo({ userInfo }: ProfileInfoProps) {
  if (!userInfo) return null;

  const customer = userInfo.customer;
  const email = customer?.fullName ? userInfo.email : "Not provided";
  const phone = customer?.phoneNumber || "Not provided";
  const address = customer?.address || "Not provided";

  return (
    <div className="lg:col-span-2 space-y-6">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-2xl font-bold">
              Profile Information
            </CardTitle>
          </div>
          <Link href="/profile/edit">
            <Button variant="default">Edit Profile</Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Full Name
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {customer?.fullName || "Not set"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Username
              </p>
              <p className="text-lg font-semibold text-slate-900">
                @{userInfo.username}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 rounded-lg bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-medium text-slate-900">{userInfo.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-600">Phone Number</p>
                  <p className="font-medium text-slate-900">{phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="space-y-4 rounded-lg bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Shipping Address</h3>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-600">Address</p>
                <p className="font-medium text-slate-900">{address}</p>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="space-y-4 rounded-lg bg-blue-50 p-4 border border-blue-200">
            <h3 className="font-semibold text-slate-900">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-600">Account ID</p>
                  <p className="font-mono text-sm text-slate-900 break-all">
                    {userInfo.accountId}
                  </p>
                </div>
              </div>
              {customer?.customerId && (
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600">Customer ID</p>
                    <p className="font-mono text-sm text-slate-900 break-all">
                      {customer.customerId}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
