import HomePage from "../components/HomePage";
import { fetchCatalogList } from "../lib/serverCatalog";
import { homeMetadata } from "../lib/seo";

export const metadata = homeMetadata;

export default async function Page() {
  const [cabs, packages, drivers, blogs, testimonials] = await Promise.all([
    fetchCatalogList("cabs", 6),
    fetchCatalogList("packages", 6),
    fetchCatalogList("drivers", 3),
    fetchCatalogList("blogs", 6),
    fetchCatalogList("testimonials", 6)
  ]);

  return (
    <HomePage
      initial={{
        cabs,
        packages,
        drivers,
        blogs,
        testimonials
      }}
    />
  );
}
