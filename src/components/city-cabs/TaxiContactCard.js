import { Mail, MapPin, Phone } from "lucide-react";
import { ORG_ADDRESS, ORG_EMAIL, ORG_MAPS_URL, ORG_PHONE } from "../../lib/seo/constants";
import { telUrl } from "../../lib/conversion";

function IconBubble({ children }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 text-slate-900">
      {children}
    </span>
  );
}

export default function TaxiContactCard({ cityName }) {
  const address = `${ORG_ADDRESS.streetAddress}, ${ORG_ADDRESS.addressLocality}, ${ORG_ADDRESS.addressRegion} ${ORG_ADDRESS.postalCode}`;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-[15px] font-bold text-slate-900">Cabzii {cityName} Taxi Contact</h2>
      <ul className="mt-3 space-y-3 text-sm text-slate-800">
        <li className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-900">Address</p>
            <a href={ORG_MAPS_URL} className="mt-0.5 block break-words text-[12px] leading-relaxed text-slate-600 hover:underline">
              {address}
            </a>
          </div>
          <IconBubble>
            <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden />
          </IconBubble>
        </li>
        <li className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold text-slate-900">Phone</p>
            <a href={telUrl(ORG_PHONE)} className="mt-0.5 block text-[13px] font-semibold text-slate-800 hover:underline">
              {ORG_PHONE.replace("+91-", "")}
            </a>
          </div>
          <a href={telUrl(ORG_PHONE)} aria-label="Call Cabzii">
            <IconBubble>
              <Phone className="h-4 w-4" strokeWidth={2} aria-hidden />
            </IconBubble>
          </a>
        </li>
        <li className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-900">Email</p>
            <a href={`mailto:${ORG_EMAIL}`} className="mt-0.5 block break-all text-[13px] font-semibold text-slate-800 hover:underline">
              {ORG_EMAIL}
            </a>
          </div>
          <a href={`mailto:${ORG_EMAIL}`} aria-label="Email Cabzii">
            <IconBubble>
              <Mail className="h-4 w-4" strokeWidth={2} aria-hidden />
            </IconBubble>
          </a>
        </li>
      </ul>
    </div>
  );
}
