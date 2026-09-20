import JsonLd from "../../components/seo/JsonLd";
import CallDriversChennaiPage from "../../components/call-drivers/CallDriversChennaiPage";
import { buildPageMetadata, SITE_URL } from "../../lib/seo";
import { buildCallDriversChennaiJsonLd } from "../../lib/schema";
import { CALL_DRIVERS_CHENNAI } from "../../data/call-drivers-chennai";
import { SITE_LOGO, SOCIAL_PROFILES } from "../../lib/seo/constants";
import { SEO_REVALIDATE_SECONDS } from "../../lib/revalidation/constants";

export const revalidate = SEO_REVALIDATE_SECONDS;

const data = CALL_DRIVERS_CHENNAI;

export async function generateMetadata() {
  const meta = buildPageMetadata({
    title: data.title,
    description: data.description,
    path: data.path,
    image: "/call-drivers-chennai/opengraph-image",
    imageAlt: data.hero.alt,
    imageWidth: 1200,
    imageHeight: 630,
    type: "website"
  });
  return {
    ...meta,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    }
  };
}

export default function CallDriversChennaiRoute() {
  const pageUrl = `${SITE_URL}${data.path}`;
  const offers = [
    { name: "City call driver", price: data.tariffRows[0].standard },
    { name: "Outstation driver", price: data.tariffRows[2].standard },
    { name: "Airport pickup and drop driver", price: data.tariffRows[3].standard },
    { name: "School pickup and drop driver" },
    { name: "Event drivers" }
  ];
  const jsonLd = buildCallDriversChennaiJsonLd({
    pageUrl,
    name: data.h1,
    description: data.description,
    telephone: data.telephoneSchema,
    email: data.email,
    sameAs: SOCIAL_PROFILES,
    logoUrl: SITE_LOGO,
    address: data.address,
    offers,
    faqs: data.faqs
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <CallDriversChennaiPage />
    </>
  );
}
