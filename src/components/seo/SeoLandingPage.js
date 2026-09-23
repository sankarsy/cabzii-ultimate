import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import FaqSection from "./FaqSection";
import BookingCtaBar from "./BookingCtaBar";
import DynamicPageHub from "./DynamicPageHub";

export default function SeoLandingPage({ page, path, faqs = [] }) {
  return (
    <article className="section-shell cabzii-seo-landing py-6 sm:py-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: page.h1 || "Page", path }
        ]}
      />
      <p className="cabzii-seo-kicker">Cabzii</p>
      <h1>{page.h1}</h1>
      {page.intro ? <p className="cabzii-seo-lead">{page.intro}</p> : null}

      <BookingCtaBar variant="compact" bookHref={page.ctaHref || "/cabs"} bookLabel={page.ctaLabel || "Book now"} />

      {page.body ? (
        <div
          className="prose prose-slate mt-6 max-w-none text-sm text-slate-700 md:text-base"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
      ) : null}

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Link href={page.ctaHref || "/cabs"} className="cabzii-btn cabzii-btn-primary cabzii-btn-sm">
          {page.ctaLabel || "Book now"}
        </Link>
        <Link href="/call-driver" className="cabzii-btn cabzii-btn-secondary cabzii-btn-sm">
          Book Call Driver
        </Link>
        <Link href="/tariff" className="cabzii-btn cabzii-btn-secondary cabzii-btn-sm">
          View tariff
        </Link>
      </div>

      <FaqSection title="Frequently asked questions" faqs={faqs} />

      <DynamicPageHub bare fallbackPage="cabs" path={path} className="mt-10 mb-4" />
    </article>
  );
}
