"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { MonthPoint } from "@/lib/types";
import { computeExpectedPath, computeYoY } from "@/lib/trend";

type Props = {
  title: string;
  subtitle?: string;
  data: MonthPoint[];
  projectStart: string;
  color: string;
  format?: (v: number) => string;
  small?: boolean;
};

export function PerformanceChart({
  title,
  subtitle,
  data,
  projectStart,
  color,
  format = (v) => v.toLocaleString(),
  small,
}: Props) {
  const expected = computeExpectedPath(data, projectStart);
  const yoy = computeYoY(data);

  const projectStartMonth = projectStart.slice(0, 7);

  const merged = data.map((d, i) => ({
    month: d.month,
    actual: d.value,
    expected: expected[i]?.value ?? null,
    yoy: yoy[i]?.value || null,
  }));

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className={`font-semibold text-zinc-800 ${small ? "text-xs" : "text-sm"}`}>{title}</h3>
        {subtitle && (
          <span className="text-[10px] text-zinc-400">{subtitle}</span>
        )}
      </div>
      <div className={`rounded-xl border border-zinc-200 bg-white p-3 shadow-sm ${small ? "h-44" : "h-56"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={merged} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 9, fill: "#a1a1aa" }}
              tickFormatter={(v) => {
                const [y, m] = v.split("-");
                return `${m}/${y.slice(2)}`;
              }}
              interval={3}
              axisLine={{ stroke: "#e4e4e7" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "#a1a1aa" }}
              tickFormatter={(v) => format(v)}
              width={50}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value, name) => [
                format(Number(value)),
                name === "actual" ? "Actual" : name === "expected" ? "Expected trend" : "Prior year",
              ]}
              labelFormatter={(label) => {
                const [y, m] = label.split("-");
                return `${m}/${y}`;
              }}
              contentStyle={{
                fontSize: 11,
                borderRadius: 8,
                border: "1px solid #e4e4e7",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
              formatter={(value) =>
                value === "actual" ? "Actual" : value === "expected" ? "Expected trend" : "Prior year"
              }
              iconSize={8}
            />
            <ReferenceLine
              x={projectStartMonth}
              stroke="#a855f7"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="expected"
              stroke="#d4d4d8"
              fill="#fafafa"
              strokeDasharray="6 3"
              dot={false}
              isAnimationActive={false}
              strokeWidth={1}
            />
            <Line
              type="monotone"
              dataKey="yoy"
              stroke="#d4d4d8"
              strokeDasharray="3 3"
              dot={false}
              strokeWidth={1}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
