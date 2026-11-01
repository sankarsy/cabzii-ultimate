"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserRound } from "../icons/rscIcons";
import CabziiBrowseHeader from "../mmt/CabziiBrowseHeader";
import RelatedSeoLinks from "../seo/RelatedSeoLinks";
import CallDriverServiceGrid from "./CallDriverServiceGrid";
import { CALL_DRIVER_SERVICES, mergeCallDriverServices } from "../../lib/callDriver";
import { DEFAULT_CALL_DRIVER_PAGE } from "../../lib/callDriverPage";
import { callDriverCityPath, isLiveCallDriverCitySlug } from "../../lib/cityCabPaths";
import { resolveScopedCity } from "../../lib/cityShowcase";
import { useSelectedCity } from "../../lib/useSelectedCity";

export default function CallDriverLanding({
  showSeoCopy = false,
  city = { slug: "chennai", name: "Chennai" },
  title,
  subtitle,
  intro = DEFAULT_CALL_DRIVER_PAGE.intro,
  sections = DEFAULT_CALL_DRIVER_PAGE.sections
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { city: selectedCity, locating } = useSelectedCity();
  const cityName = city?.name || "Chennai";
  const heading = title || `Book Call Driver in ${cityName}`;
  const lede =
    subtitle || `Need a professional driver for your own car in ${cityName}? Choose the service you need.`;
  const [services, setServices] = useState(CALL_DRIVER_SERVICES);
  const [pageCopy, setPageCopy] = useState({ intro, sections });

  useEffect(() => {
    if (locating) return;
    if (pathname.startsWith("/call-driver/book")) return;
    const scoped = resolveScopedCity(selectedCity);
    const slug = isLiveCallDriverCitySlug(scoped.slug) ? scoped.slug : "chennai";
    const target = callDriverCityPath(slug);
    if (target !== pathname) router.replace(target);
  }, [locating, pathname, router, selectedCity]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/call-driver", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json?.data) return;
        if (json.data.services) setServices(mergeCallDriverServices(json.data.services));
        if (json.data.page) {
          setPageCopy({
            intro: json.data.page.intro || intro,
            sections: Array.isArray(json.data.page.sections) && json.data.page.sections.length ? json.data.page.sections : sections
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [intro, sections]);

  return (
    <>
      <CabziiBrowseHeader title={heading} subtitle={lede} icon={UserRound} />

      <div className="section-shell py-5 sm:py-8">
        <p className="mb-4 text-[13px] leading-relaxed text-slate-600 sm:mb-5 sm:text-sm">
          {pageCopy.intro} Call Driver in {cityName} uses the same packages — Cabzii assigns a driver after you confirm.
        </p>
        <CallDriverServiceGrid services={services} pickup={cityName} />
      </div>

      {showSeoCopy ? (
        <div className="section-shell space-y-6 pb-10 text-sm leading-relaxed text-slate-700">
          {(pageCopy.sections || []).map((section) =>
            section.heading || section.body ? (
              <section key={section.heading}>
                {section.heading ? <h2 className="text-lg font-bold text-slate-900">{section.heading}</h2> : null}
                {section.body ? (
                  <div className="mt-2 [&_a]:font-semibold [&_a]:text-[var(--cabzii-cta)] [&_a]:hover:underline [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_p]:mt-2" dangerouslySetInnerHTML={{ __html: section.body }} />
                ) : null}
              </section>
            ) : null
          )}
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
