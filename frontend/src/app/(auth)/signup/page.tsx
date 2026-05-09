"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import ErrorMessage from "@/components/common/ErrorMessage";

type FormValues = {
  email: string;
  password: string;
};

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setErrors([]);
    setIsSubmitting(true);
    try {
      await signup(data.email, data.password);
      router.push("/home");
    } catch (e) {
      const err = e as Error & { errors?: string[] };
      setErrors(err.errors ?? [err.message ?? "登録に失敗しました。"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-8 shadow-md">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">ユーザー登録</h2>

      <ErrorMessage messages={errors} />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <input
            type="email"
            {...register("email", {
              required: "メールアドレスを入力してください。",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "正しいメールアドレス形式で入力してください。",
              },
            })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="example@email.com"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            パスワード（8文字以上）
          </label>
          <input
            type="password"
            {...register("password", {
              required: "パスワードを入力してください。",
              minLength: {
                value: 8,
                message: "パスワードは8文字以上で入力してください。",
              },
            })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="8文字以上"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "登録中..." : "登録する"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          ログインはこちら
        </Link>
      </p>
    </div>
  );
}
