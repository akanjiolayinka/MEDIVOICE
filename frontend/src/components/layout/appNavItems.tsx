import {
  HomeIcon,
  MicIcon,
  ClockIcon,
  ActivityIcon,
  MapPinIcon,
  GlobeIcon,
  BarChartIcon,
} from "@/components/icons";
import type { ComponentType } from "react";

export interface AppNavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** Shown in the compact mobile bottom bar (keep this list short). */
  showInMobileBar?: boolean;
}

export const appNavItems: AppNavItem[] = [
  { href: "/app", label: "Dashboard", icon: HomeIcon, showInMobileBar: true },
  { href: "/app/consultation", label: "Voice Consultation", icon: MicIcon, showInMobileBar: true },
  { href: "/app/triage", label: "Symptoms / Triage", icon: ActivityIcon },
  { href: "/app/facilities", label: "Find Healthcare", icon: MapPinIcon, showInMobileBar: true },
  { href: "/app/history", label: "History", icon: ClockIcon, showInMobileBar: true },
  { href: "/app/language", label: "Language & Voice", icon: GlobeIcon },
  { href: "/app/research", label: "Research", icon: BarChartIcon },
];
