import { redirect } from "next/navigation";

/** Account bookings tab → existing My Trips page */
export default function AccountBookingsPage() {
  redirect("/my-bookings");
}
