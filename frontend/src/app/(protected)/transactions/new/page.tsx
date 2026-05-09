"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import TransactionForm from "@/components/transactions/TransactionForm";
import ErrorMessage from "@/components/common/ErrorMessage";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import type { TransactionFormData } from "@/types";
import apiClient from "@/lib/apiClient";

export default function NewTransactionPage() {
  const router = useRouter();
  const { categories, isLoading } = useCategories();
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: TransactionFormData) => {
    setErrors([]);
    setIsSubmitting(true);
    try {
      await apiClient.post("/api/v1/transactions", data);
      router.push("/home");
    } catch (e) {
      const err = e as Error & { errors?: string[] };
      setErrors(err.errors ?? [err.message]);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-xl font-semibold text-gray-800">収支を登録する</h1>
      <ErrorMessage messages={errors} />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-4">
          <TransactionForm
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/home")}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}
