import Link from "next/link";
import EarnJoinForm from "../../components/earn/EarnJoinForm";
import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";
import { marketingMetadata } from "../../components/marketing/MarketingPageShell";
import FaqSection from "../../components/seo/FaqSection";
import JsonLd from "../../components/seo/JsonLd";
import RelatedSeoLinks from "../../components/seo/RelatedSeoLinks";
import { callDriverCityPath, cityCabLandingPath } from "../../lib/cityCabPaths";
import { telUrl } from "../../lib/conversion";
import { SEO_SCOPE_CITIES } from "../../config/seo-scope";
import { breadcrumbJsonLd, faqFromPairs, ORG_PHONE, SITE_URL } from "../../lib/seo";

export const metadata = marketingMetadata({
  title: "Earn with Cabzii | Driver Attach, Vehicle Attach & Partner",
  description:
    "Attach your cab or join as a Cabzii driver in Chennai, Madurai, Trichy, Coimbatore, Vellore and more. Share city, vehicle, name and mobile on WhatsApp. Partner login for travel operators.",
  path: "/earn",
  keywords: [
    "earn with cabzii",
    "attach cab cabzii",
    "driver attach",
    "vehicle attach",
    "lease vehicle cab",
    "cab partner login",
    "acting driver partner",
    "attach taxi chennai",
    "drive with cabzii"
  ]
});

const FAQS = [
  [
    "Who can earn with Cabzii?",
    "Cab owners, leased-vehicle operators, travel fleets and acting drivers who want bookings through cabzii.in. Cabzii assigns trips after a booking is confirmed — availability depends on a partner being free."
  ],
  [
    "What is Driver Attach, Lease Vehicle and Vehicle Attach?",
    "Driver Attach is Call Driver / acting driver for the customer’s own car. Vehicle Attach is your sedan, SUV, Innova or tempo on Cabzii bookings. Lease Vehicle is a leased cab you want listed the same way."
  ],
  [
    "How do I attach my cab or join as a driver?",
    "Choose Driver Attach, Lease Vehicle or Vehicle Attach, then send contact number, home location, driver name and vehicle. Cabzii replies on WhatsApp. Existing travel partners can sign in at partner login."
  ],
  [
    "Which documents does Cabzii ask for?",
    "After the enquiry Cabzii confirms papers for the listing. Typical items are a valid driving licence, ID (Aadhaar or PAN), and for vehicle attach — RC, insurance and permit as applicable, plus bank details for settlement."
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

const HIGHLIGHTS = [
  {
    title: "Driver Attach",
    body: "Take Call Driver bookings for the customer’s own car — local, airport and outstation."
  },
  {
    title: "Vehicle Attach",
    body: "List a sedan, SUV, Innova or tempo for city, airport and outstation bookings on cabzii.in."
  },
  {
    title: "Lease Vehicle",
    body: "Attach a leased cab the same way. Cabzii still assigns the trip after the customer confirms."
  },
  {
    title: "Partner login",
    body: "Travel operators sign in after Cabzii adds the fleet. Customer OTP login is not for partner work."
  }
];

const STEPS = [
  "Choose Driver Attach, Lease Vehicle or Vehicle Attach and send contact number, home location, name and vehicle.",
  "Cabzii confirms documents and fare cards, then adds the listing.",
  "Customers book online. A driver is assigned after they confirm. Volume depends on live bookings."
];

const DOCS = [
  "Valid driving licence",
  "ID — Aadhaar or PAN",
  "For vehicle attach: RC, insurance and permit as applicable",
  "Bank details for settlement"
];

export default function EarnWithCabziiPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Earn with Cabzii", path: "/earn" }
  ];
  const jsonLd = [
    breadcrumbJsonLd(crumbs),
    faqFromPairs(FAQS),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Earn with Cabzii",
      url: `${SITE_URL}/earn`,
      description:
        "Attach your cab or join as a Cabzii driver. Driver attach, vehicle attach and leased-vehicle partners on cabzii.in."
    }
  ];

  return (
    <TravelLayoutClient>
      <JsonLd data={jsonLd} />
      <div className="section-shell py-4 sm:py-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-8">
          <div className="lg:sticky lg:top-[5.25rem]">
            <EarnJoinForm />
            <div className="mt-2.5 flex gap-2">
              <a href={telUrl(ORG_PHONE)} className="cabzii-btn cabzii-btn-secondary cabzii-tap min-h-10 flex-1 text-xs">
                Call {ORG_PHONE}
              </a>
              <Link
                href="/login?role=partner&next=/admin"
                className="cabzii-btn cabzii-btn-secondary cabzii-tap min-h-10 flex-1 text-xs"
              >
                Partner login
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--cabzii-cta)]">Earn with Cabzii</p>
            <h1 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Join as a driver or attach your vehicle
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Cab owners, leased-vehicle operators and acting drivers take city, airport and outstation bookings that
              customers place on cabzii.in. Share contact number, home location and name — Cabzii replies on WhatsApp.
            </p>

            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {HIGHLIGHTS.map((item) => (
                <li key={item.title} className="cabzii-card p-3">
                  <h2 className="text-sm font-extrabold text-slate-900">{item.title}</h2>
                  <p className="mt-1 text-xs leading-snug text-slate-600">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="cabzii-card p-4">
            <h2 className="text-sm font-extrabold text-slate-900">Here’s what you need to sign up</h2>
            <ol className="mt-3 space-y-2">
              {DOCS.map((item, index) => (
                <li key={item} className="flex gap-2.5 text-sm text-slate-600">
                  <span className="font-bold text-[var(--cabzii-cta)]">{index + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-slate-500">
              Cabzii confirms papers after your enquiry. We do not list a Play Store driver app on this page.
            </p>
          </div>
          <div className="cabzii-card p-4">
            <h2 className="text-sm font-extrabold text-slate-900">How it works</h2>
            <ol className="mt-3 space-y-3">
              {STEPS.map((item, index) => (
                <li key={item} className="flex gap-2.5 text-sm leading-snug text-slate-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[11px] font-extrabold text-[var(--cabzii-cta)]">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="cabzii-card mt-4 p-4">
          <h2 className="text-sm font-extrabold text-slate-900">Reviews</h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Cabzii publishes verified customer reviews only. We do not invent partner testimonials on this page.
          </p>
          <Link href="/testimonials" className="mt-2 inline-block text-sm font-semibold text-[var(--cabzii-cta)] hover:underline">
            Read Cabzii reviews
          </Link>
        </section>

        <article className="mt-8 max-w-3xl text-sm leading-relaxed text-slate-600">
          <h2 className="text-base font-extrabold text-slate-900">Earn with Cabzii — driver and partner opportunities</h2>
          <p className="mt-2">
            Cabzii (cabzii.in) is a cab and Call Driver booking platform from Maduravoyal, Chennai. Partners earn when
            customers book online — airport taxi, local packages, outstation cabs and acting driver. A driver is assigned
            after the customer confirms. Trip volume depends on live bookings in your city. Cabzii does not promise a
            fixed daily income.
          </p>
          <p className="mt-3">
            Use Driver Attach if you drive the customer’s car, Vehicle Attach if you own the cab, or Lease Vehicle if the
            car is on lease. Send the same details Cabzii already uses on WhatsApp: city, vehicle / driver, name and
            mobile. Call {ORG_PHONE} or open{" "}
            <Link href="/login?role=partner&next=/admin" className="font-semibold text-slate-800 hover:underline">
              partner login
            </Link>{" "}
            if you already operate a fleet.
          </p>
          <h3 className="mt-5 text-sm font-extrabold text-slate-900">Cities where Cabzii takes bookings</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {SEO_SCOPE_CITIES.map((city) => (
              <li key={city.slug}>
                <Link
                  href={cityCabLandingPath(city.slug)}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-orange-200 hover:text-[var(--cabzii-cta)]"
                >
                  {city.name} cabs
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mt-5 text-sm font-extrabold text-slate-900">Call Driver / acting driver</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {SEO_SCOPE_CITIES.map((city) => (
              <li key={`d-${city.slug}`}>
                <Link
                  href={callDriverCityPath(city.slug)}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-orange-200 hover:text-[var(--cabzii-cta)]"
                >
                  {city.name} driver
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Bookings also run through{" "}
            <Link href="/cabs" className="font-semibold text-slate-800 hover:underline">
              cab search
            </Link>
            ,{" "}
            <Link href="/chennai/airport-cab-booking" className="font-semibold text-slate-800 hover:underline">
              Chennai airport taxi
            </Link>
            ,{" "}
            <Link href="/call-driver" className="font-semibold text-slate-800 hover:underline">
              Call Driver
            </Link>{" "}
            and{" "}
            <Link href="/tariff" className="font-semibold text-slate-800 hover:underline">
              published tariff
            </Link>
            . Support is on WhatsApp and phone — {ORG_PHONE}.
          </p>
        </article>

        <FaqSection title="Frequently asked questions" faqs={FAQS} />
        <div className="mt-6">
          <RelatedSeoLinks title="Related Cabzii pages" />
        </div>
      </div>
    </TravelLayoutClient>
  );
}
