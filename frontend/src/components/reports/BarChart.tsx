"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyReport } from "@/types";

type Props = {
  data: MonthlyReport[];
};

export default function BarChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: `${d.month}月`,
    収入: d.income_total,
    支出: d.expense_total,
  }));

  return (
    <ResponsiveContainer width="100%" height={380}>
      <RechartsBarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(v: number) => `¥${(v / 10000).toFixed(0)}万`}
        />
        <Tooltip
          formatter={(value) => [`¥${Number(value).toLocaleString("ja-JP")}`, ""]}
        />
        <Legend />
        <Bar dataKey="収入" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="支出" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
