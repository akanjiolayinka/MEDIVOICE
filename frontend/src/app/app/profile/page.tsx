"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import ConsultationCard from "@/components/history/ConsultationCard";
import { useAuth } from "@/components/auth/AuthProvider";
import { getAllConsultations, type ConsultationRecord } from "@/lib/mock/consultations";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsultations(getAllConsultations().slice(0, 2));
  }, []);

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  const handleSave = () => {
    updateUser({ firstName: firstName || user.firstName, lastName: lastName || user.lastName });
    setIsEditing(false);
  };

  return (
    <Container className="max-w-2xl py-10">
      <h1 className="text-xl font-semibold tracking-tight">Profile</h1>

      <div className="mt-6 rounded-2xl border border-muted-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-lg font-semibold text-white">
            {initials}
          </span>
          {isEditing ? (
            <div className="flex flex-1 flex-col gap-2 sm:flex-row">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-muted-200 px-3 py-2 text-sm sm:w-32"
                placeholder="First name"
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-muted-200 px-3 py-2 text-sm sm:w-32"
                placeholder="Last name"
              />
            </div>
          ) : (
            <div>
              <p className="font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted-500">{user.email}</p>
            </div>
          )}

          <div className="ml-auto">
            {isEditing ? (
              <Button onClick={handleSave} className="px-4 py-2 text-sm">
                Save
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm">
                Edit profile
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-muted-200 pt-6 text-sm sm:grid-cols-3">
          <div>
            <p className="text-muted-500">Preferred language</p>
            <p className="mt-1 font-medium">{user.preferredLanguage}</p>
          </div>
          <div>
            <p className="text-muted-500">Voice</p>
            <p className="mt-1 font-medium capitalize">{user.voicePreferences.voice.replace("-", " ")}</p>
          </div>
          <div>
            <p className="text-muted-500">Age range</p>
            <p className="mt-1 font-medium">{user.ageRange || "Not specified"}</p>
          </div>
        </div>

        <Link
          href="/app/language"
          className="mt-4 inline-block text-sm font-medium text-primary-700 hover:text-primary-900"
        >
          Manage language &amp; voice →
        </Link>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent consultations</h2>
          <Link href="/app/history" className="text-sm font-medium text-primary-700 hover:text-primary-900">
            View all
          </Link>
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {consultations.map((c) => (
            <ConsultationCard key={c.id} consultation={c} />
          ))}
        </div>
      </div>
    </Container>
  );
}
