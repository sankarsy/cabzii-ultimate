"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HeroStats from "../components/HeroStats";
import WhyChooseUs from "../components/WhyChooseUs";
import Navbar from "../components/Navbar";
import CabCard from "../components/CabCard";
import DriverCard from "../components/DriverCard";
import PackageCard from "../components/PackageCard";
import BlogCard from "../components/BlogCard";
import WhatsAppIcon from "../components/WhatsAppIcon";
import { motion } from "framer-motion";
export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [previewCabs, setPreviewCabs] = useState([]);
  const [previewTours, setPreviewTours] = useState([]);
  const [previewDrivers, setPreviewDrivers] = useState([]);
  const [previewBlogs, setPreviewBlogs] = useState([]);
  const [previewTestimonials, setPreviewTestimonials] = useState([]);
  const [quickForm, setQuickForm] = useState({
    pickup: "",
    drop: "",
    date: "",
    cabType: "",
    routeType: "Outstation",
    tripType: "One Way"
  });
  const [searchTab, setSearchTab] = useState("outstation");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cabsRes, pkgRes, drvRes, blogRes, testRes] = await Promise.all([
          fetch("/api/cabs?limit=6&page=1", { cache: "no-store" }),
          fetch("/api/packages?limit=6&page=1", { cache: "no-store" }),
          fetch("/api/drivers?limit=3&page=1", { cache: "no-store" }),
          fetch("/api/blogs?limit=3&page=1", { cache: "no-store" }),
          fetch("/api/testimonials?limit=3&page=1", { cache: "no-store" })
        ]);
        const [cabsJson, pkgJson, drvJson, blogJson, testJson] = await Promise.all([
          cabsRes.json(),
          pkgRes.json(),
          drvRes.json(),
          blogRes.json(),
          testRes.json()
        ]);
        if (!cancelled) {
          setPreviewCabs(Array.isArray(cabsJson?.data) ? cabsJson.data : []);
          setPreviewTours(Array.isArray(pkgJson?.data) ? pkgJson.data : []);
          setPreviewDrivers(Array.isArray(drvJson?.data) ? drvJson.data : []);
          setPreviewBlogs(Array.isArray(blogJson?.data) ? blogJson.data : []);
          setPreviewTestimonials(Array.isArray(testJson?.data) ? testJson.data : []);
        }
      } catch {
        if (!cancelled) {
          setPreviewCabs([]);
          setPreviewTours([]);
          setPreviewDrivers([]);
          setPreviewBlogs([]);
          setPreviewTestimonials([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (!quickForm.pickup || quickForm.pickup.trim().length < 2) {
        setPickupSuggestions([]);
        return;
      }
      try {
        const response = await fetch(`/api/places?input=${encodeURIComponent(quickForm.pickup)}`);
        const data = await response.json();
        if (!cancelled) setPickupSuggestions(data?.predictions ?? []);
      } catch {
        if (!cancelled) setPickupSuggestions([]);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [quickForm.pickup]);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (!quickForm.drop || quickForm.drop.trim().length < 2) {
        setDropSuggestions([]);
        return;
      }
      try {
        const response = await fetch(`/api/places?input=${encodeURIComponent(quickForm.drop)}`);
        const data = await response.json();
        if (!cancelled) setDropSuggestions(data?.predictions ?? []);
      } catch {
        if (!cancelled) setDropSuggestions([]);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [quickForm.drop]);

  const handleQuickSearch = () => {
    if (searchTab === "tour") {
      const q = quickForm.pickup.trim();
      if (q) {
        router.push(`/search?q=${encodeURIComponent(q)}`);
      } else {
        router.push("/packages");
      }
      return;
    }
    const routeMap = {
      outstation: "Outstation",
      local: "Local",
      airport: "Airport",
      rental: "Rental"
    };
    const params = new URLSearchParams({
      q: quickForm.cabType || routeMap[searchTab] || "cab",
      pickup: quickForm.pickup,
      drop: quickForm.drop,
      date: quickForm.date,
      cabType: quickForm.cabType,
      routeType: routeMap[searchTab] || quickForm.routeType,
      tripType: quickForm.tripType
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
      <Hero
        searchTab={searchTab}
        setSearchTab={setSearchTab}
        quickForm={quickForm}
        setQuickForm={setQuickForm}
        pickupSuggestions={pickupSuggestions}
        dropSuggestions={dropSuggestions}
        onPickupSelect={(place) => {
          setQuickForm((prev) => ({ ...prev, pickup: place }));
          setPickupSuggestions([]);
        }}
        onDropSelect={(place) => {
          setQuickForm((prev) => ({ ...prev, drop: place }));
          setDropSuggestions([]);
        }}
        onSearch={handleQuickSearch}
      />
      <HeroStats />

      <section id="cabs" className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-5 flex items-start justify-between gap-3">
            <SectionHeading eyebrow="Available Cabs" title="Premium Fleet Options" subtitle="Search, filter and compare best rates for your next trip." />
            <button
              type="button"
              onClick={() => router.push("/cabs")}
              className="shrink-0 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 md:text-sm"
            >
              Show All
            </button>
          </div>
          {loading ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="h-40 rounded-xl bg-slate-200" />
                  <div className="mt-4 h-4 rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
                  <div className="mt-6 h-10 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : previewCabs.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 shadow-sm">
              No cabs in the catalog yet. Add listings in admin or run the seed script when the API is running.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {previewCabs.map((cab, index) => (
                <motion.article
                  key={String(cab._id ?? cab.id)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="transition hover:-translate-y-1"
                >
                  <CabCard cab={cab} bookHref={`/cabs/${String(cab._id ?? cab.id)}`} />
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="drivers" className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-5 flex items-start justify-between gap-3">
            <SectionHeading eyebrow="Top Drivers" title="Verified Driver Partners" subtitle="Experienced drivers available now for safe and smooth rides." />
            <button
              type="button"
              onClick={() => router.push("/drivers")}
              className="shrink-0 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 md:text-sm"
            >
              Show All
            </button>
          </div>
          {loading ? (
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="h-28 rounded-xl bg-slate-200" />
                  <div className="mt-4 h-4 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : previewDrivers.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 shadow-sm">
              No drivers listed yet. Data loads from your MongoDB-backed API.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {previewDrivers.map((driver, index) => (
                <motion.div
                  key={String(driver._id ?? driver.id)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  className="transition hover:-translate-y-1"
                >
                  <DriverCard driver={driver} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="packages" className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-5 flex items-start justify-between gap-3">
            <SectionHeading eyebrow="Available Tours" title="Curated Tour Packages" subtitle="Top destinations with premium transport and custom package pricing." />
            <button
              type="button"
              onClick={() => router.push("/packages")}
              className="shrink-0 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 md:text-sm"
            >
              Show All
            </button>
          </div>
          {loading ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="h-40 rounded-xl bg-slate-200" />
                  <div className="mt-4 h-4 rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : previewTours.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 shadow-sm">
              No tour packages yet. Data loads from your MongoDB-backed API.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {previewTours.map((tour, index) => (
                <motion.div
                  key={String(tour._id ?? tour.id)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="transition hover:-translate-y-1"
                >
                  <PackageCard pkg={tour} actionText="Book Now" actionHref={`/tour-booking?id=${String(tour._id ?? tour.id)}`} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <WhyChooseUs />

      <section id="testimonials" className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-5">
            <SectionHeading eyebrow="Happy Travelers" title="Customer Testimonials" subtitle="Real feedback from riders who booked with Cabzii." />
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {previewTestimonials.length === 0 ? (
              <p className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
                Customer reviews will appear here once added in the database.
              </p>
            ) : null}
            {previewTestimonials.map((item, index) => (
              <motion.article
                key={String(item._id ?? item.id ?? index)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="flex h-full min-h-[200px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-md transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-xl"
              >
                <p className="text-sm leading-relaxed text-slate-700">&quot;{item.message}&quot;</p>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.location}</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">{item.rating}.0 ★</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="blogs" className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-5">
            <SectionHeading eyebrow="Latest Insights" title="Travel Blog" subtitle="Quick reads to help you book smarter and travel better." />
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {previewBlogs.length === 0 ? (
              <p className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
                Travel tips and guides load from MongoDB — run the backend seed script if empty.
              </p>
            ) : null}
            {previewBlogs.map((post, index) => (
              <motion.div
                key={String(post._id ?? post.slug ?? post.id ?? index)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="transition hover:-translate-y-1"
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <a
        href="https://wa.me/9944197416"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-xl text-white shadow-xl transition hover:scale-105 hover:bg-emerald-600"
        aria-label="Contact on WhatsApp"
      >
        <WhatsAppIcon className="h-6 w-6 text-white" />
      </a>
      <Footer />
    </main>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-extrabold text-slate-900 md:text-3xl">{title}</h2>
      <p className="mt-2 text-sm text-slate-600 md:text-base">{subtitle}</p>
    </motion.div>
  );
}
