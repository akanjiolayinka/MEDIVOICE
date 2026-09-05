"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "@/components/layout/Container";
import ConsultationCard from "@/components/history/ConsultationCard";
import { SearchIcon } from "@/components/icons";
import { getAllConsultations, type ConsultationRecord } from "@/lib/mock/consultations";

type SortOrder = "newest" | "oldest";

export default function HistoryPage() {
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [query, setQuery] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<"all" | ConsultationRecord["triageUrgency"]>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsultations(getAllConsultations());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return consultations
      .filter((c) => (urgencyFilter === "all" ? true : c.triageUrgency === urgencyFilter))
      .filter((c) => (q ? c.mainConcern.toLowerCase().includes(q) : true))
      .sort((a, b) => {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortOrder === "newest" ? -diff : diff;
      });
  }, [consultations, query, urgencyFilter, sortOrder]);

  return (
    <Container className="max-w-3xl py-10">
      <h1 className="text-xl font-semibold tracking-tight">Conversation History</h1>
      <p className="mt-1 text-sm text-muted-500">Review your past consultations with MediVoice.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search past consultations"
            className="w-full rounded-xl border border-muted-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <select
          value={urgencyFilter}
          onChange={(e) => setUrgencyFilter(e.target.value as typeof urgencyFilter)}
          className="rounded-xl border border-muted-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
        >
          <option value="all">All urgency</option>
          <option value="routine">Self-care / Monitor</option>
          <option value="prompt">Prompt attention</option>
          <option value="emergency">Emergency</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          className="rounded-xl border border-muted-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered.length === 0 ? (
          <p className="col-span-full rounded-2xl border border-muted-200 bg-white p-8 text-center text-sm text-muted-500">
            {consultations.length === 0
              ? "You haven't had a consultation yet. Start one from the dashboard to see it here."
              : "No consultations match your search."}
          </p>
        ) : (
          filtered.map((consultation) => (
            <ConsultationCard key={consultation.id} consultation={consultation} />
          ))
        )}
      </div>
    </Container>
  );
}
