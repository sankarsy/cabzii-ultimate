"use client";

import { useEffect, useState } from "react";
import { todayStr } from "./istDate";
import { formatDayName, formatEmtDate } from "./emt/heroDates";

export function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

/**
 * Empty on the server and on the first client paint, then IST today.
 * Avoids 27 Aug vs 28 Aug hydration crashes around midnight.
 */
export function useTodayStr() {
  const mounted = useHasMounted();
  return mounted ? todayStr() : "";
}

/** Date label that never hydrates a live calendar string. */
export function HydrateSafeDate({
  iso,
  as: Tag = "p",
  className,
  empty = "\u00a0",
  weekday = false
}) {
  const mounted = useHasMounted();
  const formatted = weekday ? formatDayName(iso) : formatEmtDate(iso);
  const text = mounted && formatted ? formatted : empty;
  return (
    <Tag suppressHydrationWarning className={className}>
      {text}
    </Tag>
  );
}
