"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FaqSection from "../seo/FaqSection";
import { compactVehicleSeoHtml } from "../../lib/vehicleEnterpriseSeo";
import { resolveCallDriverSeo } from "../../lib/callDriverSeo";

export default function CallDriverServiceSeo({ serviceId, compact = false, adminMap: adminMapProp }) {
  const [adminMap, setAdminMap] = useState(adminMapProp && typeof adminMapProp === "object" ? adminMapProp : {});

  useEffect(() => {
    if (adminMapProp && typeof adminMapProp === "object") {
      setAdminMap(adminMapProp);
      return undefined;
    }
    let cancelled = false;
    fetch("/api/call-driver", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const map = json?.data?.seo;
        if (map && typeof map === "object") setAdminMap(map);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [adminMapProp]);

  const seo = resolveCallDriverSeo(serviceId, adminMap);
  const html = compactVehicleSeoHtml(seo.html);
  if (!seo.heading && !html && !seo.faqs.length) return null;

  return (
    <section className={`space-y-5 text-sm leading-relaxed text-slate-700 ${compact ? "" : "pb-4"}`}>
      {seo.heading ? <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{seo.heading}</h2> : null}
      {html ? (
        <div className="cabzii-vehicle-seo max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      ) : null}
      {seo.faqs.length ? (
        <FaqSection
          eyebrow="Help"
          title="Call Driver FAQs"
          faqs={seo.faqs}
          scrollable={false}
        />
      ) : null}
      {compact ? null : (
        <p>
          <Link href="/call-driver" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
            All Call Driver services
          </Link>
          {" · "}
          <Link href="/acting-driver/chennai" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
            Acting driver Chennai
          </Link>
          {" · "}
          <Link href="/tariff" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
            Tariff
          </Link>
        </p>
      )}
    </section>
  );
}
