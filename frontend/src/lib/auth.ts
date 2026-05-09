import type { User } from "@/types";

const TOKEN_KEY = "jwt_token";
const USER_KEY = "auth_user";
const SESSION_EXPIRED_KEY = "session_expired";

export function saveAuthData(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  document.cookie = `${TOKEN_KEY}=${token}; path=/; SameSite=Strict`;
}

export function clearAuthData(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Strict`;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
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
