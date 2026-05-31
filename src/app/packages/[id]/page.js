import { redirect } from "next/navigation";

/** Legacy package detail URL → /holidays/[id] */
export default function PackageDetailRedirect({ params }) {
  redirect(`/holidays/${params.id}`);
}
