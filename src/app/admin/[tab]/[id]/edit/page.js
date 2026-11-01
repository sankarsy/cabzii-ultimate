import { redirect } from "next/navigation";

const ALLOWED_TABS = ["cabs", "drivers", "buses", "bookings", "blogs", "testimonials", "seoServices", "seoRoutes"];

export default function AdminEditRedirectPage({ params }) {
  const tab = params?.tab;
  const id = params?.id;
  if (tab === "drivers") {
    redirect("/admin?tab=ops");
  }
  if (!ALLOWED_TABS.includes(tab) || !id) {
    redirect("/admin");
  }
  redirect(`/admin?tab=${tab}&mode=edit&edit=${id}`);
}
