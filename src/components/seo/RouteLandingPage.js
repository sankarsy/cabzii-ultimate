import { routeToTrip } from "../../lib/routeTrip";
import Breadcrumbs from "./Breadcrumbs";
import SeoRouteCabListing from "./SeoRouteCabListing";
import OutstationPageBelow, { SeoPageArticle } from "../city-cabs/OutstationPageBelow";
import ChennaiClusterLinks from "./ChennaiClusterLinks";
import SeoPageView from "./SeoPageView";
import { cityCabLandingPath } from "../../lib/cityCabPaths";
import { outstationHubPath, routePublicPath } from "../../lib/seo/outstationPaths";

export default function RouteLandingPage({ route, faqs, extraBody = "", cabs = [], path: pathProp }) {
  const { fromCity, toCity, slug } = route;
  const path = pathProp || routePublicPath(slug);
  const trip = routeToTrip(route);

  return (
    <div>
      <SeoPageView
        pageType="route"
        city={fromCity.slug}
        origin={fromCity.slug}
        destination={toCity.slug}
        route={slug}
      />

      <div className="sr-only">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: fromCity.name, path: cityCabLandingPath(fromCity.slug) },
            { name: "Outstation", path: outstationHubPath(fromCity.slug) },
            { name: `${fromCity.name} to ${toCity.name}`, path }
          ]}
        />
      </div>

      <SeoRouteCabListing initialTrip={trip} initialCabs={cabs} />

      <OutstationPageBelow fromName={fromCity.name} fromSlug={fromCity.slug} toName={toCity.name} faqs={faqs}>
        <div>
          <SeoPageArticle html={extraBody} />
          {fromCity.slug === "chennai" ? (
            <ChennaiClusterLinks title="More Chennai services" excludeHref={path} />
          ) : null}
        </div>
      </OutstationPageBelow>
    </div>
  );
}
