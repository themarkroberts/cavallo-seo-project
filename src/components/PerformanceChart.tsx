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
    <div className={small ? "mt-6" : "mt-0"}>
      <h3 className={`font-semibold text-zinc-900 ${small ? "text-sm" : "text-base"}`}>{title}</h3>
      {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
      <div className={small ? "h-48 mt-3" : "h-64 mt-3"}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={merged} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#a1a1aa" }}
              tickFormatter={(v) => {
                const [y, m] = v.split("-");
                return `${m}/${y.slice(2)}`;
              }}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#a1a1aa" }}
              tickFormatter={(v) => format(v)}
              width={55}
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
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={(value) =>
                value === "actual" ? "Actual" : value === "expected" ? "Expected trend" : "Prior year"
              }
            />
            <ReferenceLine
              x={projectStartMonth}
              stroke="#a855f7"
              strokeDasharray="4 4"
              label={{ value: "Project start", fontSize: 10, fill: "#a855f7", position: "top" }}
            />
            <Area
              type="monotone"
              dataKey="expected"
              stroke="#d4d4d8"
              fill="#fafafa"
              strokeDasharray="6 3"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="yoy"
              stroke="#a1a1aa"
              strokeDasharray="3 3"
              dot={false}
              strokeWidth={1.5}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke={color}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
