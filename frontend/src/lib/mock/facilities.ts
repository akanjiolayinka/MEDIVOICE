export type FacilityType = "hospital" | "clinic" | "pharmacy";

export interface MockFacility {
  id: string;
  name: string;
  type: FacilityType;
  distanceKm: number;
  isOpenNow: boolean;
  address: string;
  services: string[];
}

// MOCK data — never present these as real facilities. Structured so a
// real maps/places provider (master build prompt §17) can be swapped in
// later behind services/mockFacilityService.ts's searchFacilities() call
// without changing anything above it.
export const mockFacilities: MockFacility[] = [
  {
    id: "fac-1",
    name: "Yaba General Hospital",
    type: "hospital",
    distanceKm: 0.8,
    isOpenNow: true,
    address: "12 Herbert Macaulay Way, Yaba, Lagos",
    services: ["Emergency care", "General medicine", "Laboratory"],
  },
  {
    id: "fac-2",
    name: "Greenline Family Clinic",
    type: "clinic",
    distanceKm: 1.2,
    isOpenNow: true,
    address: "5 Commercial Avenue, Yaba, Lagos",
    services: ["General consultation", "Vaccinations", "Antenatal care"],
  },
  {
    id: "fac-3",
    name: "MedPlus Pharmacy",
    type: "pharmacy",
    distanceKm: 0.5,
    isOpenNow: true,
    address: "23 Herbert Macaulay Way, Yaba, Lagos",
    services: ["Prescription drugs", "Over-the-counter medication", "Health screening"],
  },
  {
    id: "fac-4",
    name: "St. Damian Medical Centre",
    type: "clinic",
    distanceKm: 2.1,
    isOpenNow: false,
    address: "8 Sabo Road, Yaba, Lagos",
    services: ["General consultation", "Minor surgery", "Diagnostics"],
  },
  {
    id: "fac-5",
    name: "Lagoon Specialist Hospital",
    type: "hospital",
    distanceKm: 3.4,
    isOpenNow: true,
    address: "18 Apapa Road, Ebute Metta, Lagos",
    services: ["Emergency care", "Cardiology", "Pediatrics"],
  },
  {
    id: "fac-6",
    name: "HealthFirst Pharmacy",
    type: "pharmacy",
    distanceKm: 1.7,
    isOpenNow: false,
    address: "44 Adekunle Street, Yaba, Lagos",
    services: ["Prescription drugs", "Home delivery"],
  },
];

export interface FacilitySearchFilters {
  query?: string;
  type?: FacilityType | "all";
  openNowOnly?: boolean;
}

export function filterMockFacilities(filters: FacilitySearchFilters): MockFacility[] {
  const query = (filters.query ?? "").trim().toLowerCase();

  return mockFacilities
    .filter((facility) => (filters.type && filters.type !== "all" ? facility.type === filters.type : true))
    .filter((facility) => (filters.openNowOnly ? facility.isOpenNow : true))
    .filter((facility) =>
      query
        ? facility.name.toLowerCase().includes(query) ||
          facility.services.some((service) => service.toLowerCase().includes(query))
        : true,
    )
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
