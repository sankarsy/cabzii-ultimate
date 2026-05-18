import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export const metadata = {
  title: "Legal Declaration | Cabzii Travels"
};

export default function LegalDeclarationPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md md:p-8">
            <h1 className="text-3xl font-bold text-slate-900">Travels Legal Declaration</h1>
            <p className="mt-2 text-sm text-slate-600">
              Legal declaration for services offered through Cabzii Travels for online tour and taxi bookings.
            </p>

            <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700">
              <section>
                <h2 className="text-base font-bold text-slate-900">1. Service Role</h2>
                <p className="mt-1">
                  Cabzii acts as a booking facilitator and service provider for taxi rides, driver services, and tour transport
                  packages through its platform and associated vendor network.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">2. Compliance Statement</h2>
                <p className="mt-1">
                  Cabzii and its partnered operators are expected to maintain applicable travel permits, vehicle papers,
                  insurance, and local regulatory compliance required for operation in relevant regions.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">3. Data and Privacy</h2>
                <p className="mt-1">
                  Customer information is collected strictly for booking, support, safety, and billing purposes. Cabzii does not
                  knowingly share sensitive personal data with unauthorized third parties.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">4. Conduct and Safety</h2>
                <p className="mt-1">
                  Misuse of platform services, abusive behavior, or unlawful activity may lead to booking cancellation, service
                  suspension, and reporting to competent authorities where necessary.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">5. Dispute Resolution</h2>
                <p className="mt-1">
                  In case of dispute, customers should first contact Cabzii support for resolution. Any unresolved matter shall
                  be subject to jurisdiction as per applicable local laws.
                </p>
              </section>

              <section>
                <h2 className="text-base font-bold text-slate-900">6. Acceptance</h2>
                <p className="mt-1">
                  By using Cabzii services, users acknowledge and accept this legal declaration and related booking policies.
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
