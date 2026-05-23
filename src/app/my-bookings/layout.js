export const metadata = {
  title: "My Bookings",
  description: "View your upcoming and completed cab, driver and tour bookings on Cabzii.",
  alternates: { canonical: "/my-bookings" },
  robots: { index: false, follow: false }
};

export default function MyBookingsLayout({ children }) {
  return children;
}
