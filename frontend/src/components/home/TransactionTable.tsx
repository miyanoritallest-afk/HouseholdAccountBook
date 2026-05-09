"use client";

import type { Transaction } from "@/types";
import { useRouter } from "next/navigation";

type Props = {
  transactions: Transaction[];
};

function formatDate(dateStr: string) {
  const [, m, d] = dateStr.split("-");
  return `${parseInt(m)}/${parseInt(d)}`;
}

function formatAmount(amount: number) {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

export default function TransactionTable({ transactions }: Props) {
  const router = useRouter();

  if (transactions.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center text-sm text-gray-500 shadow-sm border border-gray-100">
        この月の収支データがありません
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="px-4 py-3 text-left font-medium text-gray-600">日付</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">種別</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">カテゴリ</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">金額</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">メモ</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr
              key={t.id}
              onClick={() => router.push(`/transactions/${t.id}/edit`)}
              className="cursor-pointer border-b border-gray-50 hover:bg-gray-50 last:border-0"
            >
              <td className="px-4 py-3 text-gray-700">{formatDate(t.date)}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    t.transaction_type === "income"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {t.transaction_type === "income" ? "収入" : "支出"}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">{t.category.name}</td>
              <td
                className={`px-4 py-3 text-right font-medium ${
                  t.transaction_type === "income" ? "text-blue-600" : "text-red-600"
                }`}
              >
                {formatAmount(t.amount)}
              </td>
              <td className="px-4 py-3 text-gray-500">{t.memo ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
