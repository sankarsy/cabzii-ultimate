import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Terms and Conditions",
  description:
    "Terms and conditions governing cab, taxi, acting driver and tour bookings on Cabzii (cabzii.in).",
  path: "/terms-and-conditions"
});

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md md:p-8">
            <h1 className="text-3xl font-bold text-slate-900">Terms and Conditions</h1>
            <p className="mt-2 text-sm text-slate-600">
              These terms govern the use of Cabzii Travels services for taxi, driver, and tour bookings.
            </p>

            <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700">
              <section>
                <h2 className="text-base font-bold text-slate-900">1. Booking and Confirmation</h2>
                <p className="mt-1">
                  A booking is confirmed only after successful payment or explicit confirmation by Cabzii support. Fares shown
                  at booking time are indicative and may vary due to route updates, tolls, parking, permits, waiting time, or
                  state taxes.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">2. Fare and Extra Charges</h2>
                <p className="mt-1">
                  Base fare includes only the package selected during booking. Extra kilometer, extra hour, toll, parking,
                  interstate tax, night allowance, and driver bata are chargeable where applicable.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">3. Customer Responsibilities</h2>
                <p className="mt-1">
                  Customers must provide accurate pickup/drop details and valid contact information. Any delay due to incorrect
                  address or customer unavailability may attract waiting or cancellation charges.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">4. Vehicle and Service Availability</h2>
                <p className="mt-1">
                  Vehicle type is subject to operational availability. If the same model is unavailable, Cabzii may provide an
                  equivalent or upgraded vehicle category at no additional base fare, unless otherwise communicated.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">5. Liability and Force Majeure</h2>
                <p className="mt-1">
                  Cabzii is not liable for delays or trip disruptions caused by traffic, weather, road closures, political
                  events, natural disasters, or other force majeure conditions beyond reasonable control.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">6. Policy Updates</h2>
                <p className="mt-1">
                  Cabzii may update these terms periodically. Continued use of the platform after updates constitutes acceptance
                  of the revised terms.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
