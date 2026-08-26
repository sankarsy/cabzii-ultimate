import Link from "next/link";

const STEPS = [
  {
    title: "1. Decide the page type",
    body: "Do not invent a new URL. Match the Google query to an existing type below."
  },
  {
    title: "2. Create or open the record",
    body: "New car → Catalog → Cabs → Create. Existing car → search the list → Edit. City query → City landing pages. Car rental query → Service landing pages (slug car-rental)."
  },
  {
    title: "3. Fill SEO the same way every time",
    body: "SEO title 50–60 chars. Description 120–155 chars. Admin SEO Title becomes the live <title>. Admin SEO Description becomes meta description. If both are empty, the site uses tuned fallbacks in metadataTuning.js (not a second CMS)."
  },
  {
    title: "4. Set city image and vehicle name",
    body: "City landing image is used as Open Graph when filled — otherwise the city OG card (not the Chennai default). Vehicle model = name customers search (Dzire Tour S, Wagon R, Bolero, Innova Crysta)."
  },
  {
    title: "5. Review checklist before save",
    body: "Unique title, unique description, one H1, city-specific body, no fake airport, related links stay in the same city, reviews only if real customers."
  },
  {
    title: "6. Save and check live",
    body: "Click Save. Open View live. Confirm one H1, Book button, and the vehicle name appears in title and first paragraph."
  },
  {
    title: "7. Google",
    body: "In Search Console, request indexing for that URL. Rankings take days/weeks. #1 is never guaranteed — unique title + real booking page is the SOP."
  }
];

export default function AdminSeoSop() {
  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-bold text-slate-900">SEO guiding map (SOP)</h3>
        <p className="mt-1 text-sm text-slate-600">
          Follow this for every new or existing entry. Super admin only.
        </p>

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
                <td className="py-2 pr-3">tour s, dezire, wagon r, bolero, innova taxi booking</td>
                <td className="py-2 pr-3 font-semibold">City cab booking</td>
                <td className="py-2 pr-3">
                  <Link href="/admin?tab=seoCityPages" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
                    City landing pages
                  </Link>
                </td>
                <td className="py-2 font-mono">/cab-booking/chennai</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-3">innova car rental, dzire car rental, wagon r rental</td>
                <td className="py-2 pr-3 font-semibold">Car rental</td>
                <td className="py-2 pr-3">
                  <Link href="/admin?tab=seoServices" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
                    Service landing pages
                  </Link>
                </td>
                <td className="py-2 font-mono">/services/car-rental/chennai</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-3">cab rental, taxi rental, hourly cab</td>
                <td className="py-2 pr-3 font-semibold">Cab rental</td>
                <td className="py-2 pr-3">
                  <Link href="/admin?tab=seoServices" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
                    Service landing pages
                  </Link>
                </td>
                <td className="py-2 font-mono">/services/cab-rental/chennai</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-3">acting driver in vellore / madurai / chennai</td>
                <td className="py-2 pr-3 font-semibold">Acting driver city</td>
                <td className="py-2 pr-3">
                  <Link href="/admin?tab=seoCityPages" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
                    City landing pages (acting-driver)
                  </Link>
                </td>
                <td className="py-2 font-mono">/acting-driver/{"{city}"}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-3">one specific car (your Dzire Tour S listing)</td>
                <td className="py-2 pr-3 font-semibold">Vehicle product</td>
                <td className="py-2 pr-3">
                  <Link href="/admin?tab=cabs" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
                    Catalog → Cabs
                  </Link>
                </td>
                <td className="py-2 font-mono">/cabs/your-slug</td>
              </tr>
              <tr>
                <td className="py-2 pr-3">generic “taxi booking” / all cars</td>
                <td className="py-2 pr-3 font-semibold">Cabs listing</td>
                <td className="py-2 pr-3">
                  <Link href="/admin?tab=seoPagesHub" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
                    Google SEO pages → Home &amp; listings
                  </Link>
                </td>
                <td className="py-2 font-mono">/cabs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <p className="font-bold">New entry</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs sm:text-sm">
            <li>Catalog → Cabs → Create</li>
            <li>Title + Vehicle model = search name (e.g. Dzire Tour S)</li>
            <li>City = Chennai (not All India)</li>
            <li>SEO tab: title like <span className="font-mono">Wagon R Taxi Booking Chennai | Cabzii</span></li>
            <li>Keywords: correct name, misspelling, city, cab booking, car rental</li>
            <li>Save → View live → book button must work</li>
          </ol>
        </div>
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">
          <p className="font-bold">Change an existing entry</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs sm:text-sm">
            <li>Open Google SEO pages and search the car or URL</li>
            <li>Click Edit SEO (quick title/description) or Full edit (prices + SEO tab)</li>
            <li>Keep the same live URL / slug unless the slug is wrong</li>
            <li>Add missing keywords (dezire, wegon r, boliro) without stuffing the title</li>
            <li>Save. Do not create a second cab for the same car — edit the old one</li>
          </ol>
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
