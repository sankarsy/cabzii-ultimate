import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";
import { buildPageMetadata } from "../../lib/seo/constants";

export const metadata = buildPageMetadata({
  title: "Holiday Packages — Pilgrimage, Beach & Hill Trips",
  description:
    "Book pilgrimage, beach, heritage and family holiday packages on cabzii.in. Choose cab type — sedan, SUV, Innova or tempo. Toll, permit & driver bata extra.",
  path: "/holidays",
  keywords: [
    "holiday packages India",
    "pilgrimage tour packages",
    "Tirupati package",
    "Rameswaram tour",
    "Goa holiday package",
    "cab with holiday package",
    "cabzii holidays"
  ]
});

export default function HolidaysLayout({ children }) {
  return <TravelLayoutClient>{children}</TravelLayoutClient>;
}
