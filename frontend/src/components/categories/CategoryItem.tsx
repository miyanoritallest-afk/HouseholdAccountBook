"use client";

import { useState } from "react";
import type { Category } from "@/types";
import ConfirmDialog from "@/components/common/ConfirmDialog";

type Props = {
  category: Category;
  onUpdate: (id: number, name: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function CategoryItem({ category, onUpdate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("カテゴリ名を入力してください。");
      return;
    }
    if (trimmed.length > 20) {
      setError("カテゴリ名は20文字以内で入力してください。");
      return;
    }
    setIsSaving(true);
    try {
      await onUpdate(category.id, trimmed);
      setIsEditing(false);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(category.id);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 py-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
        >
          保存
        </button>
        <button
          onClick={() => { setIsEditing(false); setName(category.name); setError(""); }}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
        >
          キャンセル
        </button>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-700">{category.name}</span>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
          >
            編集
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="rounded-md border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
          >
            削除
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-red-600 pb-1">{error}</p>}
      <ConfirmDialog
        isOpen={showConfirm}
        message={`「${category.name}」を削除しますか？収支データが紐づいている場合は削除できません。`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
