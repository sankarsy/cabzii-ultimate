import Link from "next/link";
import BlogCard from "../../components/BlogCard";
import CabCard from "../../components/CabCard";
import DriverCard from "../../components/DriverCard";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import PackageCard from "../../components/PackageCard";
import { getBackendUrl } from "../../lib/seo";

const BACKEND_URL = getBackendUrl();

const normalize = (value) => value.toLowerCase().trim();

const includesQuery = (query, values) => values.some((value) => normalize(String(value)).includes(query));

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
  const hasInstantBookingFilters = Boolean(cabTypeFilter || pickup || drop || date || routeType || tripType);

  const shouldApplyKeywordToCabs = Boolean(query && !["cab", "cabs", "local", "outstation"].includes(query));

  const cabQs = new URLSearchParams();
  cabQs.set("limit", "50");
  if (cabTypeFilter) cabQs.set("type", cabTypeFilter);
  if (shouldApplyKeywordToCabs && rawQuery.trim()) cabQs.set("q", rawQuery.trim());

  const driverQs = new URLSearchParams();
  driverQs.set("limit", "50");
  if (query) driverQs.set("q", rawQuery.trim());

  const packageQs = new URLSearchParams();
  packageQs.set("limit", "50");
  if (query) packageQs.set("q", rawQuery.trim());

  const [matchingCabs, matchingDrivers, matchingPackages, allBlogs] = await Promise.all([
    fetchList(`/api/v1/cabs?${cabQs.toString()}`),
    query ? fetchList(`/api/v1/drivers?${driverQs.toString()}`) : Promise.resolve([]),
    query ? fetchList(`/api/v1/packages?${packageQs.toString()}`) : Promise.resolve([]),
    query ? fetchList("/api/v1/blogs?limit=50&page=1") : Promise.resolve([])
  ]);

  const matchingBlogs = query
    ? allBlogs.filter((blog) => includesQuery(query, [blog.title, blog.excerpt, blog.author, blog.seo]))
    : [];

  const showOnlyInstantBookingResults = hasInstantBookingFilters;
  const visibleDrivers = showOnlyInstantBookingResults ? [] : matchingDrivers;
  const visiblePackages = showOnlyInstantBookingResults ? [] : matchingPackages;
  const visibleBlogs = showOnlyInstantBookingResults ? [] : matchingBlogs;
  const totalMatches = matchingCabs.length + visibleDrivers.length + visiblePackages.length + visibleBlogs.length;

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">Search Results</h1>
          <p className="mt-2 text-sm text-slate-600">
            {query ? (
              <>
                Showing results for <span className="font-semibold text-sky-700">"{rawQuery}"</span> ({totalMatches} found)
              </>
            ) : (
              "Search for cab, sedan, active driver or tour package from navbar."
            )}
          </p>
          {hasInstantBookingFilters ? (
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
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

          {!query && !hasInstantBookingFilters ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-md">
              Try keywords: <span className="font-semibold">cab</span>, <span className="font-semibold">sedan</span>,{" "}
              <span className="font-semibold">active driver</span>, <span className="font-semibold">tour package</span>.
            </div>
          ) : totalMatches === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-md">
              <h2 className="text-xl font-bold text-slate-900">No results found</h2>
              <p className="mt-2 text-sm text-slate-600">Try a different keyword or visit all listings pages.</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Link href="/cabs" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white">
                  View All Cabs
                </Link>
                <Link href="/packages" className="rounded-lg border border-sky-600 px-4 py-2 text-sm font-semibold text-sky-700">
                  View All Packages
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-10">
              {matchingCabs.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-slate-900">Cabs</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {matchingCabs.map((cab) => (
                      <CabCard
                        key={String(cab._id ?? cab.id)}
                        cab={cab}
                        bookHref={`/cabs/${String(cab._id ?? cab.id)}`}
                      />
                    ))}
                  </div>
                </section>
              )}

              {visibleDrivers.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-slate-900">Active Drivers</h2>
                  <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleDrivers.map((driver) => (
                      <DriverCard key={String(driver._id ?? driver.id)} driver={driver} />
                    ))}
                  </div>
                </section>
              )}

              {visiblePackages.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-slate-900">Tour Packages</h2>
                  <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visiblePackages.map((pkg) => (
                      <PackageCard
                        key={String(pkg._id ?? pkg.id)}
                        pkg={pkg}
                        actionText="Book Now"
                        actionHref={`/tour-booking?id=${String(pkg._id ?? pkg.id)}`}
                      />
                    ))}
                  </div>
                </section>
              )}

              {visibleBlogs.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-slate-900">Blogs</h2>
                  <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleBlogs.map((post) => (
                      <BlogCard key={String(post._id ?? post.slug ?? post.id)} post={post} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
