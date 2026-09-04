"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appNavItems } from "@/components/layout/appNavItems";

export default function AppMobileNav() {
  const pathname = usePathname();
  const items = appNavItems.filter((item) => item.showInMobileBar);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-muted-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Application, compact"
    >
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        const isMic = item.href === "/app/consultation";

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium ${
              isActive ? "text-primary-700" : "text-muted-500"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {isMic ? (
              <span
                className={`-mt-5 flex h-12 w-12 items-center justify-center rounded-full shadow-md ${
                  isActive ? "bg-primary-700" : "bg-primary-600"
                } text-white`}
              >
                <Icon className="h-6 w-6" />
              </span>
            ) : (
              <Icon className="h-5 w-5" />
            )}
            <span className={isMic ? "-mt-1" : undefined}>
              {item.href === "/app/consultation" ? "Speak" : item.label.split(" ")[0]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
