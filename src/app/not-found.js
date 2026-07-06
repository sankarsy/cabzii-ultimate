import Link from "next/link";
import { buildPageMetadata } from "../lib/seo";

export const metadata = buildPageMetadata({
  title: "Page Not Found | Cabzii",
  description: "The page you requested is not available. Browse cab booking, routes, airport taxi and tour packages on Cabzii.in.",
  path: "/404",
  noindex: true
});

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-sky-600">404</p>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Page not found</h1>
      <p className="mt-3 text-base text-slate-600">
        This URL may have moved. Try our popular cab routes or book online from the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="cabzii-btn cabzii-btn-primary">
          Go to homepage
        </Link>
        <Link href="/routes/chennai-to-tirupati-cab" className="cabzii-btn cabzii-btn-secondary">
          Chennai to Tirupati cab
        </Link>
        <Link href="/cabs" className="cabzii-btn cabzii-btn-secondary">
          Book cabs online
        </Link>
      </div>
    </main>
  );
}
