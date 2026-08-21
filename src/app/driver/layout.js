import { buildPageMetadata } from "../../lib/seo";
import DriverGuard from "../../components/driver/DriverGuard";

export const dynamic = "force-dynamic";

export const metadata = {
  ...buildPageMetadata({
    title: "Driver",
    description: "Cabzii driver trips.",
    path: "/driver",
    noindex: true
  }),
  manifest: "/driver/manifest",
  applicationName: "Cabzii Driver",
  appleWebApp: {
    capable: true,
    title: "Cabzii Driver",
    statusBarStyle: "default"
  }
};

export default function DriverLayout({ children }) {
  return <DriverGuard>{children}</DriverGuard>;
}
