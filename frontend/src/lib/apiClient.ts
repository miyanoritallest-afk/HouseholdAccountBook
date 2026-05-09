import axios from "axios";
import { getToken, clearAuthData, setSessionExpiredMessage } from "@/lib/auth";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error("通信エラーが発生しました。ネットワーク接続を確認してください。")
      );
    }

    const { status, data } = error.response;

    if (status === 401) {
      clearAuthData();
      setSessionExpiredMessage();
      window.location.href = "/login";
      return Promise.reject(new Error("セッションの有効期限が切れました。再度ログインしてください。"));
    }

    if (status === 403) {
      return Promise.reject(new Error("アクセス権限がありません。"));
    }

    if (status === 404) {
      return Promise.reject(new Error("データが見つかりませんでした。"));
    }

    if (status === 400 || status === 422) {
      const messages: string[] = data?.errors ?? [data?.error ?? "入力内容に誤りがあります。"];
      const err = new Error(messages[0]) as Error & { errors: string[] };
      err.errors = messages;
      return Promise.reject(err);
    }

    return Promise.reject(
      new Error("システムエラーが発生しました。しばらく経ってから再度お試しください。")
    );
  }
);

export default apiClient;
