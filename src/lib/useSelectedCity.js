"use client";

import { useCallback, useEffect, useState } from "react";
import { readSelectedCity, writeSelectedCity } from "./locationPriority";

export function useSelectedCity() {
  const [city, setCity] = useState("Chennai");

  useEffect(() => {
    setCity(readSelectedCity());

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
      window.removeEventListener("cabzii-city-change", onChange);
      window.removeEventListener("cabzii-service-area-change", onServiceArea);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setSelectedCity = useCallback((value) => {
    writeSelectedCity(value);
    setCity(readSelectedCity());
  }, []);

  return { city, setSelectedCity };
}
