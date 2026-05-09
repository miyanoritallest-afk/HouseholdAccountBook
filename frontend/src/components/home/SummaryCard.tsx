"use client";

import type { TransactionSummary } from "@/types";

type Props = {
  summary: TransactionSummary;
};

function formatAmount(amount: number) {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

export default function SummaryCard({ summary }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500">収入合計</p>
        <p className="mt-1 text-xl font-bold text-blue-600">
          {formatAmount(summary.income_total)}
        </p>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500">支出合計</p>
        <p className="mt-1 text-xl font-bold text-red-500">
          {formatAmount(summary.expense_total)}
        </p>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500">残高</p>
        <p
          className={`mt-1 text-xl font-bold ${
            summary.balance >= 0 ? "text-gray-800" : "text-red-600"
          }`}
        >
          {formatAmount(summary.balance)}
        </p>
      </div>
    </div>
  );
}
