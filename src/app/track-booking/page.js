import Link from "next/link";
import MarketingPageShell, { marketingMetadata } from "../../components/marketing/MarketingPageShell";

export const metadata = marketingMetadata({
  title: "Track Your Cab Booking | Cabzii",
  description: "Track your Cabzii cab or driver booking status. View trip details in My Bookings or contact support on WhatsApp.",
  path: "/track-booking",
  keywords: ["track cab booking", "cab booking status", "cabzii my trips"]
});

export default function TrackBookingPage() {
  return (
    <MarketingPageShell
      title="Track your booking"
      subtitle="View trip status, driver details and payment — or reach support instantly."
      path="/track-booking"
      breadcrumbs={[{ name: "Track booking", path: "/track-booking" }]}
    >
      <div className="not-prose space-y-4">
        <Link
          href="/my-bookings"
          className="cabzii-tap flex items-center justify-between rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 font-bold text-sky-900 hover:bg-sky-100"
        >
          <span>Go to My Bookings</span>
          <span aria-hidden>→</span>
        </Link>
        <Link
          href="/login?next=/my-bookings"
          className="cabzii-tap flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-800 hover:bg-slate-50"
        >
          <span>Login to view trips</span>
          <span aria-hidden>→</span>
        </Link>
        <p className="text-sm text-slate-600">
          Booked via WhatsApp or phone? Message us on WhatsApp with your mobile number — we&apos;ll share live trip status.
        </p>
      </div>
    </MarketingPageShell>
  );
}
