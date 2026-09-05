"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Container from "@/components/layout/Container";
import ConsultationSummary from "@/components/summary/ConsultationSummary";
import { getConsultationById, type ConsultationRecord } from "@/lib/mock/consultations";

export default function ConsultationSummaryPage() {
  const params = useParams<{ id: string }>();
  const [record, setRecord] = useState<ConsultationRecord | null | undefined>(undefined);

  useEffect(() => {
    // Deferred to an effect — reads localStorage, so it must run after
    // hydration to avoid mismatching the static server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecord(getConsultationById(params.id) ?? null);
  }, [params.id]);

  if (record === undefined) {
    return <Container className="max-w-2xl py-16 text-sm text-muted-500">Loading summary…</Container>;
  }

  if (record === null) {
    return (
      <Container className="max-w-2xl py-16 text-center">
        <p className="text-sm text-muted-500">We couldn&rsquo;t find that consultation.</p>
        <Link href="/app/history" className="mt-3 inline-block text-sm font-medium text-primary-700">
          Back to history
        </Link>
      </Container>
    );
  }

  return (
    <Container className="max-w-2xl py-10">
      <Link href="/app/history" className="text-sm font-medium text-primary-700 hover:text-primary-900">
        ← Back to history
      </Link>
      <div className="mt-4">
        <ConsultationSummary record={record} />
      </div>
    </Container>
  );
}
