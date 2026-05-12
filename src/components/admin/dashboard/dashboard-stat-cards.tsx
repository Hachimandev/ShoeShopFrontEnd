import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Minus,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { KpiCardData } from "@/types/dashboard";

const iconMap = {
  revenue: DollarSign,
  orders: ShoppingCart,
  stock: Package,
  customers: Users,
};

const iconBg = {
  revenue: "bg-emerald-100 text-emerald-600",
  orders: "bg-sky-100 text-sky-600",
  stock: "bg-amber-100 text-amber-700",
  customers: "bg-orange-100 text-orange-600",
};

const trendColor = {
  up: "text-emerald-600",
  down: "text-rose-600",
  flat: "text-amber-600",
  unknown: "text-slate-500",
};

interface DashboardStatCardsProps {
  items: KpiCardData[];
}

export function DashboardStatCards({ items }: DashboardStatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((k) => {
        const Icon = iconMap[k.icon];
        return (
          <Card
            key={k.title}
            className="rounded-xl border border-slate-200/90 bg-white shadow-sm"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <p className="text-sm font-medium text-slate-600">{k.title}</p>
                  <p className="text-2xl font-bold tracking-tight text-slate-900 md:text-[1.65rem]">
                    {k.value}
                  </p>
                  <p
                    className={`flex items-center gap-1 text-sm font-medium ${trendColor[k.trend.direction]}`}
                  >
                    {k.trend.direction === "up" && (
                      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
                    )}
                    {k.trend.direction === "down" && (
                      <ArrowDownRight className="h-4 w-4 shrink-0" aria-hidden />
                    )}
                    {k.trend.direction === "flat" && (
                      <Minus className="h-4 w-4 shrink-0" aria-hidden />
                    )}
                    {k.trend.direction === "unknown" && (
                      <Minus className="h-4 w-4 shrink-0 opacity-40" aria-hidden />
                    )}
                    <span>{k.trend.label}</span>
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg[k.icon]}`}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
