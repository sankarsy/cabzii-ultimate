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
import { PreviewCardGrid, SectionViewAll } from "../components/PreviewCardSection";
import TestimonialCard from "../components/TestimonialCard";
import FaqSection from "../components/seo/FaqSection";
import InternalLinksHub from "../components/seo/InternalLinksHub";
import SectionIntro from "../components/ui/SectionIntro";
import { useSiteSettings } from "./SiteSettingsProvider";
import { getHomeSection } from "../lib/siteSettingsDefaults";
import {
  catalogPriorityParams,
  matchesSelectedCity,
  sortBySelectedCity,
  writeSelectedCity
} from "../lib/locationPriority";
import { useSelectedCity } from "../lib/useSelectedCity";
import { motion } from "framer-motion";

function CatalogGrid({ loading, empty, emptyMessage, skeletonCount, children }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index} className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="h-40 rounded-xl bg-slate-200" />
            <div className="mt-4 h-4 rounded bg-slate-200" />
            <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }
  if (empty) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center text-sm text-slate-600">
        {emptyMessage}
      </p>
    );
  }
  return children;
}

export default function HomePage({ initial = null }) {
  const router = useRouter();
  const settings = useSiteSettings();
  const cabsSection = getHomeSection(settings, "cabs");
  const driversSection = getHomeSection(settings, "drivers");
  const toursSection = getHomeSection(settings, "tours");
  const testimonialsSection = getHomeSection(settings, "testimonials");
  const blogsSection = getHomeSection(settings, "blogs");
  const hasInitial = Boolean(initial);
  const [loading, setLoading] = useState(!hasInitial);
  const [previewCabs, setPreviewCabs] = useState(initial?.cabs ?? []);
  const [previewTours, setPreviewTours] = useState(initial?.packages ?? []);
  const [previewDrivers, setPreviewDrivers] = useState(initial?.drivers ?? []);
  const [previewBlogs, setPreviewBlogs] = useState(initial?.blogs ?? []);
  const [previewTestimonials, setPreviewTestimonials] = useState(initial?.testimonials ?? []);
  const [quickForm, setQuickForm] = useState({
    pickup: "",
    drop: "",
    date: "",
    cabType: "",
    routeType: "Outstation",
    tripType: "One Way"
  });
  const [searchTab, setSearchTab] = useState("outstation");
  const { city: selectedCity } = useSelectedCity();

  const displayCity = selectedCity || "Chennai";
  const nearCabs = previewCabs.filter((item) => matchesSelectedCity(item, displayCity));
  const nearTours = previewTours.filter((item) => matchesSelectedCity(item, displayCity));
  const nearDrivers = previewDrivers.filter((item) => matchesSelectedCity(item, displayCity));
  const cabsForDisplay = previewCabs;
  const toursForDisplay = previewTours;
  const driversForDisplay = previewDrivers;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    if (hasInitial) {
      setPreviewCabs(sortBySelectedCity(initial?.cabs ?? [], selectedCity));
      setPreviewTours(sortBySelectedCity(initial?.packages ?? [], selectedCity));
      setPreviewDrivers(sortBySelectedCity(initial?.drivers ?? [], selectedCity));
      setPreviewBlogs(initial?.blogs ?? []);
      setPreviewTestimonials(initial?.testimonials ?? []);
    }
    const priorityQ = catalogPriorityParams(selectedCity);
    (async () => {
      try {
        const [cabsRes, pkgRes, drvRes, blogRes, testRes] = await Promise.all([
          fetch(`/api/cabs?limit=6&page=1${priorityQ}`, { cache: "no-store" }),
          fetch(`/api/packages?limit=6&page=1${priorityQ}`, { cache: "no-store" }),
          fetch(`/api/drivers?limit=3&page=1${priorityQ}`, { cache: "no-store" }),
          fetch("/api/blogs?limit=6&page=1", { cache: "no-store" }),
          fetch("/api/testimonials?limit=6&page=1", { cache: "no-store" })
        ]);
        const [cabsJson, pkgJson, drvJson, blogJson, testJson] = await Promise.all([
          cabsRes.json(),
          pkgRes.json(),
          drvRes.json(),
          blogRes.json(),
          testRes.json()
        ]);
        if (cancelled) return;
        setPreviewCabs(sortBySelectedCity(Array.isArray(cabsJson?.data) ? cabsJson.data : [], selectedCity));
        setPreviewTours(sortBySelectedCity(Array.isArray(pkgJson?.data) ? pkgJson.data : [], selectedCity));
        setPreviewDrivers(sortBySelectedCity(Array.isArray(drvJson?.data) ? drvJson.data : [], selectedCity));
        if (!hasInitial) {
          setPreviewBlogs(Array.isArray(blogJson?.data) ? blogJson.data : []);
          setPreviewTestimonials(Array.isArray(testJson?.data) ? testJson.data : []);
        }
      } catch {
        if (!cancelled && !hasInitial) {
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
  }, [hasInitial, selectedCity]);

  const homeFaqs = [
    ["How do I book a cab near me in Bangalore?", "Allow location access on homepage and choose pickup/drop. We prioritize nearby cabs and packages first when city is detected."],
    ["Can I compare local and outstation fare packages?", "Yes. Each cab and driver shows package-wise pricing with custom package names and extra km/hour rates."],
    ["Can I book airport pickup and one-way trips?", "Yes. Use Airport or Outstation search tabs and choose the package that fits your trip type."],
    ["Is instant confirmation available?", "Yes. Most bookings are confirmed quickly after OTP and payment confirmation."],
    ["Can I contact support 24x7?", "Yes. Use WhatsApp or phone support from the contact options available on the website."]
  ];

  const handleQuickSearch = () => {
    const pickup = quickForm.pickup.trim();
    const drop = quickForm.drop.trim();

    if (searchTab === "tour") {
      router.push(pickup ? `/search?q=${encodeURIComponent(pickup)}` : "/packages");
      return;
    }

    const routeMap = {
      outstation: "Outstation",
      local: "Local",
      airport: "Airport",
      rental: "Rental"
    };
    const params = new URLSearchParams();
    const q = quickForm.cabType || routeMap[searchTab] || "cab";
    if (q) params.set("q", q);
    if (pickup) params.set("pickup", pickup);
    if (drop) params.set("drop", drop);
    if (quickForm.date) params.set("date", quickForm.date);
    if (quickForm.cabType) params.set("cabType", quickForm.cabType);
    params.set("routeType", routeMap[searchTab] || quickForm.routeType);
    if (quickForm.tripType) params.set("tripType", quickForm.tripType);

    const query = params.toString();
    router.push(query ? `/search?${query}` : "/cabs");
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero
        searchTab={searchTab}
        setSearchTab={setSearchTab}
        quickForm={quickForm}
        setQuickForm={setQuickForm}
        selectedCity={selectedCity}
        onPickupResolved={(area) => {
          if (area?.label) setQuickForm((prev) => ({ ...prev, pickup: area.label }));
          if (area?.city) writeSelectedCity(area.city);
        }}
        onDropResolved={(area) => {
          if (area?.label) setQuickForm((prev) => ({ ...prev, drop: area.label }));
        }}
        onSearch={handleQuickSearch}
      />
      <HeroStats />

      <section id="cabs" className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <SectionHeading
              eyebrow={displayCity ? `In ${displayCity}` : cabsSection?.eyebrow || "Available Cabs"}
              title={displayCity ? `Cabs in ${displayCity}${nearCabs.length ? ` (${nearCabs.length})` : ""}` : cabsSection?.title || "Premium Fleet Options"}
              subtitle={displayCity ? `Vendors and cabs for ${displayCity} are listed first.` : cabsSection?.subtitle || "Search, filter and compare best rates for your next trip."}
            />
            <button
              type="button"
              onClick={() => router.push("/cabs")}
              className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:px-4 sm:py-2 sm:text-sm"
            >
              Show All
            </button>
          </div>
          <CatalogGrid
            loading={loading}
            empty={!previewCabs.length}
            emptyMessage="No cabs in the catalog yet. Add listings in admin or run the seed script when the API is running."
            skeletonCount={6}
          >
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cabsForDisplay.map((cab, index) => (
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
          </CatalogGrid>
        </div>
      </section>

      <section id="drivers" className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <SectionHeading
              eyebrow={displayCity ? `Drivers in ${displayCity}` : driversSection?.eyebrow || "Top Drivers"}
              title={displayCity ? `Driver partners${nearDrivers.length ? ` (${nearDrivers.length})` : ""}` : driversSection?.title || "Verified Driver Partners"}
              subtitle={displayCity ? `${displayCity} drivers and vendors shown first.` : driversSection?.subtitle || "Experienced drivers available now for safe and smooth rides."}
            />
            <button
              type="button"
              onClick={() => router.push("/drivers")}
              className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:px-4 sm:py-2 sm:text-sm"
            >
              Show All
            </button>
          </div>
          <CatalogGrid
            loading={loading}
            empty={!previewDrivers.length}
            emptyMessage="No drivers listed yet. Data loads from your MongoDB-backed API."
            skeletonCount={3}
          >
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {driversForDisplay.map((driver, index) => (
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
          </CatalogGrid>
        </div>
      </section>

      <section id="packages" className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <SectionHeading
              eyebrow={displayCity ? `Tours in ${displayCity}` : toursSection?.eyebrow || "Available Tours"}
              title={displayCity ? `Tour packages${nearTours.length ? ` (${nearTours.length})` : ""}` : toursSection?.title || "Curated Tour Packages"}
              subtitle={displayCity ? `Vendor packages for ${displayCity} are prioritized at the top.` : toursSection?.subtitle || "Top destinations with premium transport and custom package pricing."}
            />
            <button
              type="button"
              onClick={() => router.push("/packages")}
              className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:px-4 sm:py-2 sm:text-sm"
            >
              Show All
            </button>
          </div>
          <CatalogGrid
            loading={loading}
            empty={!previewTours.length}
            emptyMessage="No tour packages yet. Data loads from your MongoDB-backed API."
            skeletonCount={3}
          >
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {toursForDisplay.map((tour, index) => (
                <motion.div
                  key={String(tour._id ?? tour.id)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="transition hover:-translate-y-1"
                >
                  <PackageCard pkg={tour} actionText="Book Now" actionHref={`/packages/${String(tour._id ?? tour.id)}`} />
                </motion.div>
              ))}
            </div>
          </CatalogGrid>
        </div>
      </section>

      <WhyChooseUs />

      <section id="testimonials" className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <SectionHeading
              eyebrow={testimonialsSection?.eyebrow || "Happy Travelers"}
              title={testimonialsSection?.title || "Customer Testimonials"}
              subtitle={testimonialsSection?.subtitle || "Real feedback from riders who booked with Cabzii."}
            />
            {previewTestimonials.length > 0 ? (
              <SectionViewAll href={testimonialsSection?.viewAllHref || "/testimonials"} />
            ) : null}
          </div>
          <PreviewCardGrid
            isEmpty={previewTestimonials.length === 0}
            emptyMessage="Customer reviews will appear here once added in the database."
          >
            {previewTestimonials.slice(0, testimonialsSection?.limit || 3).map((item, index) => (
              <motion.div
                key={String(item._id ?? item.id ?? index)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="h-full"
              >
                <TestimonialCard item={item} />
              </motion.div>
            ))}
          </PreviewCardGrid>
        </div>
      </section>

      <section id="blogs" className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <SectionHeading
              eyebrow={blogsSection?.eyebrow || "Latest Insights"}
              title={blogsSection?.title || "Travel Blog"}
              subtitle={blogsSection?.subtitle || "Quick reads to help you book smarter and travel better."}
            />
            {previewBlogs.length > 0 ? (
              <SectionViewAll href={blogsSection?.viewAllHref || "/blogs"} label="View all" />
            ) : null}
          </div>
          <PreviewCardGrid
            isEmpty={previewBlogs.length === 0}
            emptyMessage="Travel tips and guides load from MongoDB — run the backend seed script if empty."
          >
            {previewBlogs.slice(0, blogsSection?.limit || 3).map((post, index) => (
              <motion.div
                key={String(post._id ?? post.slug ?? post.id ?? index)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="h-full"
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </PreviewCardGrid>
        </div>
      </section>

      <InternalLinksHub />

      <section id="faqs" className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <FaqSection
            eyebrow="Help & support"
            title="Frequently asked questions"
            subtitle="Quick answers about booking cabs, drivers and tour packages on Cabzii."
            faqs={homeFaqs}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <SectionIntro eyebrow={eyebrow} title={title} subtitle={subtitle} />
    </motion.div>
  );
}
