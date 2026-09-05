"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import FacilityCard from "@/components/facilities/FacilityCard";
import { SearchIcon, MapPinIcon } from "@/components/icons";
import { mockSearchFacilities } from "@/services/mockFacilityService";
import type { FacilityType, MockFacility } from "@/lib/mock/facilities";

const TYPE_FILTERS: { label: string; value: FacilityType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Hospital", value: "hospital" },
  { label: "Clinic", value: "clinic" },
  { label: "Pharmacy", value: "pharmacy" },
];

export default function FacilitiesPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<FacilityType | "all">("all");
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [facilities, setFacilities] = useState<MockFacility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Standard fetch-on-dependency-change pattern: reset to loading each
    // time the search filters change, not just on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    mockSearchFacilities({ query, type, openNowOnly }).then((results) => {
      if (!cancelled) {
        setFacilities(results);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [query, type, openNowOnly]);

  return (
    <Container className="max-w-3xl py-10">
      <h1 className="text-xl font-semibold tracking-tight">Find Healthcare</h1>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-500">
        <MapPinIcon className="h-4 w-4" /> Yaba, Lagos
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a hospital, clinic or pharmacy"
            className="w-full rounded-xl border border-muted-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {TYPE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setType(filter.value)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                type === filter.value
                  ? "border-primary-600 bg-primary-50 text-primary-700"
                  : "border-muted-200 text-muted-500 hover:border-primary-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOpenNowOnly((v) => !v)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              openNowOnly
                ? "border-primary-600 bg-primary-50 text-primary-700"
                : "border-muted-200 text-muted-500 hover:border-primary-200"
            }`}
          >
            Open now
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-500">Searching…</p>
        ) : facilities.length === 0 ? (
          <p className="rounded-2xl border border-muted-200 bg-white p-6 text-center text-sm text-muted-500">
            No facilities matched your search.
          </p>
        ) : (
          facilities.map((facility) => <FacilityCard key={facility.id} facility={facility} />)
        )}
      </div>
    </Container>
  );
}
