"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";
import CabziiBrowseHeader from "../mmt/CabziiBrowseHeader";
import RelatedSeoLinks from "../seo/RelatedSeoLinks";
import CallDriverServiceGrid from "./CallDriverServiceGrid";
import { CALL_DRIVER_SERVICES, mergeCallDriverServices } from "../../lib/callDriver";

export default function CallDriverLanding({
  showSeoCopy = false,
  title = "Call Driver Services",
  subtitle = "Need a professional driver for your own car? Choose the service you need."
}) {
  const [services, setServices] = useState(CALL_DRIVER_SERVICES);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/call-driver", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json?.data?.services) return;
        setServices(mergeCallDriverServices(json.data.services));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <CabziiBrowseHeader
        title={title}
        subtitle={subtitle}
        icon={UserRound}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Call Driver", path: "/call-driver" }
        ]}
      />

      <div className="section-shell py-5 sm:py-8">
        <p className="mb-4 text-[13px] leading-relaxed text-slate-600 sm:mb-5 sm:text-sm">
          You book a Cabzii Call Driver service. A professional driver is assigned after booking — you do not pick an
          individual driver.
        </p>
        <CallDriverServiceGrid services={services} />
      </div>

      {showSeoCopy ? (
        <div className="section-shell space-y-6 pb-10 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="text-lg font-bold text-slate-900">Call driver in Chennai for your own car</h2>
            <p className="mt-2">
              Cabzii’s call driver and acting driver service in Chennai is for customers who already have a car and need
              a professional driver. Book a local city driver, an outstation driver, or an airport call driver without
              browsing a public driver list. Cabzii assigns a verified driver after you confirm the booking.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">How to book</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Choose the Call Driver service you need</li>
              <li>Enter date, time, pickup and vehicle details</li>
              <li>Review the estimated fare (or request a quote for monthly and corporate work)</li>
              <li>Confirm the booking — Cabzii assigns an available driver</li>
            </ol>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">Outstation, airport, monthly and corporate</h2>
            <p className="mt-2">
              Outstation driver Chennai packages cover full-day highway trips in your vehicle. Airport call driver
              Chennai is driver-only pickup or drop — not an airport taxi. Monthly driver Chennai and school pickup
              requests are quoted by Cabzii. Corporate driver service Chennai is available for offices, events and
              regular staff transport. Valet parking drivers can be booked for functions with automatic supervisor
              planning.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">Safety and professional drivers</h2>
            <p className="mt-2">
              Drivers are operational resources managed by Cabzii. We can replace a driver if needed, cover availability
              gaps, and keep personal driver records in the admin panel rather than on the public website.
            </p>
          </section>
        </div>
      ) : null}

      <div className="section-shell pb-10">
        <RelatedSeoLinks page="drivers" />
        <p className="mt-6 text-center">
          <Link href="/" className="text-sm font-semibold text-[var(--cabzii-brand)]">
            ← Back to home
          </Link>
        </p>
      </div>
    </>
  );
}
