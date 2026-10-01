import { permanentRedirect } from "next/navigation";
import { actingDriverLandingPath } from "../../lib/cityCabPaths";

export default function CallDriversChennaiRoute() {
  permanentRedirect(actingDriverLandingPath("chennai"));
}
