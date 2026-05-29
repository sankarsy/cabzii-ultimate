import { Suspense } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import LoginHub from "../../components/LoginHub";

import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Login",
  description: "Sign in to Cabzii as a customer, travel partner, or admin.",
  path: "/login",
  noindex: true
});

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
      <section className="py-10 md:py-14">
        <Suspense fallback={<div className="mx-auto max-w-md text-center text-sm text-slate-600">Loading…</div>}>
          <LoginHub />
        </Suspense>
      </section>
      <Footer />
    </main>
  );
}
