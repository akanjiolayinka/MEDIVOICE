"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import FeatureCard from "@/components/dashboard/FeatureCard";
import ConsultationCard from "@/components/history/ConsultationCard";
import { useAuth } from "@/components/auth/AuthProvider";
import { getAllConsultations, type ConsultationRecord } from "@/lib/mock/consultations";
import { MicIcon, ActivityIcon, MapPinIcon, ClockIcon, GlobeIcon } from "@/components/icons";

const features = [
  {
    icon: MicIcon,
    title: "Voice Consultation",
    description: "Describe how you're feeling naturally using your voice.",
    buttonLabel: "Start consultation",
    href: "/app/consultation",
  },
  {
    icon: ActivityIcon,
    title: "Symptom Triage",
    description: "Understand how urgently you may need professional care.",
    buttonLabel: "Check symptoms",
    href: "/app/triage",
  },
  {
    icon: MapPinIcon,
    title: "Find Healthcare",
    description: "Find healthcare facilities near your location.",
    buttonLabel: "Find a facility",
    href: "/app/facilities",
  },
  {
    icon: ClockIcon,
    title: "Consultation Summary",
    description: "Review your recent consultation information.",
    buttonLabel: "View summary",
    href: "/app/history",
  },
  {
    icon: GlobeIcon,
    title: "Language & Voice",
    description: "Speak naturally using supported African languages and code-switching.",
    buttonLabel: "Manage language",
    href: "/app/language",
  },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [recent, setRecent] = useState<ConsultationRecord[]>([]);

  useEffect(() => {
    // Deferred to an effect, not a lazy initializer, so a statically
    // prerendered page doesn't hydration-mismatch against localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecent(getAllConsultations().slice(0, 3));
  }, []);

  return (
    <Container className="max-w-5xl py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {getGreeting()}, {user?.firstName ?? "there"}.
          </h1>
          <p className="mt-1 text-muted-500">How can MediVoice help you today?</p>
        </div>
        <Button href="/app/consultation" className="shrink-0">
          Start a Voice Consultation
        </Button>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent activity</h2>
          <a href="/app/history" className="text-sm font-medium text-primary-700 hover:text-primary-900">
            View all
          </a>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((consultation) => (
            <ConsultationCard key={consultation.id} consultation={consultation} />
          ))}
        </div>
      </div>
    </Container>
  );
}
