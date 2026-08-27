import { buildPageMetadata, SITE_NAME, SITE_URL } from "./constants";

/**
 * Central SEO metadata builder for Next.js `generateMetadata`.
 * Maps the prompt's SEO.jsx props to the Metadata API (no react-helmet).
 */
export function buildSeoMetadata({
  title,
  description,
  path = "/",
  keywords,
  image,
  imageAlt,
  imageWidth = 1200,
  imageHeight = 630,
  url,
  canonical,
  schema,
  robots,
  type = "website",
  noindex = false,
  follow = true,
  languages,
  verification
}) {
  const resolvedPath = canonical || path || "/";
  const noIndex = noindex || robots === "noindex,nofollow" || robots === "noindex, nofollow";
  const noFollow =
    follow === false ||
    robots === "noindex,nofollow" ||
    robots === "noindex, nofollow" ||
    robots === "none";

  const meta = buildPageMetadata({
    title,
    description,
    path: resolvedPath,
    keywords,
    image,
    imageAlt,
    imageWidth,
    imageHeight,
    url: url || resolvedPath,
    type,
    noindex: noIndex,
    follow: !noFollow,
    languages,
    verification
  });

  return meta;
}

export { SITE_NAME, SITE_URL };
