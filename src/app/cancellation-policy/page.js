import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export const metadata = {
  title: "Cancellation Policy | Cabzii Travels"
};

export default function CancellationPolicyPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md md:p-8">
            <h1 className="text-3xl font-bold text-slate-900">Cancellation and Refund Policy</h1>
            <p className="mt-2 text-sm text-slate-600">
              Standard cancellation policy for online taxi and tour bookings made through Cabzii Travels.
            </p>

            <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700">
              <section>
                <h2 className="text-base font-bold text-slate-900">1. Taxi and Driver Bookings</h2>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>More than 24 hours before pickup: full refund after applicable payment gateway deductions.</li>
                  <li>6 to 24 hours before pickup: up to 25% cancellation charge.</li>
                  <li>Less than 6 hours before pickup or no-show: up to 100% cancellation charge may apply.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">2. Tour Package Bookings</h2>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>More than 7 days before departure: up to 10% cancellation charge.</li>
                  <li>3 to 7 days before departure: up to 30% cancellation charge.</li>
                  <li>Less than 72 hours before departure: up to 100% cancellation charge.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">3. Refund Timeline</h2>
                <p className="mt-1">
                  Approved refunds are processed to the original payment method and typically reflect within 5 to 10 business
                  days, subject to bank and payment processor timelines.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">4. Non-Refundable Components</h2>
                <p className="mt-1">
                  Toll, permit, parking, peak-hour surcharge, and third-party charges already incurred may be non-refundable.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">5. Reschedule Requests</h2>
                <p className="mt-1">
                  Date and time changes are subject to vehicle availability and fare revision at the time of modification.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">6. Contact for Support</h2>
                <p className="mt-1">
                  For cancellation or refund help, contact Cabzii support with your booking ID and registered contact details.
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
