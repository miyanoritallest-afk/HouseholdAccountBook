"use client";

import type { TransactionSummary } from "@/types";

type Props = {
  summary: TransactionSummary;
};

function formatAmount(amount: number) {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

export default function SummaryCard({ summary }: Props) {
  const { income_total, expense_total, balance } = summary;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-sm border-l-4 border-blue-500">
        <p className="text-xs font-medium text-blue-600">収入合計</p>
        <p className="mt-1.5 text-xl font-bold text-blue-700">
          {formatAmount(income_total)}
        </p>
      </div>
      <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-100 p-4 shadow-sm border-l-4 border-red-400">
        <p className="text-xs font-medium text-red-500">支出合計</p>
        <p className="mt-1.5 text-xl font-bold text-red-600">
          {formatAmount(expense_total)}
        </p>
      </div>
      <div
        className={`rounded-xl p-4 shadow-sm border-l-4 ${
          balance >= 0
            ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-500"
            : "bg-gradient-to-br from-red-50 to-red-100 border-red-500"
        }`}
      >
        <p
          className={`text-xs font-medium ${
            balance >= 0 ? "text-emerald-600" : "text-red-500"
          }`}
        >
          残高
        </p>
        <p
          className={`mt-1.5 text-xl font-bold ${
            balance >= 0 ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {formatAmount(balance)}
        </p>
      </div>
    </div>
  );
}
