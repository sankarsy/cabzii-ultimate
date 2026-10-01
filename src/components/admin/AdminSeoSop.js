import Link from "next/link";

const STEPS = [
  {
    title: "1. Decide the page type",
    body: "Rank city hubs, airport taxi, acting-driver cities, outstation/one-way/tempo services, routes, and holiday packages. Do not create SEO pages for cab fare slabs or Call Driver packages."
  },
  {
    title: "2. Create or open the record",
    body: "City / airport / acting driver → Google SEO pages → Create. Route → Create route. Holiday → Catalog → Holidays. Do not open Cabs or Call Driver tariff to write ranking copy."
  },
  {
    title: "3. Fill SEO the same way every time",
    body: "SEO title 50–60 chars. Description 120–155 chars. One H1. Honest copy. Empty fields keep the site’s built-in fallback."
  },
  {
    title: "4. Book path must match the page",
    body: "City hub books cabs. Acting-driver city books Call Driver. Airport page books airport taxi. Packages stay as cards on those hubs."
  },
  {
    title: "5. Save and check live",
    body: "Click Save. Open View live. Confirm one H1 and a working Book button."
  },
  {
    title: "6. Google",
    body: "In Search Console, request indexing for that URL. Rankings take days/weeks. Unique title + real booking page is the SOP."
  }
];

export default function AdminSeoSop() {
  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-bold text-slate-900">SEO guiding map (SOP)</h3>
        <p className="mt-1 text-sm text-slate-600">Follow this for every new or existing ranking page. Super admin only.</p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-xs text-slate-800">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3">Customer searches</th>
                <th className="py-2 pr-3">Page you use</th>
                <th className="py-2 pr-3">Admin path</th>
                <th className="py-2">Live URL</th>
              </tr>
            </thead>
            <tbody className="align-top">
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-3">cab booking Chennai, taxi Chennai</td>
                <td className="py-2 pr-3 font-semibold">City cab hub</td>
                <td className="py-2 pr-3">
                  <Link href="/admin?tab=seoPagesHub" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
                    Google SEO pages
                  </Link>
                </td>
                <td className="py-2 font-mono">/chennai</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-3">airport taxi Chennai</td>
                <td className="py-2 pr-3 font-semibold">Airport cab</td>
                <td className="py-2 pr-3">
                  <Link href="/admin?tab=seoPagesHub" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
                    Google SEO pages
                  </Link>
                </td>
                <td className="py-2 font-mono">/chennai/airport-cab-booking</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-3">acting driver, call driver, chauffeur</td>
                <td className="py-2 pr-3 font-semibold">Acting driver city</td>
                <td className="py-2 pr-3">
                  <Link href="/admin?tab=seoPagesHub" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
                    Google SEO pages
                  </Link>
                </td>
                <td className="py-2 font-mono">/{"{city}"}/acting-driver</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-3">outstation / one-way / tempo traveller</td>
                <td className="py-2 pr-3 font-semibold">Service landing</td>
                <td className="py-2 pr-3">
                  <Link href="/admin?tab=seoPagesHub" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
                    Google SEO pages
                  </Link>
                </td>
                <td className="py-2 font-mono">/services/outstation-cab/chennai</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-3">Chennai to Tirupati cab</td>
                <td className="py-2 pr-3 font-semibold">Route</td>
                <td className="py-2 pr-3">
                  <Link href="/admin?tab=seoPagesHub" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
                    Google SEO pages
                  </Link>
                </td>
                <td className="py-2 font-mono">/chennai/outstation/chennai-to-tirupati</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-3">Tirupati package, Rameswaram tour</td>
                <td className="py-2 pr-3 font-semibold">Holiday package</td>
                <td className="py-2 pr-3">
                  <Link href="/admin?tab=packages" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
                    Catalog → Holidays
                  </Link>
                </td>
                <td className="py-2 font-mono">/holidays/…</td>
              </tr>
              <tr>
                <td className="py-2 pr-3">4 hr / 8 hr cab, local Call Driver package</td>
                <td className="py-2 pr-3 font-semibold">Not an SEO page</td>
                <td className="py-2 pr-3">Cabs packages / Call Driver tariff</td>
                <td className="py-2">Book on the hub — no extra URL</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ol className="space-y-2 text-sm text-slate-700">
        {STEPS.map((step) => (
          <li key={step.title} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="font-semibold text-slate-900">{step.title}</p>
            <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
