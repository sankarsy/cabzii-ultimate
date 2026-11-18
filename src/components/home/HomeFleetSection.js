"use client";

import MmtCabResultCard from "../mmt/MmtCabResultCard";
import MmtHomeCatalogSection, { MmtHomeCatalogScroll, MmtHomeCatalogScrollItem } from "../mmt/MmtHomeCatalogSection";
import { DEFAULT_HQ_CITY } from "../../lib/vehicleAdminConfig";

const HOME_FLEET_SUBTITLE = `Hatchback, Sedan, Sedan Premium, MPV, Innova & Urbania · ${DEFAULT_HQ_CITY}`;

export default function HomeFleetSection({ cabs = [], loading = false, isEmpty = false }) {
  return (
    <MmtHomeCatalogSection
      eyebrow="Fleet"
      title="Available cabs"
      subtitle={HOME_FLEET_SUBTITLE}
      viewAllHref="/cabs"
      viewAllLabel="View all cabs"
      band="home-band home-band-white"
      loading={loading}
      loadingLabel="Loading cabs…"
      isEmpty={isEmpty}
      emptyMessage="No cabs yet. Start the backend and add listings in admin."
    >
      <MmtHomeCatalogScroll>
        {cabs.map((cab) => (
          <MmtHomeCatalogScrollItem key={String(cab._id ?? cab.id)}>
            <MmtCabResultCard cab={cab} layout="card" catalogMode compact displayCity={cab.city || DEFAULT_HQ_CITY} />
          </MmtHomeCatalogScrollItem>
        ))}
      </MmtHomeCatalogScroll>
    </MmtHomeCatalogSection>
  );
}
