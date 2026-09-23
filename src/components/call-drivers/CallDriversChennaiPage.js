import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "../seo/Breadcrumbs";
import CallDriversCtaBar from "./CallDriversCtaBar";
import CallDriversFaqAccordion from "./CallDriversFaqAccordion";
import { CALL_DRIVERS_CHENNAI } from "../../data/call-drivers-chennai";

const data = CALL_DRIVERS_CHENNAI;

export default function CallDriversChennaiPage() {
  return (
    <article className="section-shell py-6 sm:py-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Driver Services", path: "/call-driver" },
          { name: "Acting Drivers in Chennai", path: data.path }
        ]}
      />

      <header className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{data.h1}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{data.intro[0]}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{data.intro[1]}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {data.trustBadges.map((badge) => (
              <li
                key={badge}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {badge}
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <CallDriversCtaBar telHref={data.telHref} whatsappHref={data.whatsappHref} phoneDisplay={data.phoneDisplay} />
          </div>
        </div>
        <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={data.hero.src}
            alt={data.hero.alt}
            width={data.hero.width}
            height={data.hero.height}
            priority
            unoptimized={data.hero.src.endsWith(".svg")}
            className="h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 560px"
          />
        </div>
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Acting Drivers Hiring Tariff</h2>
        <p className="mt-2 text-sm text-slate-600">{data.tariffCaption}</p>
        <div className="mt-4 space-y-6">
          {(data.tariffSections || []).map((section) => (
            <div key={section.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <h3 className="bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 sm:text-base">{section.title}</h3>
              {section.intro ? <p className="px-4 pt-3 text-sm text-slate-600">{section.intro}</p> : null}
              <table className="min-w-full text-left text-sm">
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Schedule</th>
                    <th scope="col">Charge</th>
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row) => (
                    <tr key={row.schedule} className="border-t border-slate-100">
                      <th scope="row" className="px-4 py-2.5 font-semibold text-slate-800">
                        {row.schedule}
                      </th>
                      <td className="px-4 py-2.5 text-right font-medium text-slate-900 sm:text-left">{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Call drivers in Chennai</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          An acting driver in Chennai drives <em>your</em> car. Cabzii Call Driver covers city hours, an outstation
          acting driver for highway days, and chauffeur-only airport pickup or drop at MAA. You confirm the fare on the
          booking form; a professional is assigned after you book — this is not a public list of named drivers.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Flexible Call Driver services</h2>
        <p className="mt-2 text-sm text-slate-600">
          City call drivers, outstation acting driver, airport chauffeur in your car, school and corporate quotes, and valet for functions.
        </p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {data.services.map((service) => (
            <li key={service.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {service.image ? (
                <div className="relative aspect-video bg-slate-50">
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    width={service.image.width}
                    height={service.image.height}
                    loading="lazy"
                    unoptimized={service.image.src.endsWith(".svg")}
                    className="h-full w-full object-contain p-6"
                  />
                </div>
              ) : null}
              <div className="p-4">
                <h3 className="text-base font-bold text-slate-900">{service.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{service.subtitle}</p>
                <Link
                  href={service.href}
                  className="mt-3 inline-block text-sm font-semibold text-[var(--cabzii-brand)] hover:underline"
                >
                  Book {service.title.toLowerCase()}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">How to Hire a Call Driver in Chennai</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {data.howToHire.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--cabzii-brand)]">Step {index + 1}</p>
              <h3 className="mt-1 text-sm font-bold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{step.subtitle}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Driver Verification and Safety</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-50">
            <Image
              src={data.safetyImage.src}
              alt={data.safetyImage.alt}
              width={data.safetyImage.width}
              height={data.safetyImage.height}
              loading="lazy"
              unoptimized={data.safetyImage.src.endsWith(".svg")}
              className="h-full w-full object-contain p-6"
            />
          </div>
          <ul className="grid gap-3">
            {data.safety.map((item) => (
              <li key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.subtitle}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Areas We Serve in Chennai</h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter the exact landmark at booking. Pickup is city-wide when a driver is available.
        </p>
        <ul className="mt-3 grid grid-cols-2 gap-2 text-sm font-semibold text-slate-800 sm:grid-cols-5">
          {data.areas.map((area) => (
            <li key={area} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              {area}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
        <div className="mt-4">
          <CallDriversFaqAccordion faqs={data.faqs} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Related Services</h2>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.related.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 hover:border-[var(--cabzii-brand)] hover:text-[var(--cabzii-brand)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
        <nav aria-label="Services">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Services</p>
          <ul className="mt-2 space-y-1 text-sm font-semibold text-slate-800">
            <li>
              <Link href="/call-driver" className="hover:text-[var(--cabzii-brand)]">
                Book Call Driver
              </Link>
            </li>
            <li>
              <Link href={data.cityCabsHref} className="hover:text-[var(--cabzii-brand)]">
                Chennai city cabs
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Contact">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Contact</p>
          <p className="mt-2 text-sm text-slate-800">
            <a href={data.telHref} className="font-semibold hover:text-[var(--cabzii-brand)]">
              {data.phoneDisplay}
            </a>
          </p>
          <p className="mt-1 text-sm text-slate-800">
            <a href={`mailto:${data.email}`} className="hover:text-[var(--cabzii-brand)]">
              {data.email}
            </a>
          </p>
        </nav>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Address</p>
          <p className="mt-2 text-sm text-slate-800">
            {data.address.streetAddress}, {data.address.addressLocality}, {data.address.addressRegion}{" "}
            {data.address.postalCode}
          </p>
        </div>
      </div>
    </article>
  );
}
