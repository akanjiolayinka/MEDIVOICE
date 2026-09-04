"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { useAuth } from "@/components/auth/AuthProvider";
import { LogOutIcon } from "@/components/icons";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-primary-600" : "bg-muted-200"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-muted-200 bg-white p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function SettingsRow({ label, description }: { label: string; description?: string }) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      {description && <p className="text-xs text-muted-500">{description}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(false);
  const [shareAnonymizedData, setShareAnonymizedData] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Don't also push a route here — AppShellLayout's own effect redirects
  // to /login as soon as `user` becomes null, and racing an explicit push
  // against that effect produced an inconsistent landing URL.
  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <Container className="max-w-2xl py-10">
      <h1 className="text-xl font-semibold tracking-tight">Settings</h1>

      <div className="mt-6 space-y-5">
        <SettingsSection title="Account">
          <div className="flex items-center justify-between">
            <SettingsRow label="Email" description={user.email} />
            <Link href="/app/profile" className="text-sm font-medium text-primary-700">
              Edit
            </Link>
          </div>
        </SettingsSection>

        <SettingsSection title="Language">
          <div className="flex items-center justify-between">
            <SettingsRow label="Preferred language" description={user.preferredLanguage} />
            <Link href="/app/language" className="text-sm font-medium text-primary-700">
              Manage
            </Link>
          </div>
        </SettingsSection>

        <SettingsSection title="Voice">
          <div className="flex items-center justify-between">
            <SettingsRow
              label="Auto-play responses"
              description="Play MediVoice's spoken replies automatically"
            />
            <Toggle
              checked={user.voicePreferences.autoPlayResponses}
              onChange={() => router.push("/app/language")}
            />
          </div>
        </SettingsSection>

        <SettingsSection title="Notifications">
          <div className="flex items-center justify-between">
            <SettingsRow label="Email notifications" description="Consultation summaries and updates" />
            <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <SettingsRow label="Reminders" description="Follow-up reminders after a consultation" />
            <Toggle checked={reminderNotifications} onChange={setReminderNotifications} />
          </div>
        </SettingsSection>

        <SettingsSection title="Privacy">
          <div className="flex items-center justify-between">
            <SettingsRow
              label="Share anonymized data for research"
              description="Helps improve MediVoice's speech and safety models"
            />
            <Toggle checked={shareAnonymizedData} onChange={setShareAnonymizedData} />
          </div>
          <Link href="/privacy" className="inline-block text-sm font-medium text-primary-700">
            Read privacy policy →
          </Link>
        </SettingsSection>

        <SettingsSection title="Accessibility">
          <div className="flex items-center justify-between">
            <SettingsRow label="Reduce motion" description="Minimize animations across the app" />
            <Toggle checked={reducedMotion} onChange={setReducedMotion} />
          </div>
          <div className="flex items-center justify-between">
            <SettingsRow label="High contrast" description="Increase contrast for readability" />
            <Toggle checked={highContrast} onChange={setHighContrast} />
          </div>
        </SettingsSection>

        <SettingsSection title="About MediVoice">
          <p className="text-sm text-muted-500">
            MediVoice provides informational guidance and healthcare navigation support. It does
            not diagnose medical conditions or replace a qualified healthcare professional.
          </p>
          <div className="flex gap-4 text-sm font-medium text-primary-700">
            <Link href="/how-it-works">How it works</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </SettingsSection>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-accent-600/40 bg-accent-100/40 px-5 py-3 text-sm font-medium text-accent-700 hover:bg-accent-100"
        >
          <LogOutIcon className="h-4 w-4" /> Log out
        </button>
      </div>
    </Container>
  );
}
