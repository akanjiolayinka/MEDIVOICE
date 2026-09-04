import { delay } from "@/lib/mock/delay";
import { filterMockFacilities, type FacilitySearchFilters, type MockFacility } from "@/lib/mock/facilities";

/**
 * FEATURE: Healthcare facility search.
 * CURRENT: mock — filters a small hard-coded facility list.
 * FUTURE: replace with a real maps/places provider integration behind
 * backend/app/services/facilities/ (see Phase 9 in the backend README).
 * Never present these results as real facilities.
 */
export async function mockSearchFacilities(filters: FacilitySearchFilters): Promise<MockFacility[]> {
  await delay(500);
  return filterMockFacilities(filters);
}
