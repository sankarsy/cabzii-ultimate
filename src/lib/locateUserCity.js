import { nearestCityFromCoords } from "./indiaCityCoords";

const GEO_ONCE_KEY = "cabzii-geo-city-once";
const GEO_CITY_KEY = "cabzii-geo-city-name";

let inflight = null;

function readCachedGeoCity() {
  try {
    return sessionStorage.getItem(GEO_CITY_KEY) || null;
  } catch {
    return null;
  }
}

/**
 * Ask for location once per tab session (getCurrentPosition, not watch).
 * Returns a city name or null. Does not keep tracking the user.
 */
export function locateUserCityOnce() {
  if (typeof window === "undefined") return Promise.resolve(null);
  try {
    if (sessionStorage.getItem(GEO_ONCE_KEY) === "done") {
      return Promise.resolve(readCachedGeoCity());
    }
  } catch {
    /* private mode */
  }
  if (inflight) return inflight;

  inflight = new Promise((resolve) => {
    const finish = (city) => {
      try {
        sessionStorage.setItem(GEO_ONCE_KEY, "done");
        if (city) sessionStorage.setItem(GEO_CITY_KEY, city);
      } catch {
        /* ignore */
      }
      resolve(city || null);
    };

    if (!navigator.geolocation) {
      finish(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const hit = nearestCityFromCoords(pos.coords.latitude, pos.coords.longitude);
        finish(hit?.name || null);
      },
      () => finish(readCachedGeoCity()),
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 30 * 60 * 1000
      }
    );
  });

  return inflight;
}
