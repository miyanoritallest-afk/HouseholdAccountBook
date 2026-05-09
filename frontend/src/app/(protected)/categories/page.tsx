"use client";

import { useCategories } from "@/hooks/useCategories";
import CategoryList from "@/components/categories/CategoryList";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import type { CategoryType } from "@/types";

export default function CategoriesPage() {
  const { categories, isLoading, error, create, update, remove } = useCategories();

  const handleAdd = (name: string, type: CategoryType) => create(name, type);
  const handleUpdate = (id: number, name: string) => update(id, name);
  const handleDelete = (id: number) => remove(id);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">カテゴリ管理</h1>
      {error && <ErrorMessage messages={[error]} />}
      <CategoryList
        type="expense"
        categories={categories.expense}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
      <CategoryList
        type="income"
        categories={categories.income}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
