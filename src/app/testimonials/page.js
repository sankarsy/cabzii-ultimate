import Link from "next/link";
import TestimonialCard from "../../components/TestimonialCard";
import { fetchCatalogList } from "../../lib/serverCatalog";

export default async function TestimonialsPage() {
  const items = await fetchCatalogList("testimonials", 24);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Customer reviews</h1>
      <p className="mt-2 text-sm text-slate-600">
        Feedback from riders who booked on cabzii.in.
      </p>
      {items.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">
          No reviews yet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {items.map((item) => (
            <TestimonialCard key={String(item._id ?? item.id)} item={item} />
          ))}
        </div>
      )}
      <p className="mt-8">
        <Link href="/" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
