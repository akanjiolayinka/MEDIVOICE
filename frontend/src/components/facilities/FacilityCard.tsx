"use client";

import { useState } from "react";
import type { MockFacility } from "@/lib/mock/facilities";
import Badge from "@/components/ui/Badge";

const TYPE_LABELS: Record<MockFacility["type"], string> = {
  hospital: "Hospital",
  clinic: "Clinic",
  pharmacy: "Pharmacy",
};

export default function FacilityCard({ facility }: { facility: MockFacility }) {
  const [expanded, setExpanded] = useState(false);
  const [showDirectionsNote, setShowDirectionsNote] = useState(false);

  return (
    <div className="rounded-2xl border border-muted-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">{facility.name}</h3>
          <p className="mt-0.5 text-xs text-muted-500">
            {TYPE_LABELS[facility.type]} · {facility.distanceKm.toFixed(1)} km away
          </p>
        </div>
        <Badge tone={facility.isOpenNow ? "primary" : "neutral"}>
          {facility.isOpenNow ? "Open now" : "Closed"}
        </Badge>
      </div>

      <p className="mt-3 text-sm text-muted-500">{facility.address}</p>

      {expanded && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {facility.services.map((service) => (
            <li
              key={service}
              className="rounded-full border border-muted-200 px-2.5 py-1 text-xs text-muted-500"
            >
              {service}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-sm font-medium text-primary-700 hover:text-primary-900"
        >
          {expanded ? "Hide details" : "View details"}
        </button>
        <button
          type="button"
          onClick={() => setShowDirectionsNote(true)}
          className="text-sm font-medium text-primary-700 hover:text-primary-900"
        >
          Get directions
        </button>
      </div>

      {showDirectionsNote && (
        <p className="mt-2 text-xs text-muted-500">
          Directions aren&rsquo;t available in this demo yet — this will open real directions once a
          maps provider is connected.
        </p>
      )}
    </div>
  );
}
