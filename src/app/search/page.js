import Link from "next/link";
import BlogCard from "../../components/BlogCard";
import CabCard from "../../components/CabCard";
import SearchPageSearchBar from "../../components/search/SearchPageSearchBar";
import PackageCard from "../../components/PackageCard";
import { catalogPublicPath } from "../../lib/catalogProduct";
import { packageDetailHref } from "../../lib/holidayHome";
import { getBackendUrl } from "../../lib/seo";

const BACKEND_URL = getBackendUrl();

const normalize = (value) => value.toLowerCase().trim();

const includesQuery = (query, values) => values.some((value) => normalize(String(value)).includes(query));

const SERVICE_SHORTCUTS = [
  { id: "cabs", label: "Book Cab", href: "/cabs", keywords: ["cab", "cabs", "taxi", "sedan", "suv", "innova", "tempo", "outstation", "one way"] },
  { id: "airport", label: "Airport Taxi", href: "/cabs/results?serviceTripType=airport", keywords: ["airport", "transfer", "pickup", "drop"] },
  { id: "drivers", label: "Drivers", href: "/drivers", keywords: ["driver", "drivers", "chauffeur", "acting driver"] },
  {
    id: "holidays",
    label: "Temple Tours",
    href: "/holidays?category=pilgrimage",
    keywords: ["holiday", "holidays", "package", "packages", "tour", "tours", "pilgrimage", "tirupati", "rameswaram", "madurai", "temple"]
  },
  { id: "routes", label: "Popular Routes", href: "/routes", keywords: ["route", "routes", "chennai", "bangalore", "madurai"] },
  { id: "blogs", label: "Blogs", href: "/blogs", keywords: ["blog", "blogs", "guide", "tips", "article"] }
];

function matchingShortcuts(query) {
  if (!query) return [];
  return SERVICE_SHORTCUTS.filter((s) => s.keywords.some((kw) => query.includes(kw) || kw.includes(query)));
}

async function fetchList(pathAndQuery) {
  try {
    const res = await fetch(`${BACKEND_URL}${pathAndQuery}`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export default async function SearchPage({ searchParams }) {
  const rawQuery = searchParams?.q ?? "";
  const query = normalize(rawQuery);
  const cabTypeFilter = (searchParams?.cabType ?? "").trim();
  const pickup = (searchParams?.pickup ?? "").trim();
  const drop = (searchParams?.drop ?? "").trim();
  const date = (searchParams?.date ?? "").trim();
  const routeType = (searchParams?.routeType ?? "").trim();
  const tripType = (searchParams?.tripType ?? "").trim();
  const city = (searchParams?.city ?? searchParams?.priorityCity ?? "").trim();
  const hasInstantBookingFilters = Boolean(cabTypeFilter || pickup || drop || date || routeType || tripType);

  const cabQs = new URLSearchParams({ limit: "50" });
  if (cabTypeFilter) cabQs.set("type", cabTypeFilter);
  if (city) cabQs.set("priorityCity", city);
  if (rawQuery.trim()) cabQs.set("q", rawQuery.trim());

  const driverQs = new URLSearchParams({ limit: "50" });
  if (city) driverQs.set("priorityCity", city);
  if (rawQuery.trim()) driverQs.set("q", rawQuery.trim());

  const packageQs = new URLSearchParams({ limit: "50" });
  if (city) packageQs.set("priorityCity", city);
  if (rawQuery.trim()) packageQs.set("q", rawQuery.trim());

  const testimonialQs = new URLSearchParams({ limit: "50", page: "1" });

  const shouldFetch = Boolean(query || city || hasInstantBookingFilters);

  const [matchingCabs, matchingDrivers, matchingPackages, allBlogs, allTestimonials] = await Promise.all([
    shouldFetch ? fetchList(`/api/v1/cabs?${cabQs.toString()}`) : Promise.resolve([]),
    shouldFetch && rawQuery.trim() ? fetchList(`/api/v1/drivers?${driverQs.toString()}`) : Promise.resolve([]),
    shouldFetch && rawQuery.trim() ? fetchList(`/api/v1/packages?${packageQs.toString()}`) : Promise.resolve([]),
    query ? fetchList("/api/v1/blogs?limit=50&page=1") : Promise.resolve([]),
    query ? fetchList(`/api/v1/testimonials?${testimonialQs.toString()}`) : Promise.resolve([])
  ]);

  const matchingBlogs = query
    ? allBlogs.filter((blog) => includesQuery(query, [blog.title, blog.excerpt, blog.author, blog.seo]))
    : [];

  const matchingTestimonials = query
    ? allTestimonials.filter((t) => includesQuery(query, [t.name, t.location, t.message]))
    : [];

  const shortcuts = matchingShortcuts(query);

  const showOnlyInstantBookingResults = hasInstantBookingFilters;
  const visibleDrivers = showOnlyInstantBookingResults ? [] : matchingDrivers;
  const visiblePackages = showOnlyInstantBookingResults ? [] : matchingPackages;
  const visibleBlogs = showOnlyInstantBookingResults ? [] : matchingBlogs;
  const visibleTestimonials = showOnlyInstantBookingResults ? [] : matchingTestimonials;
  const totalMatches =
    matchingCabs.length +
    visibleDrivers.length +
    visiblePackages.length +
    visibleBlogs.length +
    visibleTestimonials.length +
    shortcuts.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <section className="py-6 md:py-10">
        <h1 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">Search Cabzii</h1>
        <p className="mt-2 text-center text-sm text-slate-600">Cabs · Drivers · Holidays · Flights · Hotels · Blogs</p>
        <div className="mt-6">
          <SearchPageSearchBar initialQuery={rawQuery} />
        </div>

        {query ? (
          <p className="mt-6 text-sm text-slate-600">
            Showing results for <span className="font-semibold text-[var(--cabzii-brand)]">&quot;{rawQuery}&quot;</span>
            {city ? (
              <>
                {" "}
                in <span className="font-semibold">{city}</span>
              </>
            ) : null}{" "}
            ({totalMatches} found)
          </p>
        ) : (
          <p className="mt-6 text-center text-sm text-slate-500">Type a city, vehicle (Dzire, Ertiga, Innova), cab type, holiday destination or service.</p>
        )}

        {hasInstantBookingFilters ? (
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            {city ? <span className="rounded-full bg-white px-3 py-1 shadow-sm">City: {city}</span> : null}
            {pickup ? <span className="rounded-full bg-white px-3 py-1 shadow-sm">Pickup: {pickup}</span> : null}
            {drop ? <span className="rounded-full bg-white px-3 py-1 shadow-sm">Drop: {drop}</span> : null}
            {date ? <span className="rounded-full bg-white px-3 py-1 shadow-sm">Date: {date}</span> : null}
            {routeType ? <span className="rounded-full bg-white px-3 py-1 shadow-sm">Route: {routeType}</span> : null}
            {tripType && routeType === "Outstation" ? (
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">Trip: {tripType}</span>
            ) : null}
            {cabTypeFilter ? <span className="rounded-full bg-white px-3 py-1 shadow-sm">Cab Type: {cabTypeFilter}</span> : null}
          </div>
        ) : null}

        {!query && !hasInstantBookingFilters && !city ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SERVICE_SHORTCUTS.map((s) => (
              <Link
                key={s.id}
                href={s.href}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 shadow-sm transition hover:border-[var(--cabzii-brand)] hover:text-[var(--cabzii-brand)]"
              >
                {s.label}
              </Link>
            ))}
          </div>
        ) : totalMatches === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">No results found</h2>
            <p className="mt-2 text-sm text-slate-600">Try another keyword or browse a category below.</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {SERVICE_SHORTCUTS.map((s) => (
                <Link key={s.id} href={s.href} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[var(--cabzii-brand)]">
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {shortcuts.length > 0 ? (
              <section>
                <h2 className="text-xl font-bold text-slate-900">Services</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {shortcuts.map((s) => (
                    <Link
                      key={s.id}
                      href={s.href}
                      className="rounded-full bg-[var(--cabzii-brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--cabzii-brand-hover)]"
                    >
                      Browse {s.label} →
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {matchingCabs.length > 0 && (
              <section>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">Cabs</h2>
                  <Link href="/cabs" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
                    View all
                  </Link>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {matchingCabs.map((cab) => (
                    <CabCard key={String(cab._id ?? cab.id)} cab={cab} bookHref={catalogPublicPath(cab, "/cabs")} />
                  ))}
                </div>
              </section>
            )}

            {visibleDrivers.length > 0 && (
              <section>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">Drivers</h2>
                  <Link href="/drivers" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
                    View all
                  </Link>
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  {visibleDrivers.map((driver) => {
                    const id = String(driver._id ?? driver.id);
                    const name = driver.name || driver.serviceTitle || "Driver";
                    return (
                      <Link
                        key={id}
                        href={catalogPublicPath(driver, "/drivers")}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[var(--cabzii-brand)] hover:shadow-md"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{name}</p>
                          <p className="text-sm text-slate-500">
                            {driver.vendor || "Cabzii Partner"}
                            {driver.city ? ` · ${driver.city}` : ""}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-[var(--cabzii-brand)]">View →</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {visiblePackages.length > 0 && (
              <section>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">Holidays</h2>
                  <Link href="/holidays" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
                    View all
                  </Link>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {visiblePackages.map((pkg) => (
                    <PackageCard
                      key={String(pkg._id ?? pkg.id)}
                      pkg={pkg}
                      actionText="Book Now"
                      actionHref={packageDetailHref(pkg)}
                    />
                  ))}
                </div>
              </section>
            )}

            {visibleBlogs.length > 0 && (
              <section>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">Blogs</h2>
                  <Link href="/blogs" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
                    View all
                  </Link>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleBlogs.map((post) => (
                    <BlogCard key={String(post._id ?? post.slug ?? post.id)} post={post} />
                  ))}
                </div>
              </section>
            )}

            {visibleTestimonials.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900">Testimonials</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {visibleTestimonials.map((t) => (
                    <blockquote key={String(t._id ?? t.id)} className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
                      <p>&quot;{t.message}&quot;</p>
                      <footer className="mt-2 text-xs font-semibold text-slate-500">
                        — {t.name}
                        {t.location ? `, ${t.location}` : ""}
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
