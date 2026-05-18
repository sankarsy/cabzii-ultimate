import CabDetailPage from "../../../components/CabDetailPage";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function generateMetadata({ params }) {
  const id = params?.id;
  if (!id) {
    return {
      title: "Cab Booking",
      description: "Book local and outstation cabs online with transparent fares on cabzii.in."
    };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/cabs/${encodeURIComponent(id)}`, {
      next: { revalidate: 300 }
    });
    const json = await res.json();
    const cab = json?.data;
    if (!cab) {
      return { title: "Cab Not Found" };
    }

    const title = cab.seoTitle || `${cab.title} – ${cab.type} Cab Booking`;
    const description =
      cab.seoDescription ||
      `Book ${cab.title} by ${cab.vendor}. Local & outstation packages, verified drivers, secure payment on cabzii.in.`;
    const keywords = (cab.seo || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      title,
      description,
      keywords: keywords.length ? keywords : undefined,
      alternates: {
        canonical: `/cabs/${id}`
      },
      openGraph: {
        title,
        description,
        url: `/cabs/${id}`,
        images: cab.image ? [{ url: cab.image, alt: cab.title }] : undefined
      }
    };
  } catch {
    return {
      title: "Cab Booking",
      description: "Book cabs online on cabzii.in."
    };
  }
}

export default function CabDetailRoutePage({ params }) {
  return <CabDetailPage cabId={params.id} />;
}
