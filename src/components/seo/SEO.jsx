import JsonLd from "./JsonLd";

/**
 * Global SEO helper for Next.js App Router.
 *
 * Meta tags: use `buildSeoMetadata()` in `generateMetadata()` (server).
 * JSON-LD: pass `schema` to this component (client or server).
 *
 * @example
 * export async function generateMetadata() {
 *   return buildSeoMetadata({ title: "...", description: "...", path: "/about" });
 * }
 * export default function Page() {
 *   return <SEO schema={aboutPageJsonLd()}><Content /></SEO>;
 * }
 */
export default function SEO({ schema, children }) {
  return (
    <>
      {schema ? <JsonLd data={schema} /> : null}
      {children}
    </>
  );
}

export { buildSeoMetadata } from "../../lib/seo/buildSeoMetadata";
