import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategorySlice } from "@/types/dashboard";

interface DashboardCategoryChartProps {
  year: number;
  slices: CategorySlice[];
}

export function DashboardCategoryChart({ year, slices }: DashboardCategoryChartProps) {
  const total = slices.reduce((s, x) => s + x.count, 0);
  let acc = 0;
  const segments = slices.map((sl) => {
    const start = (acc / total) * 360;
    acc += sl.count;
    const end = (acc / total) * 360;
    return { ...sl, start, end };
  });

  const r = 52;
  const c = 70;
  const stroke = 28;

  return (
    <Card className="rounded-xl border border-slate-200/90 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-slate-900">
          Đơn hàng theo danh mục
          <span className="ml-2 text-xs font-normal text-slate-500">({year})</span>
        </CardTitle>
        <Link
          href="/admin"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Xem chi tiết
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 pt-4 pb-6 md:flex-row md:items-start md:justify-center md:gap-10">
        {total === 0 ? (
          <p className="py-8 text-sm text-slate-500">Không có dữ liệu trong năm đã chọn.</p>
        ) : (
          <>
            <svg
              width={140}
              height={140}
              viewBox="0 0 140 140"
              className="shrink-0"
              role="img"
              aria-label="Tỷ lệ đơn theo danh mục"
            >
              {slices.length === 1 ? (
                <>
                  <circle cx={c} cy={c} r={r} fill={slices[0].color} />
                  <circle cx={c} cy={c} r={r - stroke} fill="white" />
                </>
              ) : (
                <>
                  {segments.map((seg, i) => {
                    const sweep = seg.end - seg.start;
                    const large = sweep > 180 ? 1 : 0;
                    const startX =
                      c + r * Math.cos(((seg.start - 90) * Math.PI) / 180);
                    const startY =
                      c + r * Math.sin(((seg.start - 90) * Math.PI) / 180);
                    const endX =
                      c + r * Math.cos(((seg.end - 90) * Math.PI) / 180);
                    const endY =
                      c + r * Math.sin(((seg.end - 90) * Math.PI) / 180);
                    const d = [
                      `M ${c} ${c}`,
                      `L ${startX} ${startY}`,
                      `A ${r} ${r} 0 ${large} 1 ${endX} ${endY}`,
                      "Z",
                    ].join(" ");
                    return (
                      <path
                        key={i}
                        d={d}
                        fill={seg.color}
                        stroke="#fff"
                        strokeWidth={1}
                      />
                    );
                  })}
                  <circle cx={c} cy={c} r={r - stroke} fill="white" />
                </>
              )}
            </svg>
            <ul className="w-full max-w-xs space-y-2 text-sm">
              {slices.map((sl) => (
                <li
                  key={sl.name}
                  className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 last:border-0"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-sm"
                      style={{ backgroundColor: sl.color }}
                      aria-hidden
                    />
                    <span className="truncate text-slate-700">{sl.name}</span>
                  </span>
                  <span className="shrink-0 tabular-nums font-medium text-slate-900">
                    {sl.percent}%
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
