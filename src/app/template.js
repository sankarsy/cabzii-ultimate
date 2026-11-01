import RootClientChrome from "../components/RootClientChrome";
import { fetchSiteSettings } from "../lib/serverSiteSettings";

export default async function Template({ children }) {
  const siteSettings = await fetchSiteSettings();
  return <RootClientChrome initialSettings={siteSettings}>{children}</RootClientChrome>;
}
