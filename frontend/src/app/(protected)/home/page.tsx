"use client";

import { useState } from "react";
import Link from "next/link";
import { useTransactions } from "@/hooks/useTransactions";
import MonthNavigator from "@/components/common/MonthNavigator";
import SummaryCard from "@/components/home/SummaryCard";
import TransactionTable from "@/components/home/TransactionTable";
import ErrorMessage from "@/components/common/ErrorMessage";
import LoadingSpinner from "@/components/common/LoadingSpinner";

function getPrevMonth(year: number, month: number) {
  return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
}

function getNextMonth(year: number, month: number) {
  return month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
}

export default function HomePage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { transactions, summary, isLoading, error } = useTransactions(year, month);

  const handlePrev = () => {
    const { year: y, month: m } = getPrevMonth(year, month);
    setYear(y);
    setMonth(m);
  };

  const handleNext = () => {
    const { year: y, month: m } = getNextMonth(year, month);
    setYear(y);
    setMonth(m);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <MonthNavigator year={year} month={month} onPrev={handlePrev} onNext={handleNext} />
      </div>

      <SummaryCard summary={summary} />

      {error && <ErrorMessage messages={[error]} />}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <TransactionTable transactions={transactions} />
      )}

      <div className="flex justify-end">
        <Link
          href="/transactions/new"
          className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          ＋ 収支を追加する
        </Link>
      </div>
    </div>
  );
}
