"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appNavItems } from "@/components/layout/appNavItems";

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-muted-200 bg-white/60 lg:flex lg:flex-col">
      <Link href="/app" className="flex h-16 items-center px-6 text-base font-semibold tracking-tight">
        MediVoice
      </Link>

      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Application">
        {appNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-muted-500 hover:bg-muted-100 hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-muted-200 p-4">
        <p className="text-xs text-muted-500">
          MediVoice provides informational guidance and does not replace professional medical advice.
        </p>
      </div>
    </aside>
  );
}
