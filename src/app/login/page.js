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
    <div className="mx-auto max-w-md px-4 py-4 sm:py-6">
      <Suspense fallback={<div className="text-center text-sm text-slate-600">Loading…</div>}>
        <LoginHub />
      </Suspense>
    </div>
  );
}
