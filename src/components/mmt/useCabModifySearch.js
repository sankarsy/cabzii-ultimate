"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { applyDistanceToTrip, fetchTripDistance } from "../../lib/fetchTripDistance";
import { coordsForPlaceLabel } from "../../lib/indiaCityCoords";
import { todayStr, tripNeedsDrop, tripToSearchQuery } from "../../lib/mmtTrip";
import { addDays } from "../../lib/emt/heroDates";
import { useTodayStr } from "../../lib/useTodayStr";
import { trackEvent } from "../../lib/analytics";

export const TRIP_OPTIONS = [
  { id: "outstation-oneway", label: "Outstation One-Way", tripType: "outstation", roundTrip: false },
  { id: "outstation-round", label: "Outstation Round Trip", tripType: "outstation", roundTrip: true },
  { id: "airport", label: "Airport", tripType: "airport", roundTrip: false },
  { id: "hourly", label: "Hourly", tripType: "hourly", roundTrip: false },
  { id: "local", label: "Local", tripType: "local", roundTrip: false }
];

export function tripOptionId(trip) {
  if (trip?.tripType === "outstation") return trip.roundTrip ? "outstation-round" : "outstation-oneway";
  if (TRIP_OPTIONS.some((o) => o.id === trip?.tripType)) return trip.tripType;
  return "outstation-oneway";
}

export function sheetTitle(option) {
  if (option?.tripType === "airport") return "Airport Taxi";
  if (option?.tripType === "hourly") return "Hourly Rentals";
  if (option?.tripType === "local") return "Local Cabs";
  return "Outstation Cabs";
}

export function shortPlace(value) {
  return String(value || "")
    .split(",")[0]
    .trim();
}

function fillCityCoords(trip) {
  if (!trip.fromLat && trip.from) {
    const hit = coordsForPlaceLabel(trip.from);
    if (hit) {
      trip.fromLat = hit.lat;
      trip.fromLng = hit.lng;
    }
  }
  if (!trip.toLat && trip.to) {
    const hit = coordsForPlaceLabel(trip.to);
    if (hit) {
      trip.toLat = hit.lat;
      trip.toLng = hit.lng;
    }
  }
  return trip;
}

export function useCabModifySearch(initialTrip) {
  const router = useRouter();
  const today = useTodayStr();
  const [optionId, setOptionId] = useState(() => tripOptionId(initialTrip));
  const [pickup, setPickup] = useState(initialTrip?.from || "");
  const [drop, setDrop] = useState(initialTrip?.to || "");
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [packageHours, setPackageHours] = useState(initialTrip?.packageHours || 8);
  const [date, setDate] = useState(initialTrip?.date || "");
  const [returnDate, setReturnDate] = useState("");
  const [time, setTime] = useState(initialTrip?.time || "09:00");
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);

  const option = TRIP_OPTIONS.find((o) => o.id === optionId) || TRIP_OPTIONS[0];
  const needsDrop = tripNeedsDrop(option.tripType);
  const showPackage = option.tripType === "hourly";

  useEffect(() => {
    if (!initialTrip) return;
    setOptionId(tripOptionId(initialTrip));
    setPickup(initialTrip.from || "");
    setDrop(initialTrip.to || "");
    setPackageHours(initialTrip.packageHours || 8);
    setDate(initialTrip.date || todayStr());
    setTime(initialTrip.time || "09:00");
    if (initialTrip.roundTrip) {
      setReturnDate((prev) => prev || addDays(initialTrip.date || todayStr(), 1));
    }
    setFromCoords(
      initialTrip.fromLat != null ? { lat: initialTrip.fromLat, lng: initialTrip.fromLng } : null
    );
    setToCoords(initialTrip.toLat != null ? { lat: initialTrip.toLat, lng: initialTrip.toLng } : null);
  }, [initialTrip]);

  useEffect(() => {
    if (today) setDate((prev) => prev || today);
  }, [today]);

  function setPickupDate(next) {
    setDate(next);
    if (returnDate && next && returnDate < next) setReturnDate(next);
  }

  function setOutstationMode(roundTrip) {
    setOptionId(roundTrip ? "outstation-round" : "outstation-oneway");
    if (roundTrip) {
      setReturnDate((prev) => prev || addDays(date || todayStr(), 1));
    }
  }

  function swapLocations() {
    setPickup(drop);
    setDrop(pickup);
    setFromCoords(toCoords);
    setToCoords(fromCoords);
  }

  async function handleSearch() {
    setError(null);
    const trip = {
      tripType: option.tripType,
      roundTrip: option.roundTrip,
      date,
      time,
      packageHours
    };

    if (!pickup.trim()) {
      setError("Enter pickup location.");
      return false;
    }
    if (needsDrop && !drop.trim()) {
      setError("Enter drop location.");
      return false;
    }

    trip.from = pickup.trim();
    trip.to = needsDrop ? drop.trim() : "";
    if (fromCoords?.lat != null) trip.fromLat = fromCoords.lat;
    if (fromCoords?.lng != null) trip.fromLng = fromCoords.lng;
    if (toCoords?.lat != null) trip.toLat = toCoords.lat;
    if (toCoords?.lng != null) trip.toLng = toCoords.lng;
    fillCityCoords(trip);

    let nextTrip = trip;
    if (needsDrop && trip.from && trip.to) {
      setSearching(true);
      try {
        nextTrip = applyDistanceToTrip(trip, await fetchTripDistance(trip));
      } catch {
        /* results page retries distance */
      } finally {
        setSearching(false);
      }
    }

    trackEvent("search_started", {
      service_type: "cab",
      city: nextTrip.from || "",
      route: [nextTrip.from, nextTrip.to].filter(Boolean).join(" → "),
      cta_location: "cab_results_modify_bar"
    });
    router.push(`/cabs/results?${tripToSearchQuery(nextTrip).toString()}`);
    return true;
  }

  return {
    today,
    optionId,
    setOptionId,
    option,
    pickup,
    setPickup,
    drop,
    setDrop,
    setFromCoords,
    setToCoords,
    packageHours,
    setPackageHours,
    date,
    setDate: setPickupDate,
    returnDate,
    setReturnDate,
    time,
    setTime,
    error,
    searching,
    needsDrop,
    showPackage,
    setOutstationMode,
    swapLocations,
    handleSearch
  };
}
