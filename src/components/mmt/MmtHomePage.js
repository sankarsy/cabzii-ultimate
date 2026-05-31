"use client";

import { useEffect, useState } from "react";
import EmtAppDownloadBanner from "../emt/EmtAppDownloadBanner";
import EmtHeroSearch from "../emt/EmtHeroSearch";
import EmtHolidayExplore from "../emt/EmtHolidayExplore";
import EmtOffersCarousel from "../emt/EmtOffersCarousel";
import EmtWhyChooseUs from "../emt/EmtWhyChooseUs";
import MmtLayout from "./MmtLayout";
import MmtPopularRoutes from "./MmtPopularRoutes";
import MmtCabResultCard from "./MmtCabResultCard";
import MmtDriverResultCard from "./MmtDriverResultCard";
import MmtHomeCatalogSection, { MmtHomeCatalogScroll, MmtHomeCatalogScrollItem } from "./MmtHomeCatalogSection";
import FaqSection from "../seo/FaqSection";
import { sortBySelectedCity } from "../../lib/locationPriority";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { todayStr } from "../../lib/mmtTrip";
import { extractList, fetchJson } from "../../lib/apiClient";

const HOME_FAQS = [
  ["How do I book an outstation cab?", "Select Outstation on the home page, enter pickup and drop, date & time, then choose a cab from results."],
  ["Can I book airport pickup?", "Use the Airport tab, pick direction (pickup or drop), and search available cabs."],
  ["What is hourly rental?", "Book a cab for 4, 8 or 12 hours within a city — ideal for weddings, meetings or local errands."],
  ["Is OTP login required?", "Yes. Login with your mobile number to confirm booking and view My Trips."]
];

export default function MmtHomePage() {
  const { city: selectedCity } = useSelectedCity();
  const displayCity = selectedCity || "Chennai";
  const [cabs, setCabs] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loadingCabs, setLoadingCabs] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [catalogError, setCatalogError] = useState("");

  const defaultTrip = {
    tripType: "outstation",
    from: displayCity,
    to: "Bengaluru",
    date: todayStr(),
    time: "09:00",
    roundTrip: false,
    direction: "pickup",
    packageHours: 8,
    city: displayCity
  };

  useEffect(() => {
    let cancelled = false;
    setLoadingCabs(true);
    setCatalogError("");
    const q = new URLSearchParams({ limit: "4", page: "1" });
    if (displayCity) q.set("priorityCity", displayCity);
    fetchJson(`/api/cabs?${q}`)
      .then((json) => {
        if (!cancelled) {
          setCabs(sortBySelectedCity(extractList(json), displayCity));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setCabs([]);
          setCatalogError(err.message || "Could not load catalog");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingCabs(false);
      });
    return () => {
      cancelled = true;
    };
  }, [displayCity]);

  useEffect(() => {
    let cancelled = false;
    setLoadingDrivers(true);
    const q = new URLSearchParams({ limit: "4", page: "1" });
    if (displayCity) q.set("priorityCity", displayCity);
    fetchJson(`/api/drivers?${q}`)
      .then((json) => {
        if (!cancelled) {
          setDrivers(sortBySelectedCity(extractList(json), displayCity));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setDrivers([]);
          if (!catalogError) setCatalogError(err.message || "Could not load catalog");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDrivers(false);
      });
    return () => {
      cancelled = true;
    };
  }, [displayCity]);

  return (
    <MmtLayout headerTransparent>
      <EmtHeroSearch defaultCity={displayCity} defaultTab="cabs" />
      <EmtOffersCarousel />
      <EmtHolidayExplore />
      <MmtPopularRoutes />
      <EmtWhyChooseUs />

      {catalogError ? (
        <p className="mx-auto max-w-6xl px-4 text-sm text-rose-700">{catalogError}</p>
      ) : null}

      <MmtHomeCatalogSection
        title="Top cabs for you"
        subtitle={`Dzire, Ertiga, Innova & Tempo taxi cars · ${displayCity}`}
        viewAllHref="/cabs"
        viewAllLabel="View all cabs"
        loading={loadingCabs}
        loadingLabel="Loading cabs…"
        isEmpty={!loadingCabs && cabs.length === 0}
        emptyMessage="No cabs yet. Start the backend and add listings in admin."
      >
        <MmtHomeCatalogScroll>
          {cabs.map((cab) => (
            <MmtHomeCatalogScrollItem key={String(cab._id ?? cab.id)}>
              <MmtCabResultCard cab={cab} trip={defaultTrip} layout="card" />
            </MmtHomeCatalogScrollItem>
          ))}
        </MmtHomeCatalogScroll>
      </MmtHomeCatalogSection>

      <MmtHomeCatalogSection
        title="Top acting drivers for you"
        subtitle={`Chauffeur for Dzire, Ertiga, Innova & Tempo · same packages as cabs · ${displayCity}`}
        viewAllHref="/drivers"
        viewAllLabel="View all drivers"
        loading={loadingDrivers}
        loadingLabel="Loading drivers…"
        isEmpty={!loadingDrivers && drivers.length === 0}
        emptyMessage="No drivers yet. Start the backend and add listings in admin."
        borderedTop
      >
        <MmtHomeCatalogScroll>
          {drivers.map((driver) => (
            <MmtHomeCatalogScrollItem key={String(driver._id ?? driver.id)}>
              <MmtDriverResultCard driver={driver} trip={defaultTrip} layout="card" />
            </MmtHomeCatalogScrollItem>
          ))}
        </MmtHomeCatalogScroll>
      </MmtHomeCatalogSection>

      <section className="border-t border-slate-200 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-6xl px-4">
          <FaqSection
            eyebrow="Help"
            title="Frequently asked questions"
            subtitle="Quick answers about booking on cabzii.in."
            faqs={HOME_FAQS}
          />
        </div>
      </section>

      <EmtAppDownloadBanner />
    </MmtLayout>
  );
}
