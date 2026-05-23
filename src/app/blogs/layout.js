import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Travel Blog & Cab Booking Tips",
  description: "Guides on cab booking, acting drivers, airport transfers and outstation trips from Cabzii.",
  path: "/blogs",
  keywords: ["cab booking tips", "travel blog India", "cabzii blog", "outstation travel guide"]
});

export default function BlogsLayout({ children }) {
  return children;
}
