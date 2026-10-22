"use client";

import { useCallback, useEffect, useState } from "react";
import { locateUserCityOnce } from "./locateUserCity";
import { readSelectedCity, writeSelectedCity } from "./locationPriority";

export function useSelectedCity() {
  const [city, setCity] = useState("");
  const [locating, setLocating] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setCity(readSelectedCity());

    locateUserCityOnce().then((geoCity) => {
      if (cancelled) return;
      if (geoCity) {
        writeSelectedCity(geoCity);
        setCity(geoCity);
      } else {
        setCity(readSelectedCity());
      }
      setLocating(false);
    });

    const onChange = (e) => {
      setCity(e.detail?.city || readSelectedCity());
    };
    const onStorage = (e) => {
      if (e.key === "cabzii-selected-location") {
        setCity(readSelectedCity());
      }
    };
    const onServiceArea = () => setCity(readSelectedCity());

    window.addEventListener("cabzii-city-change", onChange);
    window.addEventListener("cabzii-service-area-change", onServiceArea);
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener("cabzii-city-change", onChange);
      window.removeEventListener("cabzii-service-area-change", onServiceArea);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setSelectedCity = useCallback((value) => {
    writeSelectedCity(value);
    setCity(readSelectedCity());
  }, []);

  return { city, locating, setSelectedCity };
}
