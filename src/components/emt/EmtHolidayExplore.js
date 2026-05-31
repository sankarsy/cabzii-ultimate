"use client";

import EmtHolidayThemes, { useHomeHolidayPackages } from "./EmtHolidayThemes";
import EmtPopularDestinations from "./EmtPopularDestinations";

export default function EmtHolidayExplore() {
  const { packages, loading } = useHomeHolidayPackages();

  return (
    <>
      <EmtHolidayThemes />
      <EmtPopularDestinations packages={packages} loading={loading} />
    </>
  );
}
