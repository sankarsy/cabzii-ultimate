import { redirect } from "next/navigation";

const ALLOWED_TABS = ["cabs", "drivers", "packages", "bookings", "blogs", "testimonials"];

export default function AdminViewRedirectPage({ params }) {
  const tab = params?.tab;
  const id = params?.id;
  if (!ALLOWED_TABS.includes(tab) || !id) {
    redirect("/admin");
  }
  redirect(`/admin?tab=${tab}&mode=view&view=${id}`);
}
