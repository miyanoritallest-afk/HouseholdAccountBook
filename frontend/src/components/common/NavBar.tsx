"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { href: "/home", label: "ホーム" },
  { href: "/reports", label: "レポート" },
  { href: "/categories", label: "カテゴリ" },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <span className="text-lg font-bold text-gray-800">家計簿アプリ</span>
        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="ml-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            ログアウト
          </button>
        </nav>
      </div>
    </header>
  );
}
