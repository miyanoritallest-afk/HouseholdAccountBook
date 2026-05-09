"use client";

import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/apiClient";
import type { MonthlyReport, CategorySummaryResponse } from "@/types";

export function useMonthlyReport(year: number, month: number) {
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<MonthlyReport>("/api/v1/reports/monthly", {
        params: { year, month },
      });
      setReport(res.data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { report, isLoading, error };
}

export function useCategorySummary(year: number, month: number) {
  const [summary, setSummary] = useState<CategorySummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<CategorySummaryResponse>("/api/v1/reports/category_summary", {
        params: { year, month },
      });
      setSummary(res.data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { summary, isLoading, error };
}

export function usePast6MonthsReports(year: number, month: number) {
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const months: { year: number; month: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
    }

    Promise.all(
      months.map(({ year: y, month: m }) =>
        apiClient
          .get<MonthlyReport>("/api/v1/reports/monthly", { params: { year: y, month: m } })
          .then((r) => r.data)
          .catch(() => ({ year: y, month: m, income_total: 0, expense_total: 0, balance: 0 }))
      )
    ).then((data) => {
      if (!cancelled) {
        setReports(data);
        setIsLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [year, month]);

  return { reports, isLoading };
}
