import Link from "next/link";
import MarketingPageShell, { marketingMetadata } from "../../components/marketing/MarketingPageShell";
import { ORG_EMAIL, ORG_PHONE, contactPageJsonLd } from "../../lib/seo";

export const metadata = marketingMetadata({
  title: "Contact Cabzii — Call, WhatsApp & Email",
  description: "Reach Cabzii for cab quotes, booking help and support. Phone, WhatsApp and email.",
  path: "/contact",
  keywords: ["contact cabzii", "cab booking support", "cabzii phone number"]
});

export default function ContactPage() {
  return (
    <MarketingPageShell
      title="Contact us"
      subtitle="Get a cab quote or booking help — we respond fast on WhatsApp and phone."
      path="/contact"
      breadcrumbs={[{ name: "Contact", path: "/contact" }]}
      jsonLdExtra={[contactPageJsonLd()]}
    >
      <div className="not-prose grid gap-4 sm:grid-cols-2">
        <a href={`tel:${ORG_PHONE.replace(/\s/g, "")}`} className="cabzii-card cabzii-card-interactive block p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-sky-600">Phone</p>
          <p className="mt-2 text-lg font-bold text-slate-900">{ORG_PHONE}</p>
          <p className="mt-1 text-sm text-slate-600">Tap to call</p>
        </a>
        <a
          href="https://wa.me/919944197416?text=Hi%20Cabzii%2C%20I%20need%20help%20with%20a%20cab%20booking."
          target="_blank"
          rel="noreferrer"
          className="cabzii-card cabzii-card-interactive block p-5"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">WhatsApp</p>
          <p className="mt-2 text-lg font-bold text-slate-900">Chat with us</p>
          <p className="mt-1 text-sm text-slate-600">Instant quotes & trip updates</p>
        </a>
        <div className="cabzii-card p-5 sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</p>
          <p className="mt-2 text-lg font-bold text-slate-900">
            <a href={`mailto:${ORG_EMAIL}`} className="text-sky-700 hover:underline">
              {ORG_EMAIL}
            </a>
          </p>
          <p className="mt-3 text-sm text-slate-600">
            For bookings use{" "}
            <Link href="/cabs" className="font-semibold text-sky-700 hover:underline">
              Search cabs
            </Link>{" "}
            or{" "}
            <Link href="/track-booking" className="font-semibold text-sky-700 hover:underline">
              Track booking
            </Link>
            .
          </p>
        </div>
      </div>
    </MarketingPageShell>
  );
}
