"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import TransactionForm from "@/components/transactions/TransactionForm";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ErrorMessage from "@/components/common/ErrorMessage";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import type { Transaction, TransactionFormData } from "@/types";
import apiClient from "@/lib/apiClient";

export default function EditTransactionPage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { categories, isLoading: catLoading } = useCategories();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { id } = await props.params;
        const res = await apiClient.get<Transaction>(`/api/v1/transactions/${id}`);
        if (!cancelled) setTransaction(res.data);
      } catch (e) {
        if (!cancelled) setErrors([(e as Error).message]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [props.params]);

  const handleSubmit = async (data: TransactionFormData) => {
    if (!transaction) return;
    setErrors([]);
    setIsSubmitting(true);
    try {
      await apiClient.put(`/api/v1/transactions/${transaction.id}`, data);
      router.push("/home");
    } catch (e) {
      const err = e as Error & { errors?: string[] };
      setErrors(err.errors ?? [err.message]);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;
    setIsSubmitting(true);
    try {
      await apiClient.delete(`/api/v1/transactions/${transaction.id}`);
      router.push("/home");
    } catch (e) {
      setErrors([(e as Error).message]);
      setIsSubmitting(false);
    }
  };

  if (isLoading || catLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-xl font-semibold text-gray-800">収支を編集する</h1>
      <ErrorMessage messages={errors} />
      {transaction && (
        <div className="mt-4">
          <TransactionForm
            initialData={transaction}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/home")}
            onDelete={() => { setShowConfirm(true); return Promise.resolve(); }}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
      <ConfirmDialog
        isOpen={showConfirm}
        message="この収支を削除しますか？この操作は取り消せません。"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
