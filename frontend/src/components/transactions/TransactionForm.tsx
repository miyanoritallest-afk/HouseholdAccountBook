"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { Transaction, CategoriesResponse, TransactionFormData, TransactionType } from "@/types";
import Calculator from "@/components/common/Calculator";

type Props = {
  initialData?: Transaction;
  categories: CategoriesResponse;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  isSubmitting: boolean;
};

type FormValues = {
  transaction_type: TransactionType;
  amount: string;
  category_id: string;
  date: string;
  memo: string;
};

export default function TransactionForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting,
}: Props) {
  const today = new Date().toISOString().split("T")[0];
  const [showCalc, setShowCalc] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      transaction_type: initialData?.transaction_type ?? "expense",
      amount: initialData ? String(initialData.amount) : "",
      category_id: initialData ? String(initialData.category.id) : "",
      date: initialData?.date ?? today,
      memo: initialData?.memo ?? "",
    },
  });

  const transactionType = watch("transaction_type");
  const currentCategories =
    transactionType === "income" ? categories.income : categories.expense;

  useEffect(() => {
    if (!initialData) {
      setValue("category_id", "");
    }
  }, [transactionType, initialData, setValue]);

  const handleFormSubmit = async (values: FormValues) => {
    await onSubmit({
      transaction_type: values.transaction_type,
      amount: Number(values.amount),
      category_id: Number(values.category_id),
      date: values.date,
      memo: values.memo || undefined,
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
      {showCalc && (
        <Calculator
          initialValue={watch("amount")}
          onConfirm={(val) => { setValue("amount", String(val)); setShowCalc(false); }}
          onClose={() => setShowCalc(false)}
        />
      )}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">種別</p>
          <div className="flex gap-6">
            {(["income", "expense"] as TransactionType[]).map((type) => (
              <label key={type} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  value={type}
                  {...register("transaction_type")}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">
                  {type === "income" ? "収入" : "支出"}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            金額 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              {...register("amount", {
                required: "金額を入力してください。",
                validate: {
                  isNumber: (v) => !isNaN(Number(v)) || "金額は数値で入力してください。",
                  min: (v) => Number(v) >= 1 || "金額は1円以上で入力してください。",
                  max: (v) =>
                    Number(v) <= 999_999_999 || "金額は999,999,999円以下で入力してください。",
                },
              })}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="0"
            />
            <span className="text-sm text-gray-600">円</span>
            <button
              type="button"
              onClick={() => setShowCalc(true)}
              className="flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors"
              title="電卓で入力"
            >
              🧮 <span className="text-xs">電卓</span>
            </button>
          </div>
          {errors.amount && (
            <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            カテゴリ <span className="text-red-500">*</span>
          </label>
          <Controller
            name="category_id"
            control={control}
            rules={{ required: "カテゴリを選択してください。" }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">カテゴリを選択</option>
                {currentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.category_id && (
            <p className="mt-1 text-xs text-red-600">{errors.category_id.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            日付 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register("date", { required: "日付を選択してください。" })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          {errors.date && (
            <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            メモ（任意）
          </label>
          <input
            type="text"
            {...register("memo", {
              maxLength: {
                value: 200,
                message: "メモは200文字以内で入力してください。",
              },
            })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="任意"
          />
          {errors.memo && (
            <p className="mt-1 text-xs text-red-600">{errors.memo.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={isSubmitting}
                className="rounded-md border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                削除する
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "保存中..." : initialData ? "更新する" : "登録する"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
