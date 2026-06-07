import { redirect } from "next/navigation";

const ALLOWED_TABS = ["cabs", "drivers", "packages", "bookings", "blogs", "testimonials", "seoServices", "seoRoutes"];

export default function AdminCreateRedirectPage({ params }) {
  const tab = params?.tab;
  if (!ALLOWED_TABS.includes(tab)) {
    redirect("/admin");
  }
  redirect(`/admin?tab=${tab}&mode=create`);
}
