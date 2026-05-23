import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Customer Testimonials",
  description: "Read verified reviews from Cabzii riders across India.",
  path: "/testimonials"
});

export default function TestimonialsLayout({ children }) {
  return children;
}
