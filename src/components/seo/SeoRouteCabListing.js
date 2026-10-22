"use client";

import CityHubMarketplace from "../city-cabs/CityHubMarketplace";
import { resolveScopedCity } from "../../lib/cityShowcase";
import { airportInfoForCity } from "../../lib/seo/airports";

export default function SeoRouteCabListing({ initialTrip = {}, initialCabs = [], showHero = true }) {
  const city = resolveScopedCity(initialTrip.from || initialTrip.city);
  const airport = airportInfoForCity(city.slug);
  const airportLabel = airport?.name ? `${airport.name} taxi` : "";

  return (
    <CityHubMarketplace
      city={city}
      initialTrip={initialTrip}
      initialCabs={initialCabs}
      airportLabel={airportLabel}
      showHero={showHero}
    />
  );
}
