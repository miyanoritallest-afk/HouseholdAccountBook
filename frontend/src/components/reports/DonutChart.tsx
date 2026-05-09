"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { PieLabelRenderProps } from "recharts";
import type { CategorySummaryItem } from "@/types";

const COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#f59e0b",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316",
];

type Props = {
  data: CategorySummaryItem[];
};

export default function DonutChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        今月の支出データがありません
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.name,
    value: item.amount,
    percentage: item.percentage,
  }));

  const renderLabel = (props: PieLabelRenderProps) => {
    const pct = (props as { percentage?: number }).percentage;
    return `${props.name} ${pct ?? 0}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={80}
          outerRadius={140}
          dataKey="value"
          label={renderLabel}
          labelLine={false}
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`¥${Number(value).toLocaleString("ja-JP")}`, "金額"]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
