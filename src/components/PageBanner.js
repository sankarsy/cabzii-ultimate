import Breadcrumbs from "./seo/Breadcrumbs";
import { typo } from "../lib/typography";

export default function PageBanner({ title, subtitle, breadcrumbs = [] }) {
  return (
    <header className="mb-6">
      {breadcrumbs.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      <h1 className={typo.h1}>{title}</h1>
      {subtitle ? <p className={`mt-2 max-w-2xl ${typo.body}`}>{subtitle}</p> : null}
    </header>
  );
}
