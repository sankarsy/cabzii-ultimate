"use client";

import { useEffect, useState } from "react";
import MmtCabResultCard from "../mmt/MmtCabResultCard";
import MmtHomeCatalogSection, { MmtHomeCatalogScroll, MmtHomeCatalogScrollItem } from "../mmt/MmtHomeCatalogSection";
import { extractCabList, fetchJson } from "../../lib/apiClient";
import { sortBySelectedCity } from "../../lib/locationPriority";
import { DEFAULT_HQ_CITY } from "../../lib/vehicleAdminConfig";
import { HOME_CABS_FETCH, HOME_CABS_LIMIT, sortCabsForHome } from "../../lib/homeFleetSort";

const HOME_FLEET_SUBTITLE = `Sedan, hatchback, MPV & SUV taxi cars · ${DEFAULT_HQ_CITY}`;

/** Client fallback when this host cannot seed cabs during SSR. */
export default function HomeFleetLoader() {
  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const q = new URLSearchParams({
      limit: String(HOME_CABS_FETCH),
      page: "1"
    });
    fetchJson(`/api/cabs?${q}`)
      .then((json) => {
        if (cancelled) return;
        const list = sortCabsForHome(sortBySelectedCity(extractCabList(json), DEFAULT_HQ_CITY));
        setCabs(list.slice(0, HOME_CABS_LIMIT));
      })
      .catch((err) => {
        if (!cancelled) {
          setCabs([]);
          setError(err.message || "Could not load cabs");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {error ? <p className="section-shell text-sm text-rose-700">{error}</p> : null}
      <MmtHomeCatalogSection
        eyebrow="Our fleet"
        title="Top cabs for you"
        subtitle={HOME_FLEET_SUBTITLE}
        viewAllHref="/cabs"
        viewAllLabel="View all cabs"
        loading={loading}
        loadingLabel="Loading cabs…"
        isEmpty={!loading && cabs.length === 0}
        emptyMessage="No cabs yet. Start the backend and add listings in admin."
      >
        <MmtHomeCatalogScroll>
          {cabs.map((cab) => (
            <MmtHomeCatalogScrollItem key={String(cab._id ?? cab.id)}>
              <MmtCabResultCard cab={cab} layout="card" catalogMode displayCity={cab.city || DEFAULT_HQ_CITY} />
            </MmtHomeCatalogScrollItem>
          ))}
        </MmtHomeCatalogScroll>
      </MmtHomeCatalogSection>
    </>
  );
}
