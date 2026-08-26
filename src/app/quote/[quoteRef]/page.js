import { buildPageMetadata } from "../../../lib/seo";
import QuotePackageView from "../../../components/QuotePackageView";

export const metadata = buildPageMetadata({
  title: "Trip package quote | Cabzii",
  description: "Cabzii trip package quote — PDF and text details.",
  path: "/quote",
  noindex: true
});

export default function QuotePage({ params }) {
  return <QuotePackageView quoteRef={params.quoteRef} />;
}
