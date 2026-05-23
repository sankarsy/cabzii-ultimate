import Link from "next/link";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import TestimonialCard from "../../components/TestimonialCard";
import { fetchCatalogList } from "../../lib/serverCatalog";

export default async function TestimonialsPage() {
  const items = await fetchCatalogList("testimonials", 24);

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">Customer Testimonials</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Real feedback from riders who booked cabs, drivers and tour packages with Cabzii.
          </p>
          {items.length === 0 ? (
            <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">
              No reviews yet. Run{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">npm run seed:content</code> in{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">cabzii-ultimate-backend</code>.
            </p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <TestimonialCard key={String(item._id ?? item.id)} item={item} />
              ))}
            </div>
          )}
          <p className="mt-8">
            <Link href="/" className="text-sm font-semibold text-[#0056D2] hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
