import { typo } from "../../lib/typography";

/** Shared section header — eyebrow, title, subtitle. */
export default function SectionIntro({ eyebrow, title, subtitle, className = "" }) {
  return (
    <div className={className}>
      {eyebrow ? <p className={typo.eyebrow}>{eyebrow}</p> : null}
      {title ? <h2 className={`mt-1.5 ${typo.h2}`}>{title}</h2> : null}
      {subtitle ? <p className={`mt-1.5 max-w-2xl ${typo.body}`}>{subtitle}</p> : null}
    </div>
  );
}
