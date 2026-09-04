"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appNavItems } from "@/components/layout/appNavItems";
import { CloseIcon, LogOutIcon } from "@/components/icons";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AppMobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-base font-semibold tracking-tight">MediVoice</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-500 hover:bg-muted-100"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="mt-2 space-y-1" aria-label="Application, expanded menu">
          {appNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                  isActive ? "bg-primary-50 text-primary-700" : "text-muted-500 hover:bg-muted-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="my-3 h-px bg-muted-200" />

        <Link
          href="/app/profile"
          onClick={onClose}
          className="block rounded-xl px-3 py-2.5 text-sm font-medium text-muted-500 hover:bg-muted-100"
        >
          Profile
        </Link>
        <Link
          href="/app/settings"
          onClick={onClose}
          className="block rounded-xl px-3 py-2.5 text-sm font-medium text-muted-500 hover:bg-muted-100"
        >
          Settings
        </Link>
        <button
          type="button"
          onClick={() => {
            onClose();
            logout();
          }}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-accent-700 hover:bg-accent-100/60"
        >
          <LogOutIcon className="h-4 w-4" /> Log out
        </button>
      </div>
    </div>
  );
}
