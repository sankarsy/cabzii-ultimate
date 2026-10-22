import Link from "next/link";
import MarketingPageShell, { marketingMetadata } from "../../components/marketing/MarketingPageShell";
import { telUrl, whatsappBookingUrl } from "../../lib/conversion";
import { ORG_PHONE } from "../../lib/seo";
import { BRAND } from "../../lib/brand";

export const metadata = marketingMetadata({
  title: "Earn with Cabzii — Attach Your Cab or Drive",
  description:
    "Attach your cab or join as a Cabzii driver partner. Partner login for travel vendors. Call or WhatsApp to get started.",
  path: "/earn",
  keywords: ["earn with cabzii", "attach cab cabzii", "cab partner login", "drive with cabzii"]
});

const FAQS = [
  [
    "Who can earn with Cabzii?",
    "Cab owners, travel operators and acting drivers who want bookings through cabzii.in. Cabzii assigns trips after a booking is confirmed — availability depends on a partner being free."
  ],
  [
    "How do I attach my cab?",
    "Call or WhatsApp Cabzii with your vehicle type, city and contact number. Existing travel partners can sign in at partner login."
  ],
  [
    "Is there a separate driver login?",
    "Yes. Assigned drivers use the driver login after Cabzii has your vehicle on the platform. Do not use customer OTP login for partner work."
  ],
  [
    "Does Cabzii guarantee daily trips?",
    "No. Trip volume depends on live bookings in your city. We do not promise a fixed daily income."
  ]
];

export default function EarnWithCabziiPage() {
  const waHref = whatsappBookingUrl({
    message: `Hi Cabzii, I want to earn with ${BRAND.name}.\nCity:\nVehicle / driver:\nName:\nMobile:`
  });

  return (
    <MarketingPageShell
      title="Earn with Cabzii"
      subtitle="Attach your cab or drive with Cabzii — partner bookings for city, airport and outstation trips."
      path="/earn"
      breadcrumbs={[{ name: "Earn with Cabzii", path: "/earn" }]}
      faqs={FAQS}
    >
      <p>
        If you own a sedan, SUV, Innova or tempo, or you drive as an acting driver, you can take bookings that
        customers place on cabzii.in.
      </p>
      <h2>What you can attach</h2>
      <ul>
        <li>Cabs for city, airport and outstation bookings</li>
        <li>Acting driver / call driver for the customer’s own car</li>
        <li>Travel-operator fleets with a partner login</li>
      </ul>
      <h2>How it works</h2>
      <ol>
        <li>Share your city, vehicle and mobile on WhatsApp or phone.</li>
        <li>Cabzii adds the listing after documents and fare cards are in place.</li>
        <li>Customers book online. A driver is assigned after they confirm.</li>
      </ol>
      <div className="not-prose mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-xl bg-[var(--cabzii-brand)] px-4 py-3 text-sm font-bold text-white hover:bg-[var(--cabzii-brand-hover)]"
        >
          WhatsApp to attach
        </a>
        <a
          href={telUrl(ORG_PHONE)}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50"
        >
          Call {ORG_PHONE}
        </a>
        <Link
          href="/login?role=partner&next=/admin"
          className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-bold text-sky-800 hover:bg-sky-100 sm:col-span-2"
        >
          Partner login
        </Link>
      </div>
    </MarketingPageShell>
  );
}
