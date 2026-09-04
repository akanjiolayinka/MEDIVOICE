"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { BellIcon, ChevronDownIcon, LogOutIcon, MenuIcon, SettingsIcon, UserIcon } from "@/components/icons";

const mockNotifications = [
  { id: "n1", text: "Your consultation summary is ready to view.", time: "2h ago" },
  { id: "n2", text: "New healthcare facilities added near Yaba, Lagos.", time: "1d ago" },
];

export default function AppHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : "?";

  // Don't also push a route here — clearing the session re-renders
  // AppShellLayout, whose own effect redirects to /login as soon as
  // `user` becomes null. Racing our own router.push against that effect
  // was landing on an inconsistent URL depending on which won.
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-muted-200 bg-background px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted-500 hover:bg-muted-100 hover:text-foreground lg:hidden"
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>

      <span className="text-sm font-medium text-muted-500 lg:hidden">MediVoice</span>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((v) => !v)}
            className="rounded-full p-2 text-muted-500 hover:bg-muted-100 hover:text-foreground"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
          >
            <BellIcon />
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-muted-200 bg-white p-2 shadow-lg">
              <p className="px-2 py-1 text-xs font-medium text-muted-500">Notifications</p>
              {mockNotifications.map((n) => (
                <div key={n.id} className="rounded-xl px-2 py-2 hover:bg-muted-100">
                  <p className="text-sm">{n.text}</p>
                  <p className="text-xs text-muted-500">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-muted-100"
            aria-expanded={profileOpen}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
              {initials}
            </span>
            <ChevronDownIcon className="hidden h-4 w-4 text-muted-500 sm:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-muted-200 bg-white p-2 shadow-lg">
              <p className="truncate px-3 py-2 text-sm font-medium">
                {user ? `${user.firstName} ${user.lastName}` : "Guest"}
              </p>
              <p className="truncate px-3 pb-2 text-xs text-muted-500">{user?.email}</p>
              <div className="my-1 h-px bg-muted-200" />
              <Link
                href="/app/profile"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-muted-100"
                onClick={() => setProfileOpen(false)}
              >
                <UserIcon className="h-4 w-4" /> Profile
              </Link>
              <Link
                href="/app/settings"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-muted-100"
                onClick={() => setProfileOpen(false)}
              >
                <SettingsIcon className="h-4 w-4" /> Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-accent-700 hover:bg-accent-100/60"
              >
                <LogOutIcon className="h-4 w-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
