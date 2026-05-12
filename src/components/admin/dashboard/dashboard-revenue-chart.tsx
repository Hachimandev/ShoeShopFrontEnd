import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MONTHS = [
  "T1",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "T8",
  "T9",
  "T10",
  "T11",
  "T12",
];

interface DashboardRevenueChartProps {
  year: number;
  yearOptions: number[];
  onYearChange: (y: number) => void;
  monthlyRevenue: number[];
}

export function DashboardRevenueChart({
  year,
  yearOptions,
  onYearChange,
  monthlyRevenue,
}: DashboardRevenueChartProps) {
  const max = Math.max(...monthlyRevenue, 1);
  const w = 640;
  const h = 220;
  const padL = 44;
  const padR = 16;
  const padT = 16;
  const padB = 28;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const points = monthlyRevenue.map((v, i) => {
    const x = padL + (innerW * (i + 0.5)) / 12;
    const y = padT + innerH * (1 - v / max);
    return { x, y, v };
  });

  const lineD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const yTicks = 5;
  const tickVals = Array.from({ length: yTicks }, (_, i) =>
    Math.round((max * (yTicks - 1 - i)) / (yTicks - 1)),
  );

  return (
    <Card className="rounded-xl border border-slate-200/90 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-slate-900">
          Doanh thu theo tháng
        </CardTitle>
        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-800 shadow-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
          aria-label="Chọn năm"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${w} ${h}`}
            className="w-full min-w-[320px] text-orange-500"
            role="img"
            aria-label={`Biểu đồ doanh thu năm ${year}`}
          >
            {tickVals.map((tv, i) => {
              const yPos = padT + (innerH * i) / (yTicks - 1);
              const labelMn = Math.round(tv / 1_000_000);
              return (
                <g key={tv}>
                  <line
                    x1={padL}
                    y1={yPos}
                    x2={w - padR}
                    y2={yPos}
                    stroke="#f1f5f9"
                    strokeWidth={1}
                  />
                  <text
                    x={padL - 6}
                    y={yPos + 4}
                    textAnchor="end"
                    className="fill-slate-400 text-[10px]"
                  >
                    {labelMn > 0 ? `${labelMn}tr` : "0"}
                  </text>
                </g>
              );
            })}
            <path
              d={lineD}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={4}
                className="fill-white stroke-orange-500"
                strokeWidth={2}
              />
            ))}
            {MONTHS.map((label, i) => {
              const x = padL + (innerW * (i + 0.5)) / 12;
              return (
                <text
                  key={label}
                  x={x}
                  y={h - 6}
                  textAnchor="middle"
                  className="fill-slate-500 text-[10px]"
                >
                  {label}
                </text>
              );
            })}
          </svg>
        </div>
        <p className="mt-1 text-center text-xs text-slate-400">
          Đơn vị trục dọc: triệu VNĐ (đơn đã giao)
        </p>
      </CardContent>
    </Card>
  );
}
