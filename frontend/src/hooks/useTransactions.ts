"use client";

import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/apiClient";
import type {
  Transaction,
  TransactionSummary,
  TransactionsResponse,
  TransactionFormData,
} from "@/types";

export function useTransactions(year: number, month: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary>({
    income_total: 0,
    expense_total: 0,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<TransactionsResponse>("/api/v1/transactions", {
        params: { year, month },
      });
      setTransactions(res.data.transactions);
      setSummary(res.data.summary);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = async (data: TransactionFormData) => {
    await apiClient.post("/api/v1/transactions", { transaction: data });
    await fetch();
  };

  const update = async (id: number, data: TransactionFormData) => {
    await apiClient.put(`/api/v1/transactions/${id}`, { transaction: data });
    await fetch();
  };

  const remove = async (id: number) => {
    await apiClient.delete(`/api/v1/transactions/${id}`);
    await fetch();
  };

  return { transactions, summary, isLoading, error, refetch: fetch, create, update, remove };
}
