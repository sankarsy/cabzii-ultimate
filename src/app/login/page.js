import { Suspense } from "react";
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
    <div className="mx-auto max-w-lg px-4 py-10">
      <section className="py-10 md:py-14">
        <Suspense fallback={<div className="mx-auto max-w-md text-center text-sm text-slate-600">Loading…</div>}>
          <LoginHub />
        </Suspense>
      </section>
    </div>
  );
}
