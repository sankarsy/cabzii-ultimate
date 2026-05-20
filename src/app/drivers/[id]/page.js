import DriverDetailPage from "../../../components/DriverDetailPage";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function generateMetadata({ params }) {
  const id = params?.id;
  if (!id) {
    return {
      title: "Driver Booking",
      description: "Book professional drivers online with transparent fares on cabzii.in."
    };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/drivers/${encodeURIComponent(id)}`, {
      next: { revalidate: 300 }
    });
    const json = await res.json();
    const driver = json?.data;
    if (!driver) {
      return { title: "Driver Not Found" };
    }

    const title = driver.seoTitle || `${driver.name} – Professional Driver Booking`;
    const description =
      driver.seoDescription ||
      `Book ${driver.name} by ${driver.vendor || "Cabzii"}. Local & outstation driver packages on cabzii.in.`;
    const keywords = (driver.seo || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      title,
      description,
      keywords: keywords.length ? keywords : undefined,
      alternates: {
        canonical: `/drivers/${id}`
      },
      openGraph: {
        title,
        description,
        url: `/drivers/${id}`,
        images: driver.image ? [{ url: driver.image, alt: driver.name }] : undefined
      }
    };
  } catch {
    return {
      title: "Driver Booking",
      description: "Book drivers online on cabzii.in."
    };
  }
}

export default function DriverDetailRoutePage({ params }) {
  return <DriverDetailPage driverId={params.id} />;
}
