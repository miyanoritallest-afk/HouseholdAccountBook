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
    <header className="bg-gradient-to-r from-blue-700 to-blue-500 shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <span className="text-lg font-bold tracking-wide text-white">
          💰 家計簿
        </span>
        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? "bg-white/20 text-white"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="ml-2 rounded-md px-3 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white transition-colors"
          >
            ログアウト
          </button>
        </nav>
      </div>
    </header>
  );
}
