"use client";

import { useState } from "react";
import MonthNavigator from "@/components/common/MonthNavigator";
import DonutChart from "@/components/reports/DonutChart";
import BarChart from "@/components/reports/BarChart";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useCategorySummary, usePast6MonthsReports } from "@/hooks/useReports";

function getPrevMonth(year: number, month: number) {
  return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
}

function getNextMonth(year: number, month: number) {
  return month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
}

export default function ReportsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { summary, isLoading: summaryLoading, error: summaryError } = useCategorySummary(year, month);
  const { reports, isLoading: reportsLoading } = usePast6MonthsReports(year, month);

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

      {summaryError && <ErrorMessage messages={[summaryError]} />}

      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-lg bg-white px-4 pt-5 pb-3 shadow-sm border border-gray-100">
          <h2 className="mb-2 text-base font-semibold text-gray-700">支出カテゴリ別</h2>
          {summaryLoading ? (
            <LoadingSpinner />
          ) : (
            <DonutChart data={summary?.categories ?? []} />
          )}
        </div>

        <div className="rounded-lg bg-white px-4 pt-5 pb-3 shadow-sm border border-gray-100">
          <h2 className="mb-2 text-base font-semibold text-gray-700">月別収支推移（過去6ヶ月）</h2>
          {reportsLoading ? (
            <LoadingSpinner />
          ) : (
            <BarChart data={reports} />
          )}
        </div>
      </div>
    </div>
  );
}
