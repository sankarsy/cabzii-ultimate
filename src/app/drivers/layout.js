import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Hire Acting Drivers & Chauffeurs",
  description:
    "Rent professional acting drivers for city and outstation trips. Hourly, daily and monthly chauffeur hire on Cabzii.",
  path: "/drivers",
  keywords: ["acting driver", "driver on hire", "chauffeur Chennai", "cabzii driver"]
});

export default function DriversLayout({ children }) {
  return children;
}
