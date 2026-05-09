"use client";

import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/apiClient";
import type { CategoriesResponse, CategoryType } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<CategoriesResponse>({ income: [], expense: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<CategoriesResponse>("/api/v1/categories");
      setCategories(res.data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = async (name: string, category_type: CategoryType) => {
    await apiClient.post("/api/v1/categories", { category: { name, category_type } });
    await fetch();
  };

  const update = async (id: number, name: string) => {
    await apiClient.put(`/api/v1/categories/${id}`, { category: { name } });
    await fetch();
  };

  const remove = async (id: number) => {
    await apiClient.delete(`/api/v1/categories/${id}`);
    await fetch();
  };

  return { categories, isLoading, error, refetch: fetch, create, update, remove };
}
