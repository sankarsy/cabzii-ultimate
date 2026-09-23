"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";
import CabziiBrowseHeader from "../mmt/CabziiBrowseHeader";
import RelatedSeoLinks from "../seo/RelatedSeoLinks";
import CallDriverServiceGrid from "./CallDriverServiceGrid";
import { CALL_DRIVER_SERVICES, callDriverBookHref, mergeCallDriverServices } from "../../lib/callDriver";
import CallDriverServiceSeo from "./CallDriverServiceSeo";
import { DEFAULT_CALL_DRIVER_PAGE } from "../../lib/callDriverPage";

export default function CallDriverLanding({
  showSeoCopy = false,
  title = DEFAULT_CALL_DRIVER_PAGE.title,
  subtitle = DEFAULT_CALL_DRIVER_PAGE.subtitle,
  intro = DEFAULT_CALL_DRIVER_PAGE.intro,
  sections = DEFAULT_CALL_DRIVER_PAGE.sections
}) {
  const [services, setServices] = useState(CALL_DRIVER_SERVICES);
  const [seoMap, setSeoMap] = useState({});
  const [pageCopy, setPageCopy] = useState({ title, subtitle, intro, sections });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/call-driver", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json?.data) return;
        if (json.data.services) setServices(mergeCallDriverServices(json.data.services));
        if (json.data.seo && typeof json.data.seo === "object") setSeoMap(json.data.seo);
        if (json.data.page) {
          setPageCopy({
            title: json.data.page.title || title,
            subtitle: json.data.page.subtitle || subtitle,
            intro: json.data.page.intro || intro,
            sections: Array.isArray(json.data.page.sections) && json.data.page.sections.length ? json.data.page.sections : sections
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [title, subtitle, intro, sections]);

  return (
    <>
      <CabziiBrowseHeader
        title={pageCopy.title}
        subtitle={pageCopy.subtitle}
        icon={UserRound}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Call Driver", path: "/call-driver" }
        ]}
      />

      <div className="section-shell py-5 sm:py-8">
        <p className="mb-4 text-[13px] leading-relaxed text-slate-600 sm:mb-5 sm:text-sm">{pageCopy.intro}</p>
        <CallDriverServiceGrid services={services} />
      </div>

      {showSeoCopy ? (
        <div className="section-shell space-y-6 pb-10 text-sm leading-relaxed text-slate-700">
          {(pageCopy.sections || []).map((section) =>
            section.heading || section.body ? (
              <section key={section.heading}>
                {section.heading ? <h2 className="text-lg font-bold text-slate-900">{section.heading}</h2> : null}
                {section.body ? (
                  <div className="mt-2 [&_a]:font-semibold [&_a]:text-[var(--cabzii-brand)] [&_a]:hover:underline [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_p]:mt-2" dangerouslySetInnerHTML={{ __html: section.body }} />
                ) : null}
              </section>
            ) : null
          )}
          <div className="space-y-10 border-t border-slate-200 pt-8">
            {services.map((svc) => (
              <div key={svc.id} id={svc.id}>
                <CallDriverServiceSeo serviceId={svc.id} compact adminMap={seoMap} />
                <p className="mt-3">
                  <Link
                    href={callDriverBookHref(svc.id)}
                    className="font-semibold text-[var(--cabzii-brand)] hover:underline"
                  >
                    Book {svc.title} →
                  </Link>
                </p>
              </div>
            ))}
          </div>
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
