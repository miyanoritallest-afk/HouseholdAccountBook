"use client";

import type { Transaction } from "@/types";
import { useRouter } from "next/navigation";

type Props = {
  transactions: Transaction[];
};

function formatDateLabel(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dow = ["日", "月", "火", "水", "木", "金", "土"][new Date(y, m - 1, d).getDay()];
  return `${m}月${d}日（${dow}）`;
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

  // 日付でグループ化（降順ソート済み前提）
  const groups: { date: string; items: Transaction[] }[] = [];
  for (const t of transactions) {
    const last = groups[groups.length - 1];
    if (last && last.date === t.date) {
      last.items.push(t);
    } else {
      groups.push({ date: t.date, items: [t] });
    }
  }

  return (
    <div className="space-y-3">
      {groups.map(({ date, items }) => {
        const dayIncome  = items.filter(t => t.transaction_type === "income").reduce((s, t) => s + t.amount, 0);
        const dayExpense = items.filter(t => t.transaction_type === "expense").reduce((s, t) => s + t.amount, 0);

        return (
          <div key={date} className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-100">
            {/* 日付ヘッダー */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2">
              <span className="text-sm font-semibold text-gray-700">{formatDateLabel(date)}</span>
              <div className="flex gap-3 text-xs">
                {dayIncome > 0 && (
                  <span className="text-blue-600">収入 {formatAmount(dayIncome)}</span>
                )}
                {dayExpense > 0 && (
                  <span className="text-red-500">支出 {formatAmount(dayExpense)}</span>
                )}
              </div>
            </div>

            {/* その日の明細 */}
            <table className="w-full text-sm">
              <tbody>
                {items.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => router.push(`/transactions/${t.id}/edit`)}
                    className="cursor-pointer border-b border-gray-50 hover:bg-gray-50 last:border-0"
                  >
                    <td className="px-4 py-2.5">
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
                    <td className="px-4 py-2.5 text-gray-700">{t.category.name}</td>
                    <td
                      className={`px-4 py-2.5 text-right font-medium ${
                        t.transaction_type === "income" ? "text-blue-600" : "text-red-600"
                      }`}
                    >
                      {formatAmount(t.amount)}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs">{t.memo ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
