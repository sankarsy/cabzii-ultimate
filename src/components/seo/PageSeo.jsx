import JsonLd from "./JsonLd";

/**
 * Page-level structured data helper.
 * Meta tags are handled by Next.js `generateMetadata` via `buildSeoMetadata`.
 */
export default function PageSeo({ schema }) {
  if (!schema) return null;
  return <JsonLd data={schema} />;
}

export { buildSeoMetadata } from "../../lib/seo/buildSeoMetadata";
