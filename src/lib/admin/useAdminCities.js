"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

function cityServices(city) {
  const services = city?.services && typeof city.services === "object" ? city.services : {};
  return {
    cabBooking: services.cabBooking !== false,
    airportTaxi: services.airportTaxi !== false,
    actingDriver: services.actingDriver !== false,
    holidayTrips: services.holidayTrips !== false
  };
}

export function isCityActive(city) {
  return city?.isActive !== false;
}

export function normalizeAdminCity(city) {
  if (!city) return null;
  return {
    ...city,
    _id: String(city._id || city.id || ""),
    name: String(city.name || "").trim(),
    slug: String(city.slug || "").trim().toLowerCase(),
    state: String(city.state || "").trim(),
    services: cityServices(city),
    isActive: isCityActive(city)
  };
}

export function useAdminCities({ token = "", activeOnly = true, service = "" } = {}) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("active", activeOnly ? "1" : "0");
      if (service) params.set("service", service);
      const res = await fetch(`/api/cities?${params.toString()}`, {
        cache: "no-store",
        headers: token ? { authorization: `Bearer ${token}` } : {}
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Could not load cities.");
      }
      setCities((Array.isArray(json?.data) ? json.data : []).map(normalizeAdminCity).filter(Boolean));
    } catch (err) {
      setError(err.message || "Could not load cities.");
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, [token, activeOnly, service]);

  useEffect(() => {
    load();
  }, [load]);

  const options = useMemo(
    () =>
      cities.map((city) => ({
        id: city._id,
        label: city.state ? `${city.name} · ${city.state}` : city.name,
        name: city.name,
        slug: city.slug,
        value: city.slug,
        city
      })),
    [cities]
  );

  return { cities, options, loading, error, reload: load };
}
