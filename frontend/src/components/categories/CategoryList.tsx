"use client";

import { useState } from "react";
import type { Category, CategoryType } from "@/types";
import CategoryItem from "./CategoryItem";

type Props = {
  type: CategoryType;
  categories: Category[];
  onAdd: (name: string, type: CategoryType) => Promise<void>;
  onUpdate: (id: number, name: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function CategoryList({ type, categories, onAdd, onUpdate, onDelete }: Props) {
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const label = type === "income" ? "収入カテゴリ" : "支出カテゴリ";

  const handleAdd = async () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setError("カテゴリ名を入力してください。");
      return;
    }
    if (trimmed.length > 20) {
      setError("カテゴリ名は20文字以内で入力してください。");
      return;
    }
    setIsAdding(true);
    setError("");
    try {
      await onAdd(trimmed, type);
      setNewName("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-8 shadow-sm border border-gray-100">
      <h2 className="mb-5 text-lg font-semibold text-gray-700">{label}</h2>

      <div className="divide-y divide-gray-100">
        {categories.map((cat) => (
          <CategoryItem key={cat.id} category={cat} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="新しいカテゴリ名"
          maxLength={20}
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={handleAdd}
          disabled={isAdding}
          className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          追加
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
