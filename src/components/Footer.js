"use client";

import FooterSeoLinks from "./seo/FooterSeoLinks";
import { useSiteSettings } from "./SiteSettingsProvider";

export default function Footer() {
  const settings = useSiteSettings();
  const { contact, footerQuickLinks, footerLegalLinks, siteName, tagline } = settings;

  return (
    <footer className="mt-14 border-t border-slate-200 bg-slate-950 py-12 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-sky-400">{siteName || "cabzii.in"}</h3>
            <p className="mt-2 text-sm text-slate-400">{tagline}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              {(footerQuickLinks || []).map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-sky-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Contact Details</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              {contact?.email ? <li>Email: {contact.email}</li> : null}
              {contact?.phone ? <li>Phone: {contact.phone}</li> : null}
              {contact?.address ? <li>Address: {contact.address}</li> : null}
              {contact?.hours ? <li>{contact.hours}</li> : null}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              {(footerLegalLinks || []).map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-sky-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FooterSeoLinks />

        <div className="mt-8 border-t border-slate-800 pt-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {siteName || "cabzii.in"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
