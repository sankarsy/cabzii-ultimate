import HomePage from "../components/HomePage";
import { homeMetadata } from "../lib/seo";

export const metadata = homeMetadata;

export default function Page() {
  return <HomePage />;
}
