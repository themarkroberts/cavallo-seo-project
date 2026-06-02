import { MonthPoint } from "./types";

function monthToIndex(month: string): number {
  const [y, m] = month.split("-").map(Number);
  return y * 12 + m;
}

export function computeExpectedPath(
  data: MonthPoint[],
  projectStart: string
): MonthPoint[] {
  const startIdx = monthToIndex(projectStart.slice(0, 7));
  const preProject = data.filter((d) => monthToIndex(d.month) <= startIdx);

  if (preProject.length < 2) return [];

  const n = preProject.length;
  const xs = preProject.map((_, i) => i);
  const ys = preProject.map((d) => d.value);

  const xMean = xs.reduce((a, b) => a + b, 0) / n;
  const yMean = ys.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xMean) * (ys[i] - yMean);
    den += (xs[i] - xMean) * (xs[i] - xMean);
  }

  const slope = den === 0 ? 0 : num / den;
  const intercept = yMean - slope * xMean;

  return data.map((d, i) => ({
    month: d.month,
    value: Math.max(0, Math.round(intercept + slope * i)),
  }));
}

export function computeYoY(data: MonthPoint[]): MonthPoint[] {
  const byMonth = new Map(data.map((d) => [d.month, d.value]));
  return data.map((d) => {
    const [y, m] = d.month.split("-").map(Number);
    const prevKey = `${y - 1}-${String(m).padStart(2, "0")}`;
    return {
      month: d.month,
      value: byMonth.get(prevKey) ?? 0,
    };
  });
}
