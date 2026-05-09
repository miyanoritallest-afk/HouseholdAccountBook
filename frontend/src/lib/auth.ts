import type { User } from "@/types";

const TOKEN_KEY = "jwt_token";
const USER_KEY = "auth_user";
const EXPIRY_KEY = "token_expiry";

const SESSION_EXPIRED_KEY = "session_expired";

export function saveAuthData(token: string, user: User): void {
  const expiry = Date.now() + 24 * 60 * 60 * 1000;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(EXPIRY_KEY, String(expiry));
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${24 * 60 * 60}`;
}

export function clearAuthData(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXPIRY_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

export function getToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(EXPIRY_KEY);
  if (!token || !expiry) return null;
  if (Date.now() > Number(expiry)) {
    clearAuthData();
    return null;
  }
  return token;
}

export function getUser(): User | null {
  if (!getToken()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setSessionExpiredMessage(): void {
  sessionStorage.setItem(SESSION_EXPIRED_KEY, "1");
}

export function consumeSessionExpiredMessage(): boolean {
  const flag = sessionStorage.getItem(SESSION_EXPIRED_KEY);
  sessionStorage.removeItem(SESSION_EXPIRED_KEY);
  return flag === "1";
}
